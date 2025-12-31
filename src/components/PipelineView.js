import React, { memo, useState, useMemo } from 'react';
import { CheckSquare, Users, TrendingUp, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Navigation from './Navigation';
import PipelineCard from './PipelineCard';
import BatchActionsToolbar from './BatchActionsToolbar';
import NotesPanel from './NotesPanel';
import { getAnalytics } from '../utils/analyticsUtils';

/**
 * Main CRM Pipeline View
 * Displays all connections organized by status with batch actions
 */
const PipelineView = () => {
  const {
    connections,
    connectionStatuses,
    weeklyGoal,
    selectedConnections,
    isBatchMode,
    setIsBatchMode,
    updateConnectionStatus,
    batchUpdateStatus,
    addNote,
    deleteNote,
    toggleConnectionSelection,
    clearSelection,
    hasUploadedData
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingNotes, setViewingNotes] = useState(null); // connectionId for notes modal

  // Status tabs
  const statusTabs = [
    { label: 'All', value: 'all', count: 0 },
    { label: 'Queue', value: 'queue', count: 0 },
    { label: 'Reached Out', value: 'reached_out', count: 0 },
    { label: 'Responded', value: 'responded', count: 0 },
    { label: 'Meeting Scheduled', value: 'meeting_scheduled', count: 0 },
    { label: 'Met', value: 'met', count: 0 },
    { label: 'Follow Up', value: 'follow_up', count: 0 }
  ];

  // Get analytics data
  const analytics = useMemo(
    () => getAnalytics(connectionStatuses, weeklyGoal),
    [connectionStatuses, weeklyGoal]
  );

  // Organize connections by status with counts
  const connectionsByStatus = useMemo(() => {
    const byStatus = {
      all: [],
      queue: [],
      reached_out: [],
      responded: [],
      meeting_scheduled: [],
      met: [],
      follow_up: []
    };

    connections.forEach(connection => {
      const status = connectionStatuses[connection.id]?.status || 'queue';
      byStatus[status].push({
        ...connection,
        statusData: connectionStatuses[connection.id]
      });
      byStatus.all.push({
        ...connection,
        statusData: connectionStatuses[connection.id]
      });
    });

    // Update counts in tabs
    statusTabs.forEach(tab => {
      tab.count = byStatus[tab.value].length;
    });

    return byStatus;
  }, [connections, connectionStatuses]);

  // Filtered connections
  const filteredConnections = useMemo(() => {
    return connectionsByStatus[statusFilter] || [];
  }, [connectionsByStatus, statusFilter]);

  // Handle status change for single connection
  const handleStatusChange = (connectionId, newStatus, dateField) => {
    updateConnectionStatus(connectionId, newStatus, dateField);
  };

  // Handle batch status change
  const handleBatchStatusChange = (newStatus, dateField) => {
    const selectedIds = Array.from(selectedConnections);
    batchUpdateStatus(selectedIds, newStatus, dateField);
    clearSelection();
  };

  // Toggle batch mode
  const toggleBatchMode = () => {
    if (isBatchMode) {
      clearSelection();
    }
    setIsBatchMode(!isBatchMode);
  };

  // View notes for a connection
  const handleViewNotes = (connectionId) => {
    setViewingNotes(connectionId);
  };

  // Close notes modal
  const closeNotesModal = () => {
    setViewingNotes(null);
  };

  // Get connection for notes modal
  const notesConnection = useMemo(() => {
    if (!viewingNotes) return null;
    return connections.find(c => c.id === viewingNotes);
  }, [viewingNotes, connections]);

  const notesData = viewingNotes ? connectionStatuses[viewingNotes] : null;

  // Empty state
  if (!hasUploadedData || connections.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-surface rounded-2xl shadow-lg p-12 text-center">
            <Users size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              No Connections Yet
            </h2>
            <p className="text-text-secondary mb-6">
              Upload your LinkedIn connections to start tracking your networking pipeline
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Upload Connections
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-text-primary">Pipeline</h1>
            <button
              onClick={toggleBatchMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isBatchMode
                  ? 'bg-primary text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              <CheckSquare size={18} />
              {isBatchMode ? 'Exit Batch Mode' : 'Batch Select'}
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Users size={16} className="text-primary" />
                <span className="text-xs text-text-secondary">Total Tracked</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">{analytics.totalTracked}</p>
            </div>

            <div className="bg-surface rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-success" />
                <span className="text-xs text-text-secondary">Response Rate</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">{analytics.responseRate}%</p>
            </div>

            <div className="bg-surface rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Target size={16} className="text-warning" />
                <span className="text-xs text-text-secondary">This Week</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {analytics.weeklyVelocity}/{weeklyGoal}
              </p>
            </div>

            <div className="bg-surface rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Users size={16} className="text-purple-500" />
                <span className="text-xs text-text-secondary">Meetings</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">{analytics.meetingsScheduled}</p>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 border-b border-gray-200">
            {statusTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-4 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
                  statusFilter === tab.value
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Pipeline Cards Grid */}
        {filteredConnections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConnections.map(connection => (
              <PipelineCard
                key={connection.id}
                connection={connection}
                status={connection.statusData}
                onStatusChange={handleStatusChange}
                isBatchMode={isBatchMode}
                isSelected={selectedConnections.has(connection.id)}
                onToggleSelect={toggleConnectionSelection}
                onViewNotes={handleViewNotes}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface rounded-lg">
            <Users size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-text-secondary">
              No connections in {statusFilter === 'all' ? 'pipeline' : statusTabs.find(t => t.value === statusFilter)?.label}
            </p>
          </div>
        )}
      </div>

      {/* Batch Actions Toolbar */}
      <BatchActionsToolbar
        selectedCount={selectedConnections.size}
        onChangeStatus={handleBatchStatusChange}
        onClearSelection={clearSelection}
      />

      {/* Notes Modal */}
      {viewingNotes && notesConnection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-text-primary">{notesConnection.name}</h3>
                  <p className="text-sm text-text-secondary">{notesConnection.title}</p>
                </div>
                <button
                  onClick={closeNotesModal}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <NotesPanel
                connectionId={viewingNotes}
                notes={notesData?.notes || []}
                onAddNote={addNote}
                onDeleteNote={deleteNote}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(PipelineView);
