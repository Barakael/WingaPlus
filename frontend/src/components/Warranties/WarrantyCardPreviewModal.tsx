import React from 'react';
import { X, Download } from 'lucide-react';

interface WarrantyCardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  warrantyTitle: string;
  imageUrl: string | null;
  loading: boolean;
}

const WarrantyCardPreviewModal: React.FC<WarrantyCardPreviewModalProps> = ({
  isOpen,
  onClose,
  warrantyTitle,
  imageUrl,
  loading,
}) => {
  if (!isOpen) return null;

  const fileNameBase = warrantyTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'warranty-card';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Warranty Card Preview</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{warrantyTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {imageUrl && !loading && (
              <a
                href={imageUrl}
                download={`${fileNameBase}-preview.png`}
                className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-auto max-h-[calc(95vh-90px)] bg-gray-50 dark:bg-gray-900">
          {loading ? (
            <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400">
              Loading preview...
            </div>
          ) : imageUrl ? (
            <div className="flex justify-center">
              <img
                src={imageUrl}
                alt="Warranty card preview"
                className="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400">
              Preview unavailable. Try regenerating.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarrantyCardPreviewModal;
