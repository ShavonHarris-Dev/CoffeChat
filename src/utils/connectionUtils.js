/**
 * Calculate how long ago a connection was made
 * @param {string} connectedOnDate - Date string from LinkedIn CSV (format: "DD MMM YYYY" or ISO)
 * @returns {object} { months: number, displayText: string }
 */
export const calculateDormancy = (connectedOnDate) => {
  if (!connectedOnDate) {
    return { months: 0, displayText: 'Unknown' };
  }

  try {
    const connectionDate = new Date(connectedOnDate);
    const now = new Date();

    if (isNaN(connectionDate.getTime())) {
      return { months: 0, displayText: 'Unknown' };
    }

    const diffTime = Math.abs(now - connectionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);

    let displayText;
    if (diffYears >= 1) {
      displayText = diffYears === 1 ? '1 year' : `${diffYears} years`;
    } else if (diffMonths >= 1) {
      displayText = diffMonths === 1 ? '1 month' : `${diffMonths} months`;
    } else if (diffDays >= 7) {
      const weeks = Math.floor(diffDays / 7);
      displayText = weeks === 1 ? '1 week' : `${weeks} weeks`;
    } else {
      displayText = diffDays === 1 ? '1 day' : `${diffDays} days`;
    }

    return { months: diffMonths, displayText };
  } catch (error) {
    console.error('Error calculating dormancy:', error);
    return { months: 0, displayText: 'Unknown' };
  }
};

/**
 * Calculate seniority score based on job title
 * @param {string} position - Job title/position
 * @returns {number} Score between 0-20
 */
const calculateSeniorityScore = (position) => {
  if (!position) return 0;

  const positionLower = position.toLowerCase();

  // C-Suite & Founders (highest value)
  if (positionLower.match(/\b(ceo|cto|cfo|coo|cio|chief|president|founder|co-founder|owner)\b/)) {
    return 20;
  }

  // VP & Director level
  if (positionLower.match(/\b(vp|vice president|director|head of)\b/)) {
    return 15;
  }

  // Manager & Lead level
  if (positionLower.match(/\b(manager|lead|principal|staff|senior)\b/)) {
    return 10;
  }

  // Regular professional roles
  if (positionLower.match(/\b(engineer|developer|designer|analyst|consultant|specialist)\b/)) {
    return 5;
  }

  // Intern or entry level
  if (positionLower.match(/\b(intern|junior|associate|assistant)\b/)) {
    return 2;
  }

  return 0;
};

/**
 * Calculate relationship score based on available data
 * @param {object} connection - Connection data
 * @returns {number} Score between 0-100
 */
export const calculateRelationshipScore = (connection) => {
  let score = 0;

  // Factor 1: Connection age - MAJOR factor (60% weight)
  const { months } = calculateDormancy(connection.connectedOn);
  if (months >= 48) {
    score += 60; // 4+ years
  } else if (months >= 24) {
    score += 50; // 2-4 years
  } else if (months >= 12) {
    score += 40; // 1-2 years
  } else if (months >= 6) {
    score += 30; // 6-12 months
  } else if (months >= 3) {
    score += 20; // 3-6 months
  } else {
    score += 10; // Less than 3 months
  }

  // Factor 2: Seniority/Role (20% weight)
  const seniorityScore = calculateSeniorityScore(connection.position);
  score += seniorityScore;

  // Factor 3: Email availability (10% weight)
  if (connection.email && connection.email.length > 0) {
    score += 10;
  }

  // Factor 4: Has complete profile data (10% weight)
  if (connection.company && connection.position) {
    score += 10;
  }

  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score));
};

/**
 * Transform raw LinkedIn CSV connection into app format
 * @param {object} rawConnection - Raw connection from CSV
 * @param {number} id - Unique identifier
 * @returns {object} Formatted connection object
 */
export const transformConnection = (rawConnection, id) => {
  const { months, displayText } = calculateDormancy(rawConnection.connectedOn);
  const relationshipScore = calculateRelationshipScore(rawConnection);

  // Build name
  const firstName = rawConnection.firstName || '';
  const lastName = rawConnection.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Unknown';

  // Get position and company
  const position = rawConnection.position && rawConnection.position.length > 0
    ? rawConnection.position
    : null;
  const company = rawConnection.company && rawConnection.company.length > 0
    ? rawConnection.company
    : null;

  // Build title string
  let title = '';
  if (position && company) {
    title = `${position} at ${company}`;
  } else if (position) {
    title = position;
  } else if (company) {
    title = company;
  } else {
    title = 'LinkedIn Connection';
  }

  return {
    id,
    name: fullName,
    title,
    company: company || '',
    position: position || '',
    dormantPeriod: displayText,
    dormantMonths: months,
    relationshipScore,
    connectedOn: rawConnection.connectedOn,
    email: rawConnection.email || null,
    location: rawConnection.location || '',
    url: rawConnection.url || '',
    // Data we don't have from CSV
    mutualConnections: 0,
    lastInteraction: `Connected ${displayText} ago`,
    sharedBackground: '',
    commonInterests: [],
    availability: '',
    preferredMeetingStyle: 'Coffee shop',
    bio: '',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}+${encodeURIComponent(lastName)}&background=random`
  };
};

/**
 * Sort connections by relationship score
 * @param {array} connections - Array of connection objects
 * @returns {array} Sorted connections (highest score first)
 */
export const sortByScore = (connections) => {
  return [...connections].sort((a, b) => b.relationshipScore - a.relationshipScore);
};

/**
 * Filter connections by dormancy period
 * @param {array} connections - Array of connection objects
 * @param {number} minMonths - Minimum dormancy in months
 * @returns {array} Filtered connections
 */
export const filterByDormancy = (connections, minMonths = 3) => {
  return connections.filter(conn => conn.dormantMonths >= minMonths);
};
