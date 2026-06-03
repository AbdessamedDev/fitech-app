// src/services/nfcScanner.js

class NFCScannerService {
  constructor() {
    this.isListening = false;
    this.scanTimeout = null;
    this.currentInput = '';
    this.callbacks = {
      onScan: null,
      onError: null,
      onStatusChange: null
    };
    this.eventHandler = null;
  }

  /**
   * Initialize the NFC scanner service
   * @param {Object} options - Configuration options
   * @param {number} options.timeout - Timeout in ms to wait for complete scan (default: 100)
   * @param {boolean} options.debug - Enable debug logging (default: false)
   */
  init(options = {}) {
    this.timeout = options.timeout || 100;
    this.debug = options.debug || false;
    
    // Get the API URL from environment or use default
    this.apiUrl = import.meta.env.VITE_IDENTITY_API_URL || "http://localhost:5098";
    // Remove trailing slash if present
    this.apiUrl = this.apiUrl.replace(/\/$/, "");
    
    // Bind the event handler
    this.eventHandler = this.handleKeyPress.bind(this);
    
    this.log('NFC Scanner Service initialized');
    this.log('API URL:', this.apiUrl);
  }

  /**
   * Start listening for NFC card scans
   * @param {Object} callbacks - Callback functions
   */
  start(callbacks = {}) {
    if (this.isListening) {
      this.log('Already listening for NFC scans');
      return;
    }

    this.callbacks = { ...this.callbacks, ...callbacks };
    
    // Add event listener for keyboard input (USB NFC readers act as keyboards)
    document.addEventListener('keypress', this.eventHandler);
    
    this.isListening = true;
    this.callbacks.onStatusChange?.(true);
    this.log('Started listening for NFC scans');
  }

  /**
   * Stop listening for NFC card scans
   */
  stop() {
    if (!this.isListening) {
      return;
    }

    document.removeEventListener('keypress', this.eventHandler);
    
    if (this.scanTimeout) {
      clearTimeout(this.scanTimeout);
      this.scanTimeout = null;
    }
    
    this.currentInput = '';
    this.isListening = false;
    this.callbacks.onStatusChange?.(false);
    this.log('Stopped listening for NFC scans');
  }

  /**
   * Handle keypress events from NFC reader
   * @param {KeyboardEvent} event 
   */
  handleKeyPress(event) {
    // Reset timeout on each new character
    if (this.scanTimeout) {
      clearTimeout(this.scanTimeout);
    }

    const char = event.key;
    
    // Enter key typically signals end of scan
    if (char === 'Enter') {
      if (this.currentInput.length > 0) {
        const cardUid = this.currentInput.trim();
        this.log('Scan complete:', cardUid);
        
        // 🔥 DIRECT API CALL
        console.log('🚨 DIRECT API CALL - Card UID:', cardUid);
        this.callApiDirectly(cardUid);
        
        // Also trigger the normal callback
        this.callbacks.onScan?.(cardUid);
        
        this.currentInput = '';
        this.scanTimeout = null;
      }
      return;
    }

    // Only accept alphanumeric characters and common hex characters (A-F, a-f, 0-9)
    if (char.length === 1 && /[a-fA-F0-9]/i.test(char)) {
      this.currentInput += char;
    }
    
    // Set timeout to reset if scan is incomplete
    this.scanTimeout = setTimeout(() => {
      if (this.debug) {
        this.log('Scan timeout - resetting buffer');
      }
      this.currentInput = '';
      this.scanTimeout = null;
    }, this.timeout);
  }

  /**
   * Call API directly with the scanned card UID
   * @param {string} cardUid 
   */
  async callApiDirectly(cardUid) {
    console.log('📡 MAKING DIRECT API CALL for:', cardUid);
    console.log('📡 API URL:', this.apiUrl);
    
    try {
      const token = localStorage.getItem("token");
      console.log('Token exists:', !!token);
      
      if (!token) {
        console.error('❌ No token found. Please login first.');
        this.showNotification('error', 'Please login to scan cards');
        return;
      }
      
      // Use the correct API endpoint
      const endpoint = `${this.apiUrl}/api/activity/entry-exit/scan`;
      console.log('📡 Full URL:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cardUid })
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || data.detail || 'API call failed');
      }
      
      console.log('✅ API call successful!', data);
      this.showNotification('success', data.message || 'Card processed successfully');
      
    } catch (error) {
      console.error('❌ API call failed:', error);
      this.showNotification('error', error.message || 'Failed to process card');
    }
  }

  /**
   * Show a simple notification
   * @param {string} type - 'success' or 'error'
   * @param {string} message 
   */
  showNotification(type, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    
    const icon = type === 'success' 
      ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
      : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
    
    notification.innerHTML = `
      ${icon}
      <span class="text-sm font-medium">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 500);
    }, 3000);
  }

  /**
   * Simulate a card scan (for testing purposes)
   * @param {string} cardUid 
   */
  simulateScan(cardUid) {
    if (this.debug) {
      this.log('Simulating scan:', cardUid);
    }
    console.log('🚨 SIMULATED SCAN - Card UID:', cardUid);
    this.callApiDirectly(cardUid);
    this.callbacks.onScan?.(cardUid);
  }

  /**
   * Check if service is currently listening
   */
  isActive() {
    return this.isListening;
  }

  /**
   * Log debug messages
   */
  log(...args) {
    if (this.debug) {
      console.log('[NFCScanner]', ...args);
    }
  }
}

// Create a singleton instance
const nfcScanner = new NFCScannerService();

export default nfcScanner;