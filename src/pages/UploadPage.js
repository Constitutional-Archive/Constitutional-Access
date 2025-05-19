import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditMetadataModal from './EditMetadataModal';

function UploadPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFile, setEditingFile] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SEARCH_BACKEND_URL}/api/files`)
      .then(res => res.json())
      .then(data => {
        setFiles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch files", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_SEARCH_BACKEND_URL}/api/files/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setFiles(prev => prev.filter(file => file._id !== id));
      } else {
        
        console.error('Failed to delete file');
        alert('Could not delete the file. Please try again.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting the file.');
    }
  };

  const handleSaveMetadata = async (updatedFile) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SEARCH_BACKEND_URL}/api/files/${updatedFile._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: updatedFile.fileName,
          description: updatedFile.description,
          category: updatedFile.category,
         
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update file metadata');
      }
      const data = await response.json();
      setFiles(prevFiles => prevFiles.map(f => (f._id === data._id ? data : f)));
      setEditingFile(null);
    } catch (error) {
      console.error(error);
      alert('Error updating metadata');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">📄 Uploaded Files</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading files...</p>
      ) : files.length === 0 ? (
        <p className="text-center text-red-500">No uploaded files found.</p>
      ) : (
        <div className="overflow-x-auto shadow border rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Filename</th>
                <th className="text-left py-3 px-4 font-medium">Category</th>
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{file.fileName}</td>
                  <td className="py-2 px-4">{file.category || 'N/A'}</td>
                  <td className="py-2 px-4">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 flex items-center space-x-4">
                    <button
                      onClick={() => setEditingFile(file)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Metadata"
                    >
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(file._id)} className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editingFile && (
        <EditMetadataModal
          file={editingFile}
          onClose={() => setEditingFile(null)}
          onSave={handleSaveMetadata}
        />
      )}
    </div>
  );
}

export default UploadPage;
