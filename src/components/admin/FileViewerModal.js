import React from 'react';
import { X, FileText, Download } from 'lucide-react';

const FileViewerModal = ({ file, onClose }) => {
  // Determine how to display the file based on its type
  const renderFileContent = () => {
    if (file.type.includes('image/')) {
      return (
        <div className="flex justify-center">
          <img 
            src={file.url} 
            alt={file.metadata.name} 
            className="max-h-[70vh] max-w-full object-contain"
          />
        </div>
      );
    } else if (file.type.includes('pdf')) {
      return (
        <div className="h-[70vh] w-full">
          <iframe 
            src={file.url} 
            title={file.metadata.name}
            className="w-full h-full border border-gray-200 rounded-lg"
          />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
          <FileText className="h-16 w-16 mb-4 text-indigo-500" />
          <p className="text-lg">Preview not available for this file type</p>
          <a 
            href={file.url} 
            download
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download to view
          </a>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        <header className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">{file.metadata.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </header>
        
        <div className="p-6 overflow-auto flex-grow">
          {renderFileContent()}
        </div>
        
        <footer className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <a
            href={file.url}
            download
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </a>
        </footer>
      </div>
    </div>
  );
};

export default FileViewerModal;