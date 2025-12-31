import React, { memo, useMemo } from 'react';
import { TrendingUp, Calendar, Target, Users, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from './StatCard';
import { getAnalytics, getWeeklyTrend, getAverageDaysToResponse } from '../utils/analyticsUtils';

/**
 * Analytics Dashboard Component
 * Displays networking performance metrics and trends
 */
const AnalyticsDashboard = memo(() => {
  const { connectionStatuses, weeklyGoal, updateWeeklyGoal, navigateTo } = useApp();

  // Get analytics data
  const analytics = useMemo(
    () => getAnalytics(connectionStatuses, weeklyGoal),
    [connectionStatuses, weeklyGoal]
  );

  // Get weekly trend data
  const weeklyTrend = useMemo(
    () => getWeeklyTrend(connectionStatuses),
    [connectionStatuses]
  );

  // Get average response time
  const avgResponseTime = useMemo(
    () => getAverageDaysToResponse(connectionStatuses),
    [connectionStatuses]
  );

  // Calculate goal progress color
  const getGoalProgressColor = (progress) => {
    if (progress >= 100) return 'success';
    if (progress >= 70) return 'primary';
    if (progress >= 40) return 'warning';
    return 'gray-400';
  };

  const goalProgressColor = getGoalProgressColor(analytics.goalProgress);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Analytics</h2>
        <button
          onClick={() => navigateTo('pipeline')}
          className="text-primary hover:text-blue-700 text-sm font-medium"
        >
          View Full Pipeline →
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Weekly Progress"
          value={`${analytics.weeklyVelocity}/${weeklyGoal}`}
          subtext={`${analytics.goalProgress}% of goal`}
          icon={Target}
          iconColor={goalProgressColor}
        />

        <StatCard
          title="Response Rate"
          value={`${analytics.responseRate}%`}
          subtext="of outreach replied"
          icon={TrendingUp}
          iconColor={analytics.responseRate >= 30 ? 'success' : 'warning'}
        />

        <StatCard
          title="Meetings Scheduled"
          value={analytics.meetingsScheduled}
          subtext={`${analytics.meetingsCompleted} completed`}
          icon={Calendar}
          iconColor="primary"
        />

        <StatCard
          title="Total Tracked"
          value={analytics.totalTracked}
          subtext="connections in pipeline"
          icon={Users}
          iconColor="purple-500"
        />
      </div>

      {/* Pipeline Breakdown */}
      <div className="bg-surface rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Pipeline Breakdown</h3>

        <div className="space-y-3">
          {/* Queue */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="text-sm text-text-primary">Queue</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">
              {analytics.statusCounts.queue}
            </span>
          </div>

          {/* Reached Out */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-text-primary">Reached Out</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">
              {analytics.statusCounts.reached_out}
            </span>
          </div>

          {/* Responded */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-text-primary">Responded</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">
              {analytics.statusCounts.responded}
            </span>
          </div>

          {/* Meeting Scheduled */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm text-text-primary">Meeting Scheduled</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">
              {analytics.statusCounts.meeting_scheduled}
            </span>
          </div>

          {/* Met */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600" />
              <span className="text-sm text-text-primary">Met</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">
              {analytics.statusCounts.met}
            </span>
          </div>

          {/* Follow Up */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm text-text-primary">Follow Up</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">
              {analytics.statusCounts.follow_up}
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-surface rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Weekly Trend</h3>

        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyTrend.map((week, index) => {
            const maxCount = Math.max(...weeklyTrend.map(w => w.count), 1);
            const heightPercent = (week.count / maxCount) * 100;

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-24">
                  <div
                    className="w-full bg-primary rounded-t transition-all hover:bg-blue-700"
                    style={{ height: `${heightPercent}%`, minHeight: week.count > 0 ? '8px' : '0' }}
                    title={`${week.count} connections`}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-text-primary">{week.count}</p>
                  <p className="text-xs text-text-secondary">{week.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Response Time */}
        {avgResponseTime !== null && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-text-primary mb-2">Average Response Time</h4>
            <p className="text-2xl font-bold text-primary mb-1">{avgResponseTime} days</p>
            <p className="text-sm text-text-secondary">
              Average time for connections to respond
            </p>
          </div>
        )}

        {/* Goal Setting */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-text-primary">Weekly Goal</h4>
            <Settings size={16} className="text-purple-500" />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="50"
              value={weeklyGoal}
              onChange={(e) => updateWeeklyGoal(e.target.value)}
              className="w-20 px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <span className="text-sm text-text-secondary">connections per week</span>
          </div>
        </div>
      </div>

      {/* Motivation */}
      {analytics.weeklyVelocity >= weeklyGoal && (
        <div className="bg-gradient-to-r from-success to-green-600 rounded-lg p-4 text-white">
          <h4 className="font-bold mb-1">🎉 Goal Achieved!</h4>
          <p className="text-sm text-green-50">
            You've reached your weekly goal. Keep up the great networking!
          </p>
        </div>
      )}

      {analytics.weeklyVelocity < weeklyGoal && analytics.weeklyVelocity > 0 && (
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-lg p-4 text-white">
          <h4 className="font-bold mb-1">💪 Keep Going!</h4>
          <p className="text-sm text-blue-50">
            You're {analytics.goalProgress}% of the way to your weekly goal.
            Just {weeklyGoal - analytics.weeklyVelocity} more to go!
          </p>
        </div>
      )}

      {analytics.totalTracked === 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-text-primary mb-1">Get Started</h4>
          <p className="text-sm text-text-secondary mb-3">
            Start tracking your networking efforts by adding connections to your pipeline.
          </p>
          <button
            onClick={() => navigateTo('discovery')}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            Find Connections
          </button>
        </div>
      )}
    </div>
  );
});

AnalyticsDashboard.displayName = 'AnalyticsDashboard';

export default AnalyticsDashboard;
