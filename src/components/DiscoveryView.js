import React, { memo, useState, useMemo } from 'react';
import { Clock, Users, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { suggestedMatches } from '../data/sampleData';
import Navigation from './Navigation';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';

// MatchCard component for swiping/matching interface
const MatchCard = memo(({ match, onLike, onPass }) => (
  <div className="bg-surface rounded-xl shadow-lg p-6 max-w-sm mx-auto border border-gray-100">
    <div className="text-center mb-4">
      <img 
        src={match.avatar} 
        alt={match.name}
        className="w-24 h-24 rounded-full mx-auto mb-4 border-3 border-primary/20"
      />
      <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
        {match.relationshipScore}% match
      </span>
    </div>
    
    <div className="text-center mb-4">
      <h3 className="text-xl font-bold text-text-primary">{match.name}</h3>
      <p className="text-text-secondary">{match.title}</p>
    </div>
    
    <div className="grid grid-cols-1 gap-2 mb-4 text-sm">
      <div className="flex items-center justify-center gap-2 text-text-secondary">
        <MapPin size={14} />
        <span>{match.location}</span>
      </div>
      <div className="flex items-center justify-center gap-2 text-text-secondary">
        <Clock size={14} />
        <span>{match.availability}</span>
      </div>
      <div className="flex items-center justify-center gap-2 text-text-secondary">
        <Users size={14} />
        <span>{match.mutualConnections} mutual connections</span>
      </div>
    </div>

    <div className="bg-primary/5 p-4 rounded-lg mb-4">
      <p className="text-sm text-text-primary text-center mb-2">"{match.bio}"</p>
      <div className="flex flex-wrap gap-1 justify-center">
        {match.commonInterests?.map((interest, index) => (
          <span key={index} className="bg-white px-2 py-1 rounded-full text-xs text-text-secondary border">
            {interest}
          </span>
        ))}
      </div>
    </div>

    <div className="flex gap-4 justify-center">
      <button 
        onClick={() => onPass(match)}
        className="w-14 h-14 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center touch-target"
        aria-label="Pass on this match"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <button 
        onClick={() => onLike(match)}
        className="w-14 h-14 bg-success text-white rounded-full hover:bg-green-600 transition-colors flex items-center justify-center touch-target"
        aria-label="Like this match"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>
  </div>
));

const DiscoveryView = () => {
  const { navigateTo, isLoading, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    dormantPeriod: '',
    location: '',
    minRelationshipScore: 0
  });
  
  const handleLikeMatch = (match) => {
    addToast(`You liked ${match.name}!`, 'success');
    // Simulate matching logic - in real app, this would be an API call
    const isMatch = Math.random() > 0.6; // 40% chance of instant match
    
    if (isMatch) {
      setTimeout(() => {
        navigateTo('confirmation', match);
      }, 1000);
    } else {
      addToast(`We'll let you know if ${match.name} likes you back!`, 'info');
    }
    
    console.log('Liked match:', match.id);
  };

  const handlePassMatch = (match) => {
    addToast(`Passed on ${match.name}`, 'info');
    console.log('Passed on match:', match.id);
  };

  // Filter and search logic
  const filteredMatches = useMemo(() => {
    return suggestedMatches.filter(match => {
      const matchesSearch = match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          match.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          match.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          match.commonInterests?.some(interest => 
                            interest.toLowerCase().includes(searchTerm.toLowerCase())
                          );
      
      const matchesDormantPeriod = !filters.dormantPeriod || match.dormantPeriod === filters.dormantPeriod;
      const matchesLocation = !filters.location || match.location.includes(filters.location);
      const matchesScore = match.relationshipScore >= filters.minRelationshipScore;
      
      return matchesSearch && matchesDormantPeriod && matchesLocation && matchesScore;
    });
  }, [searchTerm, filters]);

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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-surface rounded-lg p-6 mb-6 shadow-sm">
          <div className="mb-4">
            <label htmlFor="search" className="block text-sm font-medium text-text-primary mb-2">
              Search connections
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, title, or location..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="dormantPeriod" className="block text-sm font-medium text-text-primary mb-2">
                Dormant Period
              </label>
              <select
                id="dormantPeriod"
                value={filters.dormantPeriod}
                onChange={(e) => setFilters(prev => ({ ...prev, dormantPeriod: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All periods</option>
                <option value="6 months">6 months</option>
                <option value="1 year">1 year</option>
                <option value="2 years">2 years</option>
                <option value="3+ years">3+ years</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-text-primary mb-2">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Filter by location..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="minScore" className="block text-sm font-medium text-text-primary mb-2">
                Min Relationship Score: {filters.minRelationshipScore}%
              </label>
              <input
                id="minScore"
                type="range"
                min="0"
                max="100"
                value={filters.minRelationshipScore}
                onChange={(e) => setFilters(prev => ({ ...prev, minRelationshipScore: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-lg font-bold text-text-primary mb-2">
            Potential Coffee Matches ({filteredMatches.length})
          </h2>
          <p className="text-text-secondary">Swipe through professionals who share your interests and background</p>
        </div>

        {filteredMatches.length === 0 ? (
          <EmptyState
            title="No matches found"
            description="Try adjusting your search criteria or filters to find more potential coffee partners."
            icon="search"
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchTerm('');
              setFilters({ dormantPeriod: '', location: '', minRelationshipScore: 0 });
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                onLike={handleLikeMatch}
                onPass={handlePassMatch}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(DiscoveryView);
