import React, { memo, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

/**
 * Fixed bottom toolbar for batch actions on selected connections
 * Appears when connections are selected in batch mode
 */
const BatchActionsToolbar = memo(({
  selectedCount,
  onChangeStatus,
  onClearSelection
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // Status options for batch updates
  const statusOptions = [
    { label: 'Queue', value: 'queue', dateField: null },
    { label: 'Reached Out', value: 'reached_out', dateField: 'reachedOut' },
    { label: 'Responded', value: 'responded', dateField: 'responded' },
    { label: 'Meeting Scheduled', value: 'meeting_scheduled', dateField: 'meeting' },
    { label: 'Met', value: 'met', dateField: 'met' },
    { label: 'Follow Up', value: 'follow_up', dateField: null }
  ];

  const handleStatusChange = (status, dateField) => {
    onChangeStatus(status, dateField);
    setShowStatusMenu(false);
  };

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary shadow-lg z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Selection count */}
          <div className="flex items-center gap-4">
            <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              {selectedCount} selected
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Change status dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Change Status
                <ChevronDown size={16} />
              </button>

              {showStatusMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowStatusMenu(false)}
                  />

                  {/* Dropdown menu */}
                  <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                    <div className="px-3 py-2 text-xs font-semibold text-text-secondary uppercase border-b border-gray-100">
                      Update {selectedCount} connection{selectedCount !== 1 ? 's' : ''} to:
                    </div>
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value, option.dateField)}
                        className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Quick actions */}
            <button
              onClick={() => handleStatusChange('reached_out', 'reachedOut')}
              className="bg-blue-50 text-primary px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors"
            >
              Mark as Reached Out
            </button>

            {/* Clear selection */}
            <button
              onClick={onClearSelection}
              className="bg-gray-100 text-text-secondary px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <X size={16} />
              Clear
            </button>
          </div>
        </div>

        {/* Helper text */}
        <div className="mt-2 text-xs text-text-secondary text-center">
          Select connections to perform bulk actions
        </div>
      </div>
    </div>
  );
});

BatchActionsToolbar.displayName = 'BatchActionsToolbar';

export default BatchActionsToolbar;
