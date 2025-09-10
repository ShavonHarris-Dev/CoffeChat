import React from 'react';
import { useApp } from '../context/AppContext';

const Navigation = () => {
  const { currentView, navigationHistory, goBack, navigateTo } = useApp();

  const canGoBack = navigationHistory.length > 1;

  const getViewTitle = (view) => {
    switch (view) {
      case 'dashboard':
        return 'Dashboard';
      case 'discovery':
        return 'Discover Connections';
      case 'compose':
        return 'Compose Message';
      case 'confirmation':
        return 'Message Sent';
      default:
        return 'Coffee Chat';
    }
  };

  const renderBreadcrumbs = () => {
    return (
      <nav className="flex items-center space-x-2 text-sm text-text-secondary">
        {navigationHistory.map((view, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            <button
              onClick={() => {
                if (index < navigationHistory.length - 1) {
                  // Navigate to this specific view in history
                  const newHistory = navigationHistory.slice(0, index + 1);
                  navigateTo(view);
                }
              }}
              className={`hover:text-primary transition-colors ${
                index === navigationHistory.length - 1 
                  ? 'text-text-primary font-medium cursor-default' 
                  : 'hover:underline'
              }`}
              disabled={index === navigationHistory.length - 1}
            >
              {getViewTitle(view)}
            </button>
          </div>
        ))}
      </nav>
    );
  };

  return (
    <header className="bg-surface border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {canGoBack && (
            <button
              onClick={goBack}
              className="flex items-center text-text-secondary hover:text-primary transition-colors"
              aria-label="Go back"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
          <h1 className="text-2xl font-bold text-text-primary">
            {getViewTitle(currentView)}
          </h1>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Quick navigation buttons */}
          <nav className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigateTo('dashboard')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-primary hover:bg-background'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigateTo('discovery')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentView === 'discovery'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-primary hover:bg-background'
              }`}
            >
              Discover
            </button>
          </nav>
        </div>
      </div>
      
      {/* Breadcrumbs */}
      <div className="mt-2">
        {renderBreadcrumbs()}
      </div>
    </header>
  );
};

export default Navigation;