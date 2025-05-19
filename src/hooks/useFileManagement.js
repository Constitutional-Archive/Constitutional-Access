import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const API_URL = process.env.REACT_APP_SEARCH_BACKEND_URL;
console.log('API_URL:', API_URL);

export const useFileManagement = () => {
  const { user } = useAuth0();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch user's files on mount
  const fetchFiles = async () => {
    try {
      const userEmail = user.email;

      const response = await fetch(`${API_URL}/api/files`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setFiles(data);
    } catch (err) {
      console.error('Failed to fetch user files:', err);
    }
  };

   const handleFileUpload = async (fileObjects) => {
    for (const item of fileObjects) {
      const { file, metadata } = item;

      const formData = new FormData();
      formData.append('files', file);

      const uploadUrl = `${API_URL}/api/upload?category=${metadata.category}`;

      try {
        // 1. Upload file to Azure Blob Storage via backend
        const uploadRes = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        const uploadData = await uploadRes.json();
        const uploadedFileUrl = uploadData.fileUrls[0];

        // 2. Upload metadata
        await handleMetadataUpload(metadata, uploadedFileUrl, file);

      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  const handleMetadataUpload = async (metadata, fileUrl, file) => {
    const metadataPayload = {
      fileName: file.name,
      description: metadata.description || '',
      category: metadata.category || '',
      tags: metadata.tags || [],
      fileUrl: fileUrl,
      uploadedBy: user.email || '', // Auth0 user ID
    };

    try {
      const res = await fetch(`${API_URL}/api/upload/metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadataPayload),
        credentials: 'include',
      });

      const newMetadata = await res.json();

      // Add new file to state
      setFiles(prev => [newMetadata.metadata, ...prev]);

    } catch (error) {
      console.error('Metadata upload error:', error);
    }
  };

  const handleFileEdit = (id) => {
    const fileToEdit = files.find(file => file._id === id);
    if (fileToEdit) setSelectedFile(fileToEdit);
  };

  const handleMetadataUpdate = (id, metadata) => {
    setFiles(files.map(file => 
      file.id === id ? { ...file, ...metadata } : file
    ));
    setSelectedFile(null);
  };

  const handleFileMetadataUpdate = async (id, newMetadata) => {
    try {
      const res = await fetch(`${API_URL}/api/files/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMetadata),
        credentials: 'include',
      });

      const updated = await res.json();
    
      setFiles(files.map(file => (file._id === id ? updated.metadata : file)));
      setSelectedFile(null);
    } catch (err) {
      console.error('Metadata update failed:', err);
    }
  };

  const handleFileDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    console.log('Deleting file with ID:', id);

    try {
      const res = await fetch(`${API_URL}/api/files/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id,
          email: user.email, // assuming you're getting `user` from auth context or props
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete file');
      }

      setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id));
      alert('File deleted successfully');
    } catch (err) {
      console.error('Error deleting file:', err);
      alert('Error deleting file: ' + err.message);
    }
  };


  return {
    fetchFiles,
    files,
    selectedFile,
    handleFileUpload,
    handleFileEdit,
    handleMetadataUpdate,
    handleFileMetadataUpdate,
    handleFileDelete,
    setSelectedFile,
  };
};
