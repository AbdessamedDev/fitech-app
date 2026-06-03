// src/components/NFCScannerControl.jsx (Optional - for manual control UI)

import React from 'react';
import { useNFCScannerContext } from '../contexts/NFCScannerContext';

export function NFCScannerControl() {
  const { 
    isListening, 
    startListening, 
    stopListening, 
    scanStatus, 
    lastScan,
    simulateScan 
  } = useNFCScannerContext();

  const handleTestScan = () => {
    // Test with a sample card UID (only in development)
    if (import.meta.env.DEV) {
      simulateScan('A1B2C3D4');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <h3 className="font-semibold text-gray-900">NFC Scanner</h3>
          <span className="text-xs text-gray-500">
            {isListening ? 'Listening for cards...' : 'Scanner inactive'}
          </span>
        </div>
        
        <div className="flex gap-2">
          {!isListening ? (
            <button
              onClick={startListening}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Scanner
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
            >
              Stop Scanner
            </button>
          )}
          
          {import.meta.env.DEV && (
            <button
              onClick={handleTestScan}
              className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
            >
              Test Scan
            </button>
          )}
        </div>
      </div>

      {/* Last scan info */}
      {lastScan && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Last Scan</p>
          <p className="text-sm font-mono font-medium">{lastScan.uid}</p>
          <p className="text-xs text-gray-500 mt-1">
            {lastScan.timestamp?.toLocaleTimeString()}
          </p>
          {lastScan.result && (
            <div className="mt-2 text-xs">
              <span className={`px-2 py-1 rounded ${
                lastScan.result.type === 'entry' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {lastScan.result.type === 'entry' ? '✓ Checked In' : '✓ Checked Out'}
              </span>
              {lastScan.result.memberName && (
                <span className="ml-2 text-gray-600">
                  {lastScan.result.memberName}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Current status */}
      {scanStatus.loading && (
        <div className="mt-3 text-sm text-blue-600 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          Processing...
        </div>
      )}
      
      {scanStatus.error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
          ❌ {scanStatus.error}
        </div>
      )}
      
      {/* Info text */}
      <div className="mt-4 text-xs text-gray-400 border-t pt-3">
        <p>📇 Place NFC card on reader to check in/out</p>
        <p className="mt-1">💡 The scanner runs automatically in the background</p>
      </div>
    </div>
  );
}