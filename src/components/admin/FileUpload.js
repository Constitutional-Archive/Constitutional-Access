import React, { useState } from 'react';
import { Upload, FolderTree, Edit, AlertCircle, X, Trash2 } from 'lucide-react';

// Simple toast notification system
const Toast = {
  show: (message, type = 'success') => {
    // Remove any existing toasts
    const existingToasts = document.querySelectorAll('.custom-toast');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.textContent = message;
    
    // Base styling
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    toast.style.zIndex = '1000';
    toast.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';
    toast.style.color = 'white';
    toast.style.fontFamily = 'sans-serif';
    toast.style.fontSize = '14px';
    
    // Type-specific styling
    if (type === 'error') {
      toast.style.backgroundColor = '#ef4444'; // red-500
    } else if (type === 'loading') {
      toast.style.backgroundColor = '#64748b'; // slate-500
    } else {
      toast.style.backgroundColor = '#4f46e5'; // indigo-600
    }

    // Add to document
    document.body.appendChild(toast);

    // Add animation styles
    if (!document.getElementById('toast-animations')) {
      const style = document.createElement('style');
      style.id = 'toast-animations';
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(10px); }
        }
      `;
      document.head.appendChild(style);
    }

    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
};

const FileUpload = ({ onFileSelect }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editingFileIndex, setEditingFileIndex] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files).map(file => ({
        file,
        metadata: {
          name: file.name,
          category: '',
          description: '',
          tags: []
        },
        isValid: false
      }));
      setSelectedFiles(filesArray);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      const filesArray = Array.from(event.dataTransfer.files).map(file => ({
        file,
        metadata: {
          name: file.name,
          category: '',
          description: '',
          tags: []
        },
        isValid: false
      }));
      setSelectedFiles(filesArray);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const validateFile = (fileData) => {
    return (
      fileData.metadata.name.trim() !== '' &&
      fileData.metadata.category.trim() !== '' &&
      fileData.metadata.description.trim() !== '' &&
      fileData.metadata.tags.length > 0
    );
  };

  const handleMetadataChange = (index, field, value) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles[index].metadata[field] = value;
    updatedFiles[index].isValid = validateFile(updatedFiles[index]);
    setSelectedFiles(updatedFiles);
  };

  const handleUpload = () => {
    if (selectedFiles.some(file => !file.isValid)) {
      Toast.show('Please complete all metadata fields before uploading', 'error');
      return;
    }

    const filesToUpload = selectedFiles.map((item) => ({
      file: item.file,
      metadata: item.metadata, 
    }));

    // Show loading toast
    Toast.show('Uploading files...', 'loading');

    // Simulate upload process
    setTimeout(() => {
      onFileSelect(filesToUpload);
      setSelectedFiles([]);
      Toast.show('Upload complete!');
    }, 1000);
  };

  const handleFileDelete = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    if (editingFileIndex === index) {
      setEditingFileIndex(null);
    } else if (editingFileIndex > index) {
      setEditingFileIndex(editingFileIndex - 1);
    }
  };

  const allFilesValid = selectedFiles.length > 0 && selectedFiles.every(file => file.isValid);

  return (
    <section className="mb-8">
      <article
        className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <figure className="flex flex-col items-center">
          <FolderTree className="h-12 w-12 text-indigo-500 mb-4" />
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 mb-4 transition-colors duration-200"
          >
            <Upload className="h-5 w-5 mr-2" />
            Select Files
          </label>
          <figcaption className="text-sm text-slate-500 mb-2">
            Drag and drop files here, or click to browse
          </figcaption>
        </figure>
      </article>

      {selectedFiles.length > 0 && (
        <article className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Files to Upload</h3>
          
          {!allFilesValid && (
            <aside className="flex items-center p-3 bg-amber-50 rounded-lg text-amber-800 border border-amber-100">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>Please complete all metadata fields before uploading</p>
            </aside>
          )}

          <ul className="space-y-4">
            {selectedFiles.map((item, index) => (
              <li 
                key={index} 
                className={`border rounded-xl p-4 transition-all duration-200 ${
                  !item.isValid ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'
                } ${editingFileIndex === index ? 'ring-2 ring-indigo-500' : ''}`}
              >
                <header className="flex justify-between items-start">
                  <section className="min-w-0">
                    <h4 className="font-medium text-slate-800 truncate">{item.file.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">
                      {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    {!item.isValid && editingFileIndex !== index && (
                      <p className="text-sm text-amber-600 mt-2 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>Metadata incomplete</span>
                      </p>
                    )}
                  </section>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleFileDelete(index)}
                      className="p-2 rounded-full text-rose-600 hover:bg-rose-50 transition-colors duration-200"
                      aria-label="Delete file"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setEditingFileIndex(index === editingFileIndex ? null : index)}
                      className={`p-2 rounded-full ${
                        !item.isValid 
                          ? 'text-amber-600 hover:bg-amber-100' 
                          : 'text-indigo-600 hover:bg-indigo-50'
                      } transition-colors duration-200`}
                      aria-label="Edit metadata"
                    >
                      {editingFileIndex === index ? (
                        <X className="h-5 w-5" />
                      ) : (
                        <Edit className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </header>

                {editingFileIndex === index && (
                  <section className="mt-4 space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor={`name-${index}`} className="block text-sm font-medium text-slate-700 mb-1">
                          Display Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id={`name-${index}`}
                          type="text"
                          value={item.metadata.name}
                          onChange={(e) => handleMetadataChange(index, 'name', e.target.value)}
                          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`category-${index}`} className="block text-sm font-medium text-slate-700 mb-1">
                          Category <span className="text-rose-500">*</span>
                        </label>
                        <select
                          id={`category-${index}`}
                          value={item.metadata.category}
                          onChange={(e) => handleMetadataChange(index, 'category', e.target.value)}
                          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5"
                          required
                        >
                          <option value="">Select category</option>
                          <option value="constitution">Constitution</option>
                          <option value="amendment">Amendment</option>
                          <option value="legal">Legal Document</option>
                        </select>
                      </div>
                    </fieldset>

                    <div>
                      <label htmlFor={`description-${index}`} className="block text-sm font-medium text-slate-700 mb-1">
                        Description <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        id={`description-${index}`}
                        value={item.metadata.description}
                        onChange={(e) => handleMetadataChange(index, 'description', e.target.value)}
                        rows={3}
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor={`tags-${index}`} className="block text-sm font-medium text-slate-700 mb-1">
                        Tags <span className="text-rose-500">*</span> 
                        <em className="text-slate-400 text-xs ml-2">(comma separated)</em>
                      </label>
                      <input
                        id={`tags-${index}`}
                        type="text"
                        value={item.metadata.tags.join(', ')}
                        onChange={(e) => handleMetadataChange(index, 'tags', e.target.value.split(',').map(t => t.trim()))}
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5"
                        required
                      />
                    </div>

                    <footer className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingFileIndex(null)}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingFileIndex(null)}
                        className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                      >
                        Save Changes
                      </button>
                    </footer>
                  </section>
                )}
              </li>
            ))}
          </ul>

          <button
            onClick={handleUpload}
            disabled={!allFilesValid}
            className={`mt-6 w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
              allFilesValid 
                ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                : 'bg-slate-300 cursor-not-allowed'
            } transition-colors duration-200`}
          >
            {allFilesValid ? (
              <span className="flex items-center justify-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload All Files
              </span>
            ) : (
              'Complete all metadata to enable upload'
            )}
          </button>
        </article>
      )}
    </section>
  );
};

export default FileUpload;