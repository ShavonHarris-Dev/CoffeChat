import React, { memo } from 'react';
import { Clock, Users, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Using memo to prevent unnecessary re-renders
const ConnectionCard = memo(({ connection }) => {
  const { navigateTo } = useApp();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-lg mx-auto">
      <div className="flex items-start gap-4 mb-6">
        <img 
          src={connection.avatar} 
          alt={connection.name}
          className="w-16 h-16 rounded-full border-2 border-blue-100"
        />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{connection.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{connection.title}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              Dormant {connection.dormantPeriod}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} />
              {connection.mutualConnections} mutual
            </span>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {connection.relationshipScore}% match
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">How you know them</p>
          <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">{connection.sharedBackground}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">Last interaction</p>
          <p className="text-sm text-gray-600">{connection.lastInteraction}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">Suggested opener</p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 italic">"{connection.suggestedOpener}"</p>
            <button className="text-xs text-blue-600 mt-2 hover:text-blue-800">
              ✏️ Customize message
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => navigateTo('dashboard')}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Skip for now
        </button>
        <button 
          onClick={() => navigateTo('compose')}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Send message
        </button>
      </div>
    </div>
  );
});

export default ConnectionCard;
