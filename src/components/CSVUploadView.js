import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { transformConnection } from '../utils/connectionUtils';

const CSVUploadView = ({ onUploadComplete }) => {
  const { addToast, handleError } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [fileName, setFileName] = useState('');
  const [connectionCount, setConnectionCount] = useState(0);

  const parseCSV = useCallback((text) => {
    try {
      // Better CSV parsing that handles quoted values with commas
      const parseCSVLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];

          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      // Split by newlines but keep track of quoted sections
      const allLines = text.split('\n');

      // Find the header line (the one with "First Name")
      let headerLineIndex = -1;
      for (let i = 0; i < allLines.length; i++) {
        const line = allLines[i].trim();
        if (line.includes('First Name') && line.includes('Last Name')) {
          headerLineIndex = i;
          break;
        }
      }

      if (headerLineIndex === -1) {
        throw new Error('Could not find header row with "First Name" and "Last Name"');
      }

      // Get lines starting from header
      const lines = allLines.slice(headerLineIndex).filter(line => line.trim());

      if (lines.length === 0) {
        throw new Error('CSV file is empty');
      }

      const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim());

      // Find column indices with better matching
      const firstNameIdx = headers.findIndex(h => h.toLowerCase().includes('first name') || h.toLowerCase() === 'first');
      const lastNameIdx = headers.findIndex(h => h.toLowerCase().includes('last name') || h.toLowerCase() === 'last');
      const companyIdx = headers.findIndex(h => h.toLowerCase().includes('company'));
      const positionIdx = headers.findIndex(h => h.toLowerCase().includes('position'));
      const connectedOnIdx = headers.findIndex(h => h.toLowerCase().includes('connected'));
      const emailIdx = headers.findIndex(h => h.toLowerCase().includes('email'));
      const locationIdx = headers.findIndex(h => h.toLowerCase().includes('location') || h.toLowerCase().includes('city'));
      const urlIdx = headers.findIndex(h => h.toLowerCase() === 'url' || h.toLowerCase().includes('profile'));

      if (firstNameIdx === -1 || lastNameIdx === -1) {
        throw new Error('CSV must contain "First Name" and "Last Name" columns');
      }

      const connections = [];

      for (let i = 1; i < lines.length; i++) {
        try {
          const values = parseCSVLine(lines[i]).map(v => v.replace(/^"|"$/g, '').trim());

          if (values.length > 1 && values[firstNameIdx]) {
            const connection = {
              firstName: values[firstNameIdx] || '',
              lastName: values[lastNameIdx] || '',
              company: values[companyIdx] || '',
              position: values[positionIdx] || '',
              connectedOn: values[connectedOnIdx] || '',
              email: values[emailIdx] || '',
              location: locationIdx !== -1 ? (values[locationIdx] || '') : '',
              url: urlIdx !== -1 ? (values[urlIdx] || '') : ''
            };

            connections.push(connection);
          }
        } catch (lineError) {
          console.warn(`Error parsing line ${i}:`, lineError);
          // Continue with other lines
        }
      }

      return connections;
    } catch (error) {
      console.error('CSV parsing error:', error);
      throw error;
    }
  }, []);

  const handleFile = useCallback(async (file) => {
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setUploadStatus('error');
      handleError(new Error('Invalid file type'), 'Please upload a CSV file');
      return;
    }

    setFileName(file.name);

    try {
      const text = await file.text();

      const rawConnections = parseCSV(text);

      if (rawConnections.length === 0) {
        throw new Error('No connections found in CSV. Please check the file format.');
      }

      // Transform connections using utility function
      const transformedConnections = rawConnections.map((conn, index) =>
        transformConnection(conn, index + 1)
      );

      setConnectionCount(transformedConnections.length);
      setUploadStatus('success');
      addToast(`Successfully imported ${transformedConnections.length} connections`, 'success');

      // Pass data to parent
      if (onUploadComplete) {
        onUploadComplete(transformedConnections);
      }
    } catch (error) {
      console.error('CSV parsing error details:', error);
      setUploadStatus('error');
      handleError(error, `Failed to parse CSV: ${error.message}`);
    }
  }, [parseCSV, handleError, addToast, onUploadComplete]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    handleFile(file);
  }, [handleFile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Import Your LinkedIn Connections</h1>
          <p className="text-gray-600">Upload your LinkedIn connections CSV to get started</p>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : uploadStatus === 'success'
              ? 'border-green-500 bg-green-50'
              : uploadStatus === 'error'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 bg-white hover:border-blue-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadStatus === 'success' ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Successful!</h3>
              <p className="text-gray-600 mb-1">{fileName}</p>
              <p className="text-sm text-gray-500">{connectionCount} connections imported</p>
            </div>
          ) : uploadStatus === 'error' ? (
            <div className="flex flex-col items-center">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Failed</h3>
              <p className="text-gray-600 mb-4">Please try again with a valid CSV file</p>
              <label className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Try Again
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Drop your CSV file here
              </h3>
              <p className="text-gray-600 mb-4">or</p>
              <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block">
                Choose File
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How to export from LinkedIn:</h3>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li>Log in to LinkedIn and click your profile picture</li>
                <li>Select Settings & Privacy → Data Privacy</li>
                <li>Click "Get a copy of your data"</li>
                <li>Select "Connections" and click "Request archive"</li>
                <li>LinkedIn will email you the CSV file (usually within 10 minutes)</li>
                <li>Upload the CSV file here</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVUploadView;
