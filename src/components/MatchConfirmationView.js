import React, { memo, useState } from 'react';
import { Copy, ExternalLink, Coffee } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Navigation from './Navigation';

const MatchConfirmationView = () => {
  const { selectedMatch, navigateTo, addToast, updateConnectionStatus } = useApp();
  const [copied, setCopied] = useState(false);

  // Generate personalized message
  const generateMessage = () => {
    if (!selectedMatch) return '';

    const firstName = selectedMatch.name.split(' ')[0];
    const timeSinceConnection = selectedMatch.dormantPeriod;

    return `Hi ${firstName},

I hope this message finds you well! I was going through my LinkedIn connections and came across your profile. I noticed we connected ${timeSinceConnection} ago${selectedMatch.company ? ` and saw you're now at ${selectedMatch.company}` : ''}.

I'd love to catch up over coffee sometime if you're open to it. It would be great to hear what you've been working on and share what I've been up to as well.

Let me know if you'd be interested - I'm happy to work around your schedule!

Best regards`;
  };

  const message = generateMessage();

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);

    // Mark as reached out in CRM
    if (selectedMatch?.id) {
      updateConnectionStatus(selectedMatch.id, 'reached_out', 'reachedOut');
    }

    addToast('Message copied! Connection marked as reached out.', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenLinkedIn = () => {
    if (selectedMatch?.url) {
      window.open(selectedMatch.url, '_blank', 'noopener,noreferrer');
    } else {
      addToast('LinkedIn profile URL not available', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-surface rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Coffee className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Ready to Reconnect!
            </h1>
            <p className="text-text-secondary">
              Here's everything you need to reach out to {selectedMatch?.name}
            </p>
          </div>

          {/* Connection Details */}
          {selectedMatch && (
            <div className="flex items-center gap-4 mb-6 p-4 bg-primary/5 rounded-lg">
              <img
                src={selectedMatch.avatar}
                alt={selectedMatch.name}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary text-lg">{selectedMatch.name}</h3>
                <p className="text-text-secondary text-sm">{selectedMatch.title}</p>
                <p className="text-text-secondary text-xs mt-1">
                  Connected {selectedMatch.dormantPeriod} ago • {selectedMatch.relationshipScore}% match
                </p>
              </div>
            </div>
          )}

          {/* Message Template */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-text-primary">Message Template</h4>
              <span className="text-xs text-text-secondary">Feel free to personalize this!</span>
            </div>
            <div className="relative">
              <textarea
                value={message}
                readOnly
                className="w-full h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 text-text-primary text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCopyMessage}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Copy size={20} />
              {copied ? 'Copied!' : 'Copy Message'}
            </button>

            <button
              onClick={handleOpenLinkedIn}
              className="w-full bg-linkedin-blue text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink size={20} />
              Open LinkedIn Profile
            </button>

            <button
              onClick={() => navigateTo('discovery')}
              className="w-full bg-background text-text-secondary py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-300"
            >
              Back to Discovery
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h5 className="font-semibold text-text-primary text-sm mb-2">Next Steps:</h5>
            <ol className="text-sm text-text-secondary space-y-1 list-decimal list-inside">
              <li>Copy the message above (or customize it)</li>
              <li>Click "Open LinkedIn Profile" to go to their profile</li>
              <li>Send them a message on LinkedIn</li>
              <li>Wait for their response and coordinate a time to meet!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MatchConfirmationView);