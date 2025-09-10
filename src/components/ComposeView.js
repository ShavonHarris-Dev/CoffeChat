import React, { useState, memo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import Navigation from './Navigation';
import LoadingSpinner from './LoadingSpinner';
import MessageTemplates from './MessageTemplates';

const ComposeView = () => {
  const { navigateTo, selectedMatch, addToast, isLoading } = useApp();
  const [messageText, setMessageText] = useState('');
  const [followUp, setFollowUp] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef(null);

  // Pre-populate message with suggested opener when component mounts or selectedMatch changes
  useEffect(() => {
    if (selectedMatch?.suggestedOpener) {
      setMessageText(selectedMatch.suggestedOpener);
    }
    // Focus textarea for better accessibility
    textareaRef.current?.focus();
  }, [selectedMatch]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!messageText.trim()) {
      newErrors.message = 'Message cannot be empty';
    } else if (messageText.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters long';
    } else if (messageText.trim().length > 1000) {
      newErrors.message = 'Message should not exceed 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      addToast('Please fix the errors before sending', 'error');
      return;
    }

    setIsSending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Sending message:', {
        to: selectedMatch?.name,
        message: messageText,
        followUp
      });
      
      addToast(`Message sent to ${selectedMatch?.name}!`, 'success');
      navigateTo('confirmation');
    } catch (error) {
      addToast('Failed to send message. Please try again.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = () => {
    if (messageText.trim()) {
      addToast('Draft saved successfully', 'success');
      // In real app, would save to localStorage or backend
      localStorage.setItem(`draft_${selectedMatch?.id}`, JSON.stringify({
        message: messageText,
        followUp,
        timestamp: new Date().toISOString()
      }));
    }
    navigateTo('discovery');
  };

  const handleSelectTemplate = (templateContent) => {
    setMessageText(templateContent);
    setShowTemplates(false);
    if (errors.message) {
      setErrors(prev => ({ ...prev, message: '' }));
    }
    addToast('Template applied successfully', 'info');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-surface rounded-2xl shadow-lg p-6">
          {selectedMatch && (
            <div className="flex items-center gap-4 mb-6 p-4 bg-primary/5 rounded-lg">
              <img 
                src={selectedMatch.avatar} 
                alt={selectedMatch.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium text-text-primary">{selectedMatch.name}</h3>
                <p className="text-sm text-text-secondary">{selectedMatch.title}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                Message
              </label>
              <div className="relative">
                <textarea 
                  id="message"
                  ref={textareaRef}
                  className={`w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-colors ${
                    errors.message ? 'border-warning' : 'border-gray-200'
                  }`}
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    if (errors.message) {
                      setErrors(prev => ({ ...prev, message: '' }));
                    }
                  }}
                  placeholder="Write your personalized message here..."
                  aria-describedby={errors.message ? 'message-error' : 'message-help'}
                  maxLength={1000}
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button 
                    type="button"
                    className="text-primary hover:text-linkedin-blue-dark text-sm transition-colors"
                    aria-label="Get AI assistance for writing"
                  >
                    ✨ AI Assist
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowTemplates(true)}
                    className="text-primary hover:text-linkedin-blue-dark text-sm transition-colors"
                    aria-label="Choose from message templates"
                  >
                    📝 Templates
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 text-xs text-text-secondary">
                  {messageText.length}/1000
                </div>
              </div>
              {errors.message && (
                <p id="message-error" className="mt-1 text-sm text-warning" role="alert">
                  {errors.message}
                </p>
              )}
              <p id="message-help" className="mt-1 text-xs text-text-secondary">
                Write a personalized message to reconnect with your contact
              </p>
            </div>

            <div className="bg-warning/10 p-4 rounded-lg">
              <h4 className="font-medium text-text-primary mb-2">💡 Personalization Tips</h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Reference your shared background or mutual connections</li>
                <li>• Mention something specific from their recent activity</li>
                <li>• Be genuine about why you want to reconnect</li>
                <li>• Keep it concise and friendly</li>
              </ul>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary focus:ring-primary" 
                  checked={followUp}
                  onChange={(e) => setFollowUp(e.target.checked)}
                  aria-describedby="follow-up-help"
                />
                <span className="text-sm text-text-secondary">Send follow-up reminder in 1 week if no response</span>
              </label>
            </div>
            <p id="follow-up-help" className="text-xs text-text-secondary ml-6">
              We'll automatically send a gentle reminder if they don't respond within a week
            </p>
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              type="button"
              onClick={handleSaveDraft}
              className="flex-1 bg-background text-text-secondary py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              disabled={isSending}
            >
              Save Draft
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isSending || !messageText.trim()}
              className="flex-1 bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-linkedin-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <LoadingSpinner size="small" className="border-white" />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Message Templates Modal */}
      {showTemplates && (
        <MessageTemplates
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
};

export default memo(ComposeView);