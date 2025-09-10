import React, { memo, useState } from 'react';
import { useApp } from '../context/AppContext';
import Navigation from './Navigation';

const SchedulingView = () => {
  const { selectedMatch, navigateTo, addToast } = useApp();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [message, setMessage] = useState('');

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime || !selectedLocation) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    // Simulate scheduling
    addToast(`Coffee chat scheduled with ${selectedMatch?.name}!`, 'success');
    navigateTo('dashboard');
  };

  const suggestedLocations = [
    "Blue Bottle Coffee, SOMA",
    "Starbucks, Mission District", 
    "Philz Coffee, Castro",
    "Coupa Cafe, Palo Alto",
    "The Coffee Bean, Downtown"
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-surface rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Schedule Your Coffee Chat
          </h1>

          {selectedMatch && (
            <div className="flex items-center gap-4 mb-6 p-4 bg-primary/5 rounded-lg">
              <img 
                src={selectedMatch.avatar} 
                alt={selectedMatch.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium text-text-primary">{selectedMatch.name}</h3>
                <p className="text-sm text-text-secondary">{selectedMatch.title}</p>
                <p className="text-xs text-text-secondary">Preferred: {selectedMatch.availability} • {selectedMatch.preferredMeetingStyle}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-text-primary mb-2">
                Select Date *
              </label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Select Time *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 rounded-lg border transition-colors ${
                      selectedTime === time
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-text-primary border-gray-300 hover:border-primary'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Selection */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-text-primary mb-2">
                Select Location *
              </label>
              <select
                id="location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Choose a location...</option>
                {suggestedLocations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
                <option value="other">Other (specify in message)</option>
              </select>
            </div>

            {/* Optional Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                Optional Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add any additional details or preferences..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Meeting Details Summary */}
            {selectedDate && selectedTime && selectedLocation && (
              <div className="bg-success/10 p-4 rounded-lg">
                <h4 className="font-medium text-text-primary mb-2">Meeting Summary</h4>
                <div className="text-sm text-text-secondary space-y-1">
                  <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Location:</strong> {selectedLocation}</p>
                  {message && <p><strong>Message:</strong> {message}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigateTo('confirmation')}
              className="flex-1 bg-background text-text-secondary py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSchedule}
              className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-linkedin-blue-dark transition-colors"
            >
              Schedule Coffee Chat
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-text-secondary">
            Both parties will receive email confirmation with contact details
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SchedulingView);