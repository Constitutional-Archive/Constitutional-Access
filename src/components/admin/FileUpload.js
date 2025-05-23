import React, { useState } from 'react';
import { Upload, FolderTree, Edit, AlertCircle, X, Trash2 } from 'lucide-react';

const Toast = {
  show: (message, type = 'success') => {
    document.querySelectorAll('.custom-toast').forEach(toast => toast.remove());
    const toast = document.createElement('aside');
    toast.className = 'custom-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed; bottom: 20px; right: 20px;
      padding: 12px 24px; border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 1000; font-family: sans-serif;
      font-size: 14px; color: white;
      animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
      background-color: ${
        type === 'error' ? '#ef4444' :
        type === 'loading' ? '#64748b' :
        '#4f46e5'
      };
    `;
    document.body.appendChild(toast);
    if (!document.getElementById('toast-animations')) {
      const style = document.createElement('style');
      style.id = 'toast-animations';
      style.textContent = `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(10px); } }
      `;
      document.head.appendChild(style);
    }
    setTimeout(() => toast.remove(), 3000);
  }
};

const FileUpload = ({ onFileSelect }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editingFileIndex, setEditingFileIndex] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files).map(file => ({
        file,
        metadata: { name: file.name, category: '', description: '' },
        isValid: false
      }));
      setSelectedFiles(filesArray);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files).map(file => ({
        file,
        metadata: { name: file.name, category: '', description: '' },
        isValid: false
      }));
      setSelectedFiles(filesArray);
    }
  };

  const validateFile = (fileData) =>
    fileData.metadata.name.trim() !== '' &&
    fileData.metadata.category.trim() !== '' &&
    fileData.metadata.description.trim() !== '';

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
    const filesToUpload = selectedFiles.map(item => ({ file: item.file, metadata: item.metadata }));
    Toast.show('Uploading files...', 'loading');
    setTimeout(() => {
      onFileSelect(filesToUpload);
      setSelectedFiles([]);
      Toast.show('Upload complete!');
    }, 1000);
  };

  const handleFileDelete = (index) => {
    const updated = [...selectedFiles];
    updated.splice(index, 1);
    setSelectedFiles(updated);
    if (editingFileIndex === index) setEditingFileIndex(null);
    else if (editingFileIndex > index) setEditingFileIndex(editingFileIndex - 1);
  };

  const allFilesValid = selectedFiles.length > 0 && selectedFiles.every(file => file.isValid);

  return (
    <main className="mb-8">
      <form
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <fieldset>
          <legend className="sr-only">File Upload</legend>
          <FolderTree className="h-12 w-12 text-indigo-500 mb-4" />
          <input id="file-upload" type="file" className="hidden" multiple onChange={handleFileChange} />
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center px-6 py-3 rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <Upload className="h-5 w-5 me-2" />
            Select Files
          </label>
          <p className="text-sm text-slate-500 mt-2">Drag and drop files here, or click to browse</p>
        </fieldset>
      </form>

      {selectedFiles.length > 0 && (
        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Files to Upload</h2>

          {!allFilesValid && (
            <aside className="flex items-center p-3 bg-amber-50 rounded-lg text-amber-800 border border-amber-100">
              <AlertCircle className="h-5 w-5 me-2" />
              <p>Please complete all metadata fields before uploading</p>
            </aside>
          )}

          <ul className="space-y-4">
            {selectedFiles.map((item, index) => (
              <li
                key={index}
                className={`border rounded-xl p-4 ${!item.isValid ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'} ${
                  editingFileIndex === index ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <header className="flex justify-between items-start">
                  <section className="min-w-0">
                    <h3 className="font-medium text-slate-800 truncate">{item.file.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{(item.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    {!item.isValid && editingFileIndex !== index && (
                      <p className="text-sm text-amber-600 mt-2 flex items-center">
                        <AlertCircle className="h-4 w-4 me-1" />
                        Metadata incomplete
                      </p>
                    )}
                  </section>
                  <nav className="flex space-x-2">
                    <button
                      onClick={() => handleFileDelete(index)}
                      className="p-2 rounded-full text-rose-600 hover:bg-rose-50"
                      aria-label="Delete file"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setEditingFileIndex(index === editingFileIndex ? null : index)}
                      className={`p-2 rounded-full ${
                        !item.isValid ? 'text-amber-600 hover:bg-amber-100' : 'text-indigo-600 hover:bg-indigo-50'
                      }`}
                      aria-label="Edit metadata"
                    >
                      {editingFileIndex === index ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                    </button>
                  </nav>
                </header>

                {editingFileIndex === index && (
                  <section className="mt-4 space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label htmlFor={`name-${index}`}>
                        <p className="text-sm font-medium text-slate-700 mb-1">
                          Display Name <strong className="text-rose-500">*</strong>
                        </p>
                        <input
                          id={`name-${index}`}
                          type="text"
                          value={item.metadata.name}
                          onChange={(e) => handleMetadataChange(index, 'name', e.target.value)}
                          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5"
                          required
                        />
                      </label>

                      <label htmlFor={`category-${index}`}>
                        <p className="text-sm font-medium text-slate-700 mb-1">
                          Category <strong className="text-rose-500">*</strong>
                        </p>
                        <select
                          id={`category-${index}`}
                          value={item.metadata.category}
                          onChange={(e) => handleMetadataChange(index, 'category', e.target.value)}
                          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5"
                          required
                        >
                          <option value="">Select category</option>
                          <option value="constitution">Constitution</option>
                          <option value="bill">Bill</option>
                          <option value="acts">Acts</option>
                          <option value="amendment">Amendment</option>
                          <option value="legal">Legal Document</option>
                        </select>
                      </label>
                    </fieldset>

                    <label htmlFor={`description-${index}`}>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Description <strong className="text-rose-500">*</strong>
                      </p>
                      <textarea
                        id={`description-${index}`}
                        value={item.metadata.description}
                        onChange={(e) => handleMetadataChange(index, 'description', e.target.value)}
                        rows={3}
                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2.5"
                        required
                      />
                    </label>

                    <footer className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingFileIndex(null)}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingFileIndex(null)}
                        className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Save Changes
                      </button>
                    </footer>
                  </section>
                )}
              </li>
            ))}
          </ul>

          <section className="mt-6">
            <button
              onClick={handleUpload}
              disabled={!allFilesValid}
              className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                allFilesValid
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <Upload className="h-5 w-5 me-2" />
              Upload All Files
            </button>
          </section>
        </section>
      )}
    </main>
  );
};

export default FileUpload;
