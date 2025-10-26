import React, { useState } from 'react';
import { QrCode, Plus, Download, Eye } from 'lucide-react';
import QRCode from 'qrcode';
import { categories } from '../../database';

const QRCodeGenerator: React.FC = () => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [qrData, setQrData] = useState<string>('');

  const generateQRCode = async (data: string) => {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(data, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setGeneratedQR(qrCodeDataURL);
      setQrData(data);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    // Generate unique QR code
    const qrCode = `QR${Date.now()}`;
    await generateQRCode(qrCode);

    // In a real app, this would save to database
    console.log('New category:', {
      name: newCategoryName,
      description: newCategoryDescription,
      qr_code: qrCode
    });

    setNewCategoryName('');
    setNewCategoryDescription('');
  };

  const downloadQRCode = () => {
    if (!generatedQR) return;

    const link = document.createElement('a');
    link.href = generatedQR;
    link.download = `qrcode-${qrData}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            QR Code Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create QR codes for product categories
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New Category */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Create New Category
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Generate QR codes for product categories that can be scanned at https://phoneshop-pro.vercel.app/
        </p>          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Smartphones, Accessories"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe this category..."
                rows={3}
              />
            </div>

            <button
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
              className="w-full bg-[#800000] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#600000] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              <QrCode className="h-5 w-5 mr-2" />
              Generate QR Code
            </button>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Generated QR Code
          </h2>

          {generatedQR ? (
            <div className="text-center">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <img
                  src={generatedQR}
                  alt="Generated QR Code"
                  className="mx-auto w-48 h-48"
                />
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">QR Code Data:</p>
                <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm">
                  {qrData}
                </code>
                
              </div>

              <button
                onClick={downloadQRCode}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Download QR Code
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No QR code generated yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Create a category to generate its QR code
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Existing Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Existing Categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {category.qr_code}
                </code>
                <button
                  onClick={() => generateQRCode(category.qr_code)}
                  className="text-[#800000] hover:text-[#600000] dark:text-[#A00000] dark:hover:text-[#C00000] text-sm font-medium"
                >
                  View QR
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
