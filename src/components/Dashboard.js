import React, { memo } from 'react';
import { Coffee, Users, ChevronRight, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { pendingMatches, scheduledMeetings, userStats } from '../data/sampleData';
import Navigation from './Navigation';

// StatCard component extracted for reusability
const StatCard = memo(({ title, value, subtext, icon: Icon, iconColor }) => (
  <div className="bg-surface rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-text-secondary">{title}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-sm text-text-secondary">{subtext}</p>
      </div>
      <Icon className={`text-${iconColor}`} size={24} />
    </div>
  </div>
));

// MatchItem component for displaying pending matches and meetings
const MatchItem = memo(({ match, type }) => (
  <div className="flex items-center gap-4 p-3 hover:bg-background rounded-lg transition-colors">
    <img 
      src={match.avatar} 
      alt={match.name}
      className="w-12 h-12 rounded-full"
    />
    <div className="flex-1">
      <h4 className="font-medium text-text-primary">{match.name}</h4>
      <p className="text-sm text-text-secondary">{match.action || match.meetingDate}</p>
    </div>
    <div className="text-right">
      <p className="text-sm text-text-secondary">{match.time || match.location}</p>
      <span className={`text-xs px-2 py-1 rounded-full ${
        match.status === 'matched' 
          ? 'bg-success/10 text-success' 
          : match.status === 'confirmed'
          ? 'bg-primary/10 text-primary'
          : 'bg-warning/10 text-warning'
      }`}>
        {match.status}
      </span>
    </div>
  </div>
));

const Dashboard = () => {
  const { navigateTo } = useApp();
  const { monthlyMatches, scheduledMeetings: scheduledCount, completedMeetings, matchRate } = userStats;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="This Month" 
            value={monthlyMatches} 
            subtext="successful matches" 
            icon={Coffee} 
            iconColor="primary"
          />
          
          <StatCard 
            title="Scheduled Meetings" 
            value={scheduledCount} 
            subtext="upcoming coffee chats" 
            icon={Calendar} 
            iconColor="success"
          />

          <StatCard 
            title="Match Rate" 
            value={`${matchRate}%`} 
            subtext="mutual connections" 
            icon={Users} 
            iconColor="linkedin-blue"
          />
        </div>

        {/* New Matches Available */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">New Coffee Matches Available ☕</h2>
              <p className="text-primary-100 mb-4">3 professionals who share your interests are ready to match</p>
              <button 
                onClick={() => navigateTo('discovery')}
                className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Start Matching
              </button>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Coffee size={32} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Matches & Meetings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pending Matches */}
          <div className="bg-surface rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text-primary">Pending Matches</h3>
              <ChevronRight size={20} className="text-text-secondary" />
            </div>
            
            <div className="space-y-4">
              {pendingMatches.map(match => (
                <MatchItem key={match.id} match={match} type="pending" />
              ))}
            </div>
          </div>

          {/* Scheduled Meetings */}
          <div className="bg-surface rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text-primary">Upcoming Meetings</h3>
              <ChevronRight size={20} className="text-text-secondary" />
            </div>
            
            <div className="space-y-4">
              {scheduledMeetings.map(meeting => (
                <MatchItem key={meeting.id} match={meeting} type="scheduled" />
              ))}
            </div>
          </div>
        </div>

        {/* Networking Insights */}
        <div className="bg-surface rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-text-primary mb-6">Networking Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Coffee className="text-primary" size={24} />
              </div>
              <p className="text-2xl font-bold text-text-primary">{completedMeetings}</p>
              <p className="text-sm text-text-secondary">Coffee chats completed</p>
            </div>
            
            <div className="text-center p-4 bg-success/5 rounded-lg">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="text-success" size={24} />
              </div>
              <p className="text-2xl font-bold text-text-primary">{monthlyMatches}</p>
              <p className="text-sm text-text-secondary">New matches this month</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-warning/10 rounded-lg">
            <p className="text-sm text-text-primary">
              <strong>💡 Insight:</strong> Your match rate is {matchRate}% - you're connecting with high-quality professionals!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Dashboard);
