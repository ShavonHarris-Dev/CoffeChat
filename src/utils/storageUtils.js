/**
 * LocalStorage utilities for CoffeeChat CRM
 * Provides centralized storage operations with error handling
 */

const STORAGE_PREFIX = 'coffeeChat_';
const STORAGE_VERSION = '1.0';

/**
 * Save data to localStorage with error handling
 * @param {string} key - Storage key (will be prefixed)
 * @param {any} data - Data to store (will be JSON stringified)
 * @returns {boolean} - Success status
 */
export const saveToLocalStorage = (key, data) => {
  try {
    const prefixedKey = `${STORAGE_PREFIX}${key}`;
    const serialized = JSON.stringify(data);
    localStorage.setItem(prefixedKey, serialized);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (key: ${key}):`, error);

    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded. Consider clearing old data.');
    }

    return false;
  }
};

/**
 * Load data from localStorage with fallback
 * @param {string} key - Storage key (will be prefixed)
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - Loaded data or default value
 */
export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const prefixedKey = `${STORAGE_PREFIX}${key}`;
    const item = localStorage.getItem(prefixedKey);

    if (item === null) {
      return defaultValue;
    }

    return JSON.parse(item);
  } catch (error) {
    console.error(`Error loading from localStorage (key: ${key}):`, error);
    return defaultValue;
  }
};

/**
 * Remove a specific item from localStorage
 * @param {string} key - Storage key (will be prefixed)
 * @returns {boolean} - Success status
 */
export const removeFromLocalStorage = (key) => {
  try {
    const prefixedKey = `${STORAGE_PREFIX}${key}`;
    localStorage.removeItem(prefixedKey);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error);
    return false;
  }
};

/**
 * Clear all CoffeeChat data from localStorage
 * @returns {boolean} - Success status
 */
export const clearLocalStorage = () => {
  try {
    // Get all keys that start with our prefix
    const keys = Object.keys(localStorage);
    const coffeeChatKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX));

    // Remove all CoffeeChat keys
    coffeeChatKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log(`Cleared ${coffeeChatKeys.length} items from localStorage`);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Export all CoffeeChat data as JSON
 * Useful for backup and migration
 * @returns {object} - All stored data
 */
export const exportData = () => {
  try {
    const data = {
      version: STORAGE_VERSION,
      exportedAt: new Date().toISOString(),
      connections: loadFromLocalStorage('connections', []),
      connectionStatuses: loadFromLocalStorage('connectionStatuses', {}),
      weeklyGoal: loadFromLocalStorage('weeklyGoal', 5),
      hasUploadedData: loadFromLocalStorage('hasUploadedData', false)
    };

    return data;
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

/**
 * Import data from exported JSON
 * @param {object} data - Exported data object
 * @returns {boolean} - Success status
 */
export const importData = (data) => {
  try {
    if (!data || !data.version) {
      throw new Error('Invalid data format');
    }

    // Import each piece of data
    if (data.connections) saveToLocalStorage('connections', data.connections);
    if (data.connectionStatuses) saveToLocalStorage('connectionStatuses', data.connectionStatuses);
    if (data.weeklyGoal) saveToLocalStorage('weeklyGoal', data.weeklyGoal);
    if (data.hasUploadedData !== undefined) saveToLocalStorage('hasUploadedData', data.hasUploadedData);

    console.log('Data imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

/**
 * Get localStorage usage statistics
 * @returns {object} - Usage stats
 */
export const getStorageStats = () => {
  try {
    let totalSize = 0;
    const keys = Object.keys(localStorage);
    const coffeeChatKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX));

    coffeeChatKeys.forEach(key => {
      const value = localStorage.getItem(key);
      totalSize += key.length + (value ? value.length : 0);
    });

    return {
      keysCount: coffeeChatKeys.length,
      totalSizeBytes: totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      // Approximate quota (5MB for most browsers)
      estimatedQuotaMB: 5,
      usagePercent: ((totalSize / (5 * 1024 * 1024)) * 100).toFixed(2)
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return null;
  }
};
