import React, { memo } from 'react';
import { Coffee, Users, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Navigation from './Navigation';
import StatCard from './StatCard';
import AnalyticsDashboard from './AnalyticsDashboard';

const Dashboard = () => {
  const { navigateTo, connections, hasUploadedData } = useApp();

  // Calculate stats from real data
  const totalConnections = hasUploadedData ? connections.length : 0;
  const oldConnections = hasUploadedData
    ? connections.filter(c => c.dormantMonths >= 12).length
    : 0;
  const topMatches = hasUploadedData
    ? connections.filter(c => c.relationshipScore >= 70).length
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Connections"
            value={totalConnections}
            subtext="LinkedIn connections"
            icon={Users}
            iconColor="primary"
          />

          <StatCard
            title="Old Connections"
            value={oldConnections}
            subtext="connected 1+ years ago"
            icon={Clock}
            iconColor="warning"
          />

          <StatCard
            title="Top Matches"
            value={topMatches}
            subtext="70%+ reconnection score"
            icon={Coffee}
            iconColor="success"
          />
        </div>

        {/* New Matches Available */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">
                {hasUploadedData ? 'Coffee Matches Available ☕' : 'Upload Your Connections'}
              </h2>
              <p className="text-primary-100 mb-4">
                {hasUploadedData
                  ? `${topMatches} top matches ready to reconnect`
                  : 'Upload your LinkedIn connections to find people to reconnect with'}
              </p>
              <button
                onClick={() => navigateTo(hasUploadedData ? 'discovery' : 'upload')}
                className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {hasUploadedData ? 'Start Matching' : 'Upload Connections'}
              </button>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Coffee size={32} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Networking Insights */}
        {hasUploadedData && (
          <div className="bg-surface rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-text-primary mb-6">Networking Insights</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="text-primary" size={24} />
                </div>
                <p className="text-2xl font-bold text-text-primary">{totalConnections}</p>
                <p className="text-sm text-text-secondary">Total connections</p>
              </div>

              <div className="text-center p-4 bg-warning/5 rounded-lg">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="text-warning" size={24} />
                </div>
                <p className="text-2xl font-bold text-text-primary">{oldConnections}</p>
                <p className="text-sm text-text-secondary">Old connections (1+ years)</p>
              </div>
            </div>

            {oldConnections > 0 && (
              <div className="mt-6 p-4 bg-success/10 rounded-lg">
                <p className="text-sm text-text-primary">
                  <strong>💡 Insight:</strong> You have {oldConnections} connections from over a year ago. These are great opportunities to reconnect and catch up!
                </p>
              </div>
            )}
          </div>
        )}

        {/* CRM Analytics */}
        {hasUploadedData && (
          <div className="mt-8">
            <AnalyticsDashboard />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Dashboard);
