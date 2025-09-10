import React, { useState } from 'react';

const MessageTemplates = ({ onSelectTemplate, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('reconnect');

  const templates = {
    reconnect: [
      {
        id: 1,
        title: "General Reconnection",
        content: "Hi [Name], I hope you're doing well! I was just thinking about our time at [Company/Event] and wanted to reach out to reconnect. I'd love to catch up over coffee and hear about what you've been working on. Are you free for a quick chat sometime this week?"
      },
      {
        id: 2,
        title: "Mutual Connection",
        content: "Hi [Name], [Mutual Connection] mentioned you recently and it reminded me that we should catch up! I've been following your work at [Current Company] and would love to hear more about it. Would you be interested in grabbing coffee soon?"
      }
    ],
    professional: [
      {
        id: 3,
        title: "Industry Insight",
        content: "Hi [Name], I've been following the developments in [Industry] and remember your expertise in this area. I'd love to get your perspective on [specific topic] over coffee. Would you be available for a brief chat in the coming weeks?"
      },
      {
        id: 4,
        title: "Collaboration",
        content: "Hi [Name], I'm working on [Project/Initiative] and remembered your experience with [relevant area]. I'd love to pick your brain and explore potential collaboration opportunities. Are you free for coffee sometime soon?"
      }
    ],
    casual: [
      {
        id: 5,
        title: "Friendly Check-in",
        content: "Hey [Name]! It's been way too long since we last connected. I saw your recent post about [recent activity] and it looked amazing! Would love to catch up over coffee and hear all about what you've been up to."
      }
    ]
  };

  const categories = {
    reconnect: "Reconnection",
    professional: "Professional",
    casual: "Casual"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-text-primary">Message Templates</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
            aria-label="Close templates"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex">
          {/* Categories */}
          <div className="w-1/3 border-r bg-background">
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`w-full text-left px-4 py-3 hover:bg-surface transition-colors ${
                  selectedCategory === key ? 'bg-primary text-white' : 'text-text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Templates */}
          <div className="flex-1 p-6 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {templates[selectedCategory]?.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                  <h4 className="font-medium text-text-primary mb-2">{template.title}</h4>
                  <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                    {template.content}
                  </p>
                  <button
                    onClick={() => onSelectTemplate(template.content)}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-linkedin-blue-dark transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageTemplates;