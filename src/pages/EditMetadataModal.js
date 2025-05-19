import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditMetadataModal = ({ file, onClose, onSave }) => {
  const [metadata, setMetadata] = useState({
    fileName: '',
    category: '',
    description: ''
  });

  useEffect(() => {
    if (file) {
      setMetadata({
        fileName: file.fileName || '',
        category: file.category || '',
        description: file.description || ''
      });
    }
  }, [file]);

  if (!file) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...file,
      fileName: metadata.fileName.trim(),
      category: metadata.category.trim(),
      description: metadata.description.trim()
    });
  };

  return (
    <dialog open className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <article className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit File Metadata</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <fieldset className="grid grid-cols-1 gap-6">
            <label className="block">
              <p className="text-sm font-medium text-gray-700">File Name*</p>
              <input
                type="text"
                value={metadata.fileName}
                onChange={(e) => setMetadata({ ...metadata, fileName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </label>

            <label className="block">
              <p className="text-sm font-medium text-gray-700">Category*</p>
              <select
                value={metadata.category}
                onChange={(e) => setMetadata({ ...metadata, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                <option value="constitution">Constitution</option>
                <option value="amendment">Amendment</option>
                <option value="Bill">Bill</option>
                <option value="Acts">Acts</option>
                <option value="legal">Legal</option>
              </select>
            </label>

            <label className="block">
              <p className="text-sm font-medium text-gray-700">Description</p>
              <textarea
                value={metadata.description}
                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </label>

          </fieldset>

          <footer className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </button>
          </footer>
        </form>
      </article>
    </dialog>
  );
};

export default EditMetadataModal;
