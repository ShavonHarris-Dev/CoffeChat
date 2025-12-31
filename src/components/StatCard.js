import React, { memo } from 'react';

/**
 * Reusable stat card component for displaying metrics
 * Used in Dashboard and AnalyticsDashboard
 */
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

StatCard.displayName = 'StatCard';

export default StatCard;
