/**
 * Analytics utilities for CoffeeChat CRM
 * Calculate metrics and statistics for networking performance
 */

/**
 * Get count of connections by each status
 * @param {object} connectionStatuses - CRM status tracking data
 * @returns {object} - Count by status
 */
export const getStatusCounts = (connectionStatuses) => {
  const counts = {
    queue: 0,
    reached_out: 0,
    responded: 0,
    meeting_scheduled: 0,
    met: 0,
    follow_up: 0,
    total: 0
  };

  Object.values(connectionStatuses).forEach(statusData => {
    const status = statusData.status || 'queue';
    counts[status] = (counts[status] || 0) + 1;
    counts.total++;
  });

  return counts;
};

/**
 * Calculate response rate percentage
 * Response rate = (responded + meeting_scheduled + met) / reached_out
 * @param {object} connectionStatuses - CRM status tracking data
 * @returns {number} - Response rate percentage (0-100)
 */
export const calculateResponseRate = (connectionStatuses) => {
  const counts = getStatusCounts(connectionStatuses);

  const reachedOut = counts.reached_out + counts.responded + counts.meeting_scheduled + counts.met + counts.follow_up;

  if (reachedOut === 0) {
    return 0;
  }

  const responded = counts.responded + counts.meeting_scheduled + counts.met;
  const rate = (responded / reachedOut) * 100;

  return Math.round(rate * 10) / 10; // Round to 1 decimal place
};

/**
 * Get count of meetings scheduled (including completed)
 * @param {object} connectionStatuses - CRM status tracking data
 * @returns {number} - Count of meetings
 */
export const getMeetingsScheduledCount = (connectionStatuses) => {
  const counts = getStatusCounts(connectionStatuses);
  return counts.meeting_scheduled + counts.met;
};

/**
 * Get count of completed meetings
 * @param {object} connectionStatuses - CRM status tracking data
 * @returns {number} - Count of completed meetings
 */
export const getMetCount = (connectionStatuses) => {
  const counts = getStatusCounts(connectionStatuses);
  return counts.met;
};

/**
 * Calculate weekly velocity (connections reached out this week)
 * @param {object} connectionStatuses - CRM status tracking data
 * @returns {number} - Count of connections reached out this week
 */
export const getWeeklyVelocity = (connectionStatuses) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  let count = 0;

  Object.values(connectionStatuses).forEach(statusData => {
    if (statusData.reachedOutDate) {
      const reachedOutDate = new Date(statusData.reachedOutDate);
      if (reachedOutDate >= startOfWeek) {
        count++;
      }
    }
  });

  return count;
};

/**
 * Calculate goal progress percentage
 * @param {number} weeklyVelocity - Connections reached out this week
 * @param {number} weeklyGoal - Target goal for the week
 * @returns {number} - Progress percentage (0-100+)
 */
export const getGoalProgress = (weeklyVelocity, weeklyGoal) => {
  if (weeklyGoal === 0) {
    return 0;
  }

  const progress = (weeklyVelocity / weeklyGoal) * 100;
  return Math.round(progress);
};

/**
 * Get comprehensive analytics data
 * @param {object} connectionStatuses - CRM status tracking data
 * @param {number} weeklyGoal - Weekly outreach goal
 * @returns {object} - All analytics data
 */
export const getAnalytics = (connectionStatuses, weeklyGoal = 5) => {
  const statusCounts = getStatusCounts(connectionStatuses);
  const weeklyVelocity = getWeeklyVelocity(connectionStatuses);

  return {
    statusCounts,
    responseRate: calculateResponseRate(connectionStatuses),
    meetingsScheduled: getMeetingsScheduledCount(connectionStatuses),
    meetingsCompleted: getMetCount(connectionStatuses),
    weeklyVelocity,
    goalProgress: getGoalProgress(weeklyVelocity, weeklyGoal),
    totalTracked: statusCounts.total
  };
};

/**
 * Get weekly activity trend (last 4 weeks)
 * @param {object} connectionStatuses - CRM status tracking data
 * @returns {array} - Array of weekly counts [{week: 'W1', count: 5}, ...]
 */
export const getWeeklyTrend = (connectionStatuses) => {
  const weeks = [];
  const now = new Date();

  // Get last 4 weeks
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (now.getDay() + (i * 7)));
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    let count = 0;

    Object.values(connectionStatuses).forEach(statusData => {
      if (statusData.reachedOutDate) {
        const date = new Date(statusData.reachedOutDate);
        if (date >= weekStart && date <= weekEnd) {
          count++;
        }
      }
    });

    weeks.push({
      week: `W${4 - i}`,
      label: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
      count
    });
  }

  return weeks;
};

/**
 * Calculate average days to response
 * @param {object} connectionStatuses - CRM status tracking data
 * @returns {number} - Average days (or null if no data)
 */
export const getAverageDaysToResponse = (connectionStatuses) => {
  const responseTimes = [];

  Object.values(connectionStatuses).forEach(statusData => {
    if (statusData.reachedOutDate && statusData.respondedDate) {
      const reachedOut = new Date(statusData.reachedOutDate);
      const responded = new Date(statusData.respondedDate);
      const days = (responded - reachedOut) / (1000 * 60 * 60 * 24);
      responseTimes.push(days);
    }
  });

  if (responseTimes.length === 0) {
    return null;
  }

  const average = responseTimes.reduce((sum, days) => sum + days, 0) / responseTimes.length;
  return Math.round(average * 10) / 10; // Round to 1 decimal
};
