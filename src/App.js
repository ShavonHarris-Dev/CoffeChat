import React, { lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';

// Use React.lazy for code-splitting
const Dashboard = lazy(() => import('./components/Dashboard'));
const DiscoveryView = lazy(() => import('./components/DiscoveryView'));
const MatchConfirmationView = lazy(() => import('./components/MatchConfirmationView'));
const SchedulingView = lazy(() => import('./components/SchedulingView'));

// Loading component shown during lazy loading
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

const AppContent = () => {
  const { currentView, toasts, removeToast } = useApp();
  
  // Render the appropriate view based on currentView state
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'discovery':
        return <DiscoveryView />;
      case 'confirmation':
        return <MatchConfirmationView />;
      case 'schedule':
        return <SchedulingView />;
      default:
        return <Dashboard />;
    }
  };
  
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        {renderView()}
      </Suspense>
      
      {/* Toast notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
