import React, { memo, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import Navigation from './Navigation';
import LoadingSpinner from './LoadingSpinner';

const MatchConfirmationView = () => {
  const { selectedMatch, navigateTo, addToast } = useApp();
  const [isMatching, setIsMatching] = useState(true);

  useEffect(() => {
    // Simulate matching process
    const timer = setTimeout(() => {
      setIsMatching(false);
      addToast('It\'s a match! You can now schedule a coffee chat.', 'success');
    }, 2000);

    return () => clearTimeout(timer);
  }, [addToast]);

  if (isMatching) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <h2 className="text-2xl font-bold text-text-primary mt-6 mb-2">
              Finding your match...
            </h2>
            <p className="text-text-secondary">
              We're checking if {selectedMatch?.name} is interested too!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-surface rounded-2xl shadow-lg p-8 text-center">
          {/* Success Animation */}
          <div className="w-24 h-24 mx-auto mb-6 bg-success/10 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-text-primary mb-2">
            It's a Match! 🎉
          </h1>
          
          <p className="text-text-secondary mb-8">
            Both you and {selectedMatch?.name} are interested in connecting for a coffee chat.
          </p>

          {selectedMatch && (
            <div className="flex items-center gap-4 mb-8 p-6 bg-primary/5 rounded-lg">
              <img 
                src={selectedMatch.avatar} 
                alt={selectedMatch.name}
                className="w-16 h-16 rounded-full"
              />
              <div className="text-left">
                <h3 className="font-semibold text-text-primary text-lg">{selectedMatch.name}</h3>
                <p className="text-text-secondary">{selectedMatch.title}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                  <span>📍 {selectedMatch.location}</span>
                  <span>⏰ {selectedMatch.availability}</span>
                  <span>☕ {selectedMatch.preferredMeetingStyle}</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-linkedin-blue/5 p-6 rounded-lg mb-8">
            <h4 className="font-semibold text-text-primary mb-3">What happens next?</h4>
            <div className="space-y-3 text-sm text-text-secondary text-left">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <p>You'll both receive an email with each other's contact information</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <p>Use our scheduling tool or reach out directly to coordinate</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <p>Meet up and enjoy your coffee chat!</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigateTo('schedule', selectedMatch)}
              className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-linkedin-blue-dark transition-colors"
            >
              Schedule Coffee Chat
            </button>
            <button
              onClick={() => navigateTo('discovery')}
              className="flex-1 bg-background text-text-secondary py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Find More Matches
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigateTo('dashboard')}
              className="text-primary hover:text-linkedin-blue-dark transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MatchConfirmationView);