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
      formData.append('category', metadata.category);  
      formData.append('description', metadata.description || '');
      formData.append('tags', JSON.stringify(metadata.tags || []));
      formData.append('uploadedBy', user.email);


      try {
        const uploadRes = await fetch(`${API_URL}/api/upload?category=${metadata.category}`, {
          method: 'POST',
          body: formData,
        });
  
        const uploadData = await uploadRes.json();
        const uploadedFile = uploadData.files[0];
  
        await handleMetadataUpload(metadata, uploadedFile.url, file);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };
  
  
  const handleMetadataUpload = async (metadata, fileUrl, file) => {
    const metadataPayload = {
      ...metadata,
       
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      category: metadata.category,
      fileUrl: fileUrl,
      uploadedBy: user.email,
    }; 
  
    try {
      const metadataRes = await fetch(`${API_URL}/api/upload/metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadataPayload),
      });
  
      if (!metadataRes.ok) {
        throw new Error('Metadata upload failed');
      }
  
      const metadataData = await metadataRes.json();
      console.log('Metadata uploaded successfully:', metadataData);
  
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

  const handleFileMetadataUpdate = async (updatedFile) => {
    try {
      const res = await fetch(`${API_URL}/api/files/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updatedFile._id,  // Make sure this matches what your backend expects
          fileName: updatedFile.name,
          description: updatedFile.description,
          category: updatedFile.category
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Update failed: ${errText}`);
      }

      const updatedFileData = await res.json();

      // Update the files state
      setFiles(files.map(file => 
        file._id === updatedFile._id ? updatedFileData : file
      ));
      setSelectedFile(null);
    } catch (err) {
      console.error('Metadata update failed:', err);
      // You might want to add error handling here (e.g., show a toast notification)
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
          id: id,
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
