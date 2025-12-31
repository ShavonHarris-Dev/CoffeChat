import React, { memo, useState } from 'react';
import { MoreVertical, Calendar, StickyNote, Check } from 'lucide-react';

/**
 * Card component for displaying a connection in the pipeline view
 */
const PipelineCard = memo(({
  connection,
  status,
  onStatusChange,
  isBatchMode,
  isSelected,
  onToggleSelect,
  onViewNotes
}) => {
  const [showActions, setShowActions] = useState(false);

  // Status badge colors
  const statusColors = {
    queue: 'bg-gray-100 text-gray-700',
    reached_out: 'bg-blue-100 text-blue-700',
    responded: 'bg-green-100 text-green-700',
    meeting_scheduled: 'bg-purple-100 text-purple-700',
    met: 'bg-success/20 text-success',
    follow_up: 'bg-warning/20 text-warning'
  };

  // Status labels
  const statusLabels = {
    queue: 'Queue',
    reached_out: 'Reached Out',
    responded: 'Responded',
    meeting_scheduled: 'Meeting Scheduled',
    met: 'Met',
    follow_up: 'Follow Up'
  };

  // Status actions (next steps)
  const statusActions = {
    queue: [
      { label: 'Mark as Reached Out', value: 'reached_out', dateField: 'reachedOut' }
    ],
    reached_out: [
      { label: 'Mark as Responded', value: 'responded', dateField: 'responded' },
      { label: 'Move to Follow Up', value: 'follow_up', dateField: null }
    ],
    responded: [
      { label: 'Schedule Meeting', value: 'meeting_scheduled', dateField: 'meeting' },
      { label: 'Move to Follow Up', value: 'follow_up', dateField: null }
    ],
    meeting_scheduled: [
      { label: 'Mark as Met', value: 'met', dateField: 'met' }
    ],
    met: [
      { label: 'Move to Follow Up', value: 'follow_up', dateField: null }
    ],
    follow_up: [
      { label: 'Mark as Reached Out', value: 'reached_out', dateField: 'reachedOut' }
    ]
  };

  // Get status data from connection
  const statusData = status || {};
  const notes = statusData.notes || [];
  const hasNotes = notes.length > 0;

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const reachedOutDate = formatDate(statusData.reachedOutDate);
  const respondedDate = formatDate(statusData.respondedDate);
  const meetingDate = formatDate(statusData.meetingDate);
  const metDate = formatDate(statusData.metDate);

  // Current status value
  const currentStatus = statusData.status || 'queue';

  return (
    <div
      className={`bg-surface rounded-lg shadow-sm border-2 transition-all ${
        isSelected ? 'border-primary' : 'border-transparent'
      } hover:shadow-md`}
    >
      <div className="p-4">
        {/* Header with checkbox and actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            {/* Checkbox in batch mode */}
            {isBatchMode && (
              <button
                onClick={() => onToggleSelect(connection.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-primary border-primary'
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                {isSelected && <Check size={14} className="text-white" />}
              </button>
            )}

            {/* Avatar */}
            <img
              src={connection.avatar}
              alt={connection.name}
              className="w-12 h-12 rounded-full"
            />

            {/* Name and title */}
            <div className="flex-1">
              <h4 className="font-semibold text-text-primary">{connection.name}</h4>
              <p className="text-sm text-text-secondary">{connection.title}</p>
            </div>
          </div>

          {/* Actions dropdown */}
          {!isBatchMode && (
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <MoreVertical size={20} className="text-text-secondary" />
              </button>

              {showActions && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowActions(false)}
                  />

                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    {statusActions[currentStatus]?.map((action) => (
                      <button
                        key={action.value}
                        onClick={() => {
                          onStatusChange(connection.id, action.value, action.dateField);
                          setShowActions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => {
                        onViewNotes(connection.id);
                        setShowActions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                    >
                      {hasNotes ? 'View Notes' : 'Add Note'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className="mb-3">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[currentStatus]
            }`}
          >
            {statusLabels[currentStatus]}
          </span>
        </div>

        {/* Date stamps */}
        <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
          {reachedOutDate && (
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>Reached out: {reachedOutDate}</span>
            </div>
          )}
          {respondedDate && (
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>Responded: {respondedDate}</span>
            </div>
          )}
          {meetingDate && (
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>Meeting: {meetingDate}</span>
            </div>
          )}
          {metDate && (
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>Met: {metDate}</span>
            </div>
          )}
        </div>

        {/* Notes indicator */}
        {hasNotes && (
          <div className="flex items-center gap-1 text-xs text-primary">
            <StickyNote size={12} />
            <span>{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Connection metadata */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Connected {connection.dormantPeriod} ago</span>
            <span>{connection.relationshipScore}% match</span>
          </div>
        </div>
      </div>
    </div>
  );
});

PipelineCard.displayName = 'PipelineCard';

export default PipelineCard;
