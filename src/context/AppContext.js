import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storageUtils';

// Create context
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // State management
  const [currentView, setCurrentView] = useState('upload'); // Start with upload view
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Connection data from CSV upload - initialized from localStorage
  const [connections, setConnections] = useState(() => loadFromLocalStorage('connections', []));
  const [hasUploadedData, setHasUploadedData] = useState(() => loadFromLocalStorage('hasUploadedData', false));

  // CRM features - initialized from localStorage
  const [connectionStatuses, setConnectionStatuses] = useState(() => loadFromLocalStorage('connectionStatuses', {}));
  const [weeklyGoal, setWeeklyGoal] = useState(() => loadFromLocalStorage('weeklyGoal', 5));
  const [selectedConnections, setSelectedConnections] = useState(new Set()); // For batch actions
  const [isBatchMode, setIsBatchMode] = useState(false);

  // Error handling
  const [error, setError] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Navigation history
  const [navigationHistory, setNavigationHistory] = useState(['upload']);

  // Error handling functions
  const clearError = useCallback(() => setError(null), []);
  
  const handleError = useCallback((error, message = 'An error occurred') => {
    console.error(error);
    setError({ message, details: error.message || error });
    addToast(message, 'error');
  }, []);
  
  // Toast functions
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random(); // Make unique even if called simultaneously
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);
  
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  // Enhanced navigation with history
  const navigateTo = useCallback((view, match = null) => {
    setNavigationHistory(prev => [...prev, view]);
    setCurrentView(view);
    if (match) setSelectedMatch(match);
    clearError(); // Clear any existing errors when navigating
  }, [clearError]);
  
  const goBack = useCallback(() => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current view
      const previousView = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentView(previousView);
      clearError();
    }
  }, [navigationHistory, clearError]);

  // Handle uploaded connections
  const handleConnectionsUpload = useCallback((uploadedConnections) => {
    setConnections(uploadedConnections);
    setHasUploadedData(true);
    addToast('Connections imported successfully', 'success');
    navigateTo('dashboard');
  }, [addToast, navigateTo]);

  // CRM: Update connection status
  const updateConnectionStatus = useCallback((connectionId, status, dateField = null) => {
    setConnectionStatuses(prev => {
      const existing = prev[connectionId] || { notes: [] };
      const updated = {
        ...existing,
        status,
        lastModified: new Date().toISOString()
      };

      // Set date field if provided
      if (dateField) {
        const dateFieldName = `${dateField}Date`;
        updated[dateFieldName] = new Date().toISOString();
      }

      return {
        ...prev,
        [connectionId]: updated
      };
    });
  }, []);

  // CRM: Batch update status
  const batchUpdateStatus = useCallback((connectionIds, status, dateField = null) => {
    setConnectionStatuses(prev => {
      const updates = {};
      const now = new Date().toISOString();

      connectionIds.forEach(id => {
        const existing = prev[id] || { notes: [] };
        const updated = {
          ...existing,
          status,
          lastModified: now
        };

        if (dateField) {
          const dateFieldName = `${dateField}Date`;
          updated[dateFieldName] = now;
        }

        updates[id] = updated;
      });

      return { ...prev, ...updates };
    });

    addToast(`Updated ${connectionIds.length} connection(s)`, 'success');
  }, [addToast]);

  // CRM: Add note to connection
  const addNote = useCallback((connectionId, content, type = 'general') => {
    if (!content || content.trim().length === 0) {
      addToast('Note cannot be empty', 'error');
      return;
    }

    setConnectionStatuses(prev => {
      const existing = prev[connectionId] || { status: 'queue', notes: [] };
      const newNote = {
        id: `note_${Date.now()}_${Math.random()}`,
        content: content.trim(),
        type,
        createdAt: new Date().toISOString()
      };

      return {
        ...prev,
        [connectionId]: {
          ...existing,
          notes: [...existing.notes, newNote],
          lastModified: new Date().toISOString()
        }
      };
    });

    addToast('Note added', 'success');
  }, [addToast]);

  // CRM: Delete note
  const deleteNote = useCallback((connectionId, noteId) => {
    setConnectionStatuses(prev => {
      const existing = prev[connectionId];
      if (!existing) return prev;

      return {
        ...prev,
        [connectionId]: {
          ...existing,
          notes: existing.notes.filter(note => note.id !== noteId),
          lastModified: new Date().toISOString()
        }
      };
    });

    addToast('Note deleted', 'success');
  }, [addToast]);

  // CRM: Toggle connection selection (for batch mode)
  const toggleConnectionSelection = useCallback((connectionId) => {
    setSelectedConnections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(connectionId)) {
        newSet.delete(connectionId);
      } else {
        newSet.add(connectionId);
      }
      return newSet;
    });
  }, []);

  // CRM: Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedConnections(new Set());
    setIsBatchMode(false);
  }, []);

  // CRM: Select all connections in a specific status
  const selectAllInStatus = useCallback((status) => {
    const idsInStatus = Object.entries(connectionStatuses)
      .filter(([_, data]) => (data.status || 'queue') === status)
      .map(([id, _]) => id);

    setSelectedConnections(new Set(idsInStatus));
    addToast(`Selected ${idsInStatus.length} connection(s)`, 'info');
  }, [connectionStatuses, addToast]);

  // CRM: Update weekly goal
  const updateWeeklyGoal = useCallback((goal) => {
    const numGoal = parseInt(goal, 10);
    if (isNaN(numGoal) || numGoal < 0) {
      addToast('Invalid goal value', 'error');
      return;
    }
    setWeeklyGoal(numGoal);
    addToast('Weekly goal updated', 'success');
  }, [addToast]);

  // Auto-save to localStorage with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage('connections', connections);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [connections]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage('connectionStatuses', connectionStatuses);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [connectionStatuses]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage('weeklyGoal', weeklyGoal);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [weeklyGoal]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage('hasUploadedData', hasUploadedData);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [hasUploadedData]);

  // Memoized context value
  const value = useMemo(() => ({
    // State
    currentView,
    selectedMatch,
    user,
    isLoading,
    error,
    toasts,
    navigationHistory,
    connections,
    hasUploadedData,

    // CRM State
    connectionStatuses,
    weeklyGoal,
    selectedConnections,
    isBatchMode,

    // Basic setters
    setCurrentView,
    setSelectedMatch,
    setUser,
    setIsLoading,
    setConnections,
    setIsBatchMode,

    // Enhanced functions
    navigateTo,
    goBack,
    handleError,
    clearError,
    addToast,
    removeToast,
    handleConnectionsUpload,

    // CRM Functions
    updateConnectionStatus,
    batchUpdateStatus,
    addNote,
    deleteNote,
    toggleConnectionSelection,
    clearSelection,
    selectAllInStatus,
    updateWeeklyGoal
  }), [
    currentView,
    selectedMatch,
    user,
    isLoading,
    error,
    toasts,
    navigationHistory,
    connections,
    hasUploadedData,
    connectionStatuses,
    weeklyGoal,
    selectedConnections,
    isBatchMode,
    navigateTo,
    goBack,
    handleError,
    clearError,
    addToast,
    removeToast,
    handleConnectionsUpload,
    updateConnectionStatus,
    batchUpdateStatus,
    addNote,
    deleteNote,
    toggleConnectionSelection,
    clearSelection,
    selectAllInStatus,
    updateWeeklyGoal
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
