// src/contexts/NFCScannerContext.jsx

import React, { createContext, useContext } from 'react';
import { useNFCScanner } from '../hooks/useNFCScanner';

const NFCScannerContext = createContext(null);

export function NFCScannerProvider({ children, autoStart = true, showGlobalStatus = true }) {
  const nfcScanner = useNFCScanner({ 
    autoStart,
    onSuccess: (cardUid, result) => {
      console.log(`✅ Scan successful for ${cardUid}:`, result);
    },
    onError: (cardUid, error) => {
      console.error(`❌ Scan failed for ${cardUid}:`, error);
    },
    onScan: (cardUid) => {
      console.log(`📇 Card scanned: ${cardUid}`);
    }
  });

  // Status indicator component
  const GlobalStatusIndicator = () => {
    if (!showGlobalStatus) return null;
    
    const { isListening, scanStatus } = nfcScanner;
    
    if (!isListening && !scanStatus.loading && !scanStatus.success && !scanStatus.error) return null;
    
    return (
      <div className="fixed bottom-4 right-4 z-50">
        {scanStatus.loading && (
          <div className="bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span className="text-sm font-medium">Processing scan...</span>
          </div>
        )}
        
        {scanStatus.success && (
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">
              {scanStatus.data?.type === 'entry' ? '✅ Checked In' : '✅ Checked Out'}
            </span>
          </div>
        )}
        
        {scanStatus.error && (
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm font-medium">{scanStatus.error}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <NFCScannerContext.Provider value={nfcScanner}>
      {children}
      <GlobalStatusIndicator />
    </NFCScannerContext.Provider>
  );
}

export function useNFCScannerContext() {
  const context = useContext(NFCScannerContext);
  if (!context) {
    throw new Error('useNFCScannerContext must be used within NFCScannerProvider');
  }
  return context;
}