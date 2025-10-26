import React, { useState } from 'react';
import { QrCode, Scan, Camera } from 'lucide-react';

interface QRScannerProps {
  onScan: (qrCode: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate QR code scanning
    setTimeout(() => {
      const mockQRCode = 'QR001'; // Mock QR code for smartphones category
      onScan(mockQRCode);
      setIsScanning(false);
    }, 2000);
  };

  const handleManualEntry = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-[#800000] to-[#600000] rounded-full flex items-center justify-center mx-auto mb-4">
          <QrCode className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          QR Code Scanner
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Scan a product QR code to view available products and start a sale
        </p>
      </div>

      <div className="space-y-6">
        {/* Camera Scanner */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
          {isScanning ? (
            <div className="text-center">
              <div className="w-32 h-32 border-4 border-[#800000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Scanning QR code...</p>
            </div>
          ) : (
            <div className="text-center">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <button
                onClick={handleStartScan}
                className="bg-[#800000] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#600000] transition-all duration-200 flex items-center mx-auto"
              >
                <Scan className="h-5 w-5 mr-2" />
                Start Scanning
              </button>
            </div>
          )}
        </div>

        {/* Manual Entry */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Or Enter QR Code Manually
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            For testing with your Vercel deployment at https://phoneshop-pro.vercel.app/
          </p>
          <div className="flex space-x-3">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Enter QR code (e.g., QR001)"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleManualEntry}
              disabled={!manualCode.trim()}
              className="bg-[#800000] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#600000] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Quick Access Codes */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Quick Access Codes:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onScan('QR001')}
              className="text-left p-2 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">QR001</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Smartphones</p>
            </button>
            <button
              onClick={() => onScan('QR002')}
              className="text-left p-2 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">QR002</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Accessories</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
import React, { useState } from 'react';
import { QrCode, Scan, Camera } from 'lucide-react';

interface QRScannerProps {
  onScan: (qrCode: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate QR code scanning
    setTimeout(() => {
      const mockQRCode = 'QR001'; // Mock QR code for smartphones category
      onScan(mockQRCode);
      setIsScanning(false);
    }, 2000);
  };

  const handleManualEntry = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-[#800000] to-[#600000] rounded-full flex items-center justify-center mx-auto mb-4">
          <QrCode className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          QR Code Scanner
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Scan a product QR code to view available products and start a sale
        </p>
      </div>

      <div className="space-y-6">
        {/* Camera Scanner */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
          {isScanning ? (
            <div className="text-center">
              <div className="w-32 h-32 border-4 border-[#800000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Scanning QR code...</p>
            </div>
          ) : (
            <div className="text-center">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <button
                onClick={handleStartScan}
                className="bg-gradient-to-r from-[#800000] to-[#600000] text-white px-6 py-3 rounded-lg font-medium hover:from-[#600000] hover:to-[#400000] transition-all duration-200 flex items-center mx-auto"
              >
                <Scan className="h-5 w-5 mr-2" />
                Start Scanning
              </button>
            </div>
          )}
        </div>

        {/* Manual Entry */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Or Enter QR Code Manually
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            For testing with your Vercel deployment at https://phoneshop-pro.vercel.app/
          </p>
          <div className="flex space-x-3">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Enter QR code (e.g., QR001)"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleManualEntry}
              disabled={!manualCode.trim()}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Quick Access Codes */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Quick Access Codes:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onScan('QR001')}
              className="text-left p-2 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">QR001</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Smartphones</p>
            </button>
            <button
              onClick={() => onScan('QR002')}
              className="text-left p-2 bg-white dark:bg-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">QR002</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Accessories</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
