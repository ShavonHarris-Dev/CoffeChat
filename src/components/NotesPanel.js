import React, { memo, useState } from 'react';
import { StickyNote, Trash2, Plus } from 'lucide-react';

/**
 * Notes panel for adding and viewing notes on a connection
 * Can be used inline in PipelineCard or in a modal
 */
const NotesPanel = memo(({ connectionId, notes = [], onAddNote, onDeleteNote }) => {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteType, setNewNoteType] = useState('general');
  const [isAdding, setIsAdding] = useState(false);

  // Note type options
  const noteTypes = [
    { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-700' },
    { value: 'meeting', label: 'Meeting', color: 'bg-blue-100 text-blue-700' },
    { value: 'follow_up', label: 'Follow Up', color: 'bg-warning/20 text-warning' }
  ];

  const handleAddNote = () => {
    if (newNoteContent.trim().length === 0) return;

    onAddNote(connectionId, newNoteContent, newNoteType);
    setNewNoteContent('');
    setNewNoteType('general');
    setIsAdding(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getNoteTypeColor = (type) => {
    const noteType = noteTypes.find(t => t.value === type);
    return noteType ? noteType.color : 'bg-gray-100 text-gray-700';
  };

  const getNoteTypeLabel = (type) => {
    const noteType = noteTypes.find(t => t.value === type);
    return noteType ? noteType.label : 'General';
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote size={18} className="text-text-secondary" />
          <h4 className="font-semibold text-text-primary">Notes</h4>
          <span className="text-xs text-text-secondary">({notes.length})</span>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-primary hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <Plus size={16} />
            Add Note
          </button>
        )}
      </div>

      {/* Add note form */}
      {isAdding && (
        <div className="bg-white rounded-lg p-4 space-y-3 border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Note Type
            </label>
            <div className="flex gap-2">
              {noteTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setNewNoteType(type.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    newNoteType === type.value
                      ? type.color
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Note Content
            </label>
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Add your note here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={3}
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddNote}
              disabled={newNoteContent.trim().length === 0}
              className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Note
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewNoteContent('');
                setNewNoteType('general');
              }}
              className="px-4 py-2 bg-gray-100 text-text-secondary rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Notes list */}
      {notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-lg p-3 border border-gray-200"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNoteTypeColor(note.type)}`}>
                  {getNoteTypeLabel(note.type)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary">
                    {formatDate(note.createdAt)}
                  </span>
                  <button
                    onClick={() => onDeleteNote(connectionId, note.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete note"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-text-primary whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      ) : !isAdding ? (
        <div className="text-center py-8">
          <StickyNote size={32} className="text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-text-secondary">No notes yet</p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-2 text-primary hover:text-blue-700 text-sm font-medium"
          >
            Add your first note
          </button>
        </div>
      ) : null}
    </div>
  );
});

NotesPanel.displayName = 'NotesPanel';

export default NotesPanel;
