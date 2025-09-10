import React, { memo } from 'react';
import { Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ConfirmationView = () => {
  const { navigateTo, selectedMatch } = useApp();
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Message Sent! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Your reconnection message has been sent to {selectedMatch?.name || 'your connection'}. We'll track the response and notify you of any activity.
          </p>
          
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-blue-900 mb-3">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-2 text-left">
              <li>• We'll monitor for a response and notify you within 24 hours</li>
              <li>• If they respond positively, we'll help you schedule a meeting</li>
              <li>• Automatic follow-up reminder set for 1 week if no response</li>
              <li>• Your reconnection activity is tracked in your relationship dashboard</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => navigateTo('dashboard')}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ConfirmationView);
