import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';

// Create context
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // State management
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Error handling
  const [error, setError] = useState(null);
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);
  
  // Navigation history
  const [navigationHistory, setNavigationHistory] = useState(['dashboard']);

  // Error handling functions
  const clearError = useCallback(() => setError(null), []);
  
  const handleError = useCallback((error, message = 'An error occurred') => {
    console.error(error);
    setError({ message, details: error.message || error });
    addToast(message, 'error');
  }, []);
  
  // Toast functions
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
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
    
    // Basic setters
    setCurrentView,
    setSelectedMatch,
    setUser,
    setIsLoading,
    
    // Enhanced functions
    navigateTo,
    goBack,
    handleError,
    clearError,
    addToast,
    removeToast
  }), [currentView, selectedMatch, user, isLoading, error, toasts, navigationHistory, navigateTo, goBack, handleError, clearError, addToast, removeToast]);

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
