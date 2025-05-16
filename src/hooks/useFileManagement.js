import { useState } from 'react';
const API_URL = process.env.REACT_APP_BACKEND_URL;

export const useFileManagement = () => {
  // Mock data for demonstration
  const initialFiles = [
    {
      id: 1,
      name: 'Constitution_1947.pdf',
      type: 'PDF',
      size: '2.4 MB',
      date: '2024-03-15',
      category: 'constitution',
      description: 'Original Constitution document from 1947',
      tags: ['constitution', 'original', 'historical'],
      path: '/constitution/original'
    },
    {
      id: 2,
      name: 'Amendments_2020.docx',
      type: 'Document',
      size: '1.1 MB',
      date: '2024-03-14',
      category: 'amendment',
      description: 'Recent constitutional amendments from 2020',
      tags: ['amendment', 'recent'],
      path: '/constitution/amendments'
    },
    {
      id: 3,
      name: 'Historical_Notes.pdf',
      type: 'PDF',
      size: '3.7 MB',
      date: '2024-03-13',
      category: 'historical',
      description: 'Historical notes and analysis',
      tags: ['historical', 'analysis'],
      path: '/historical/notes'
    },
  ];

  const [files, setFiles] = useState(initialFiles);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = async (fileObjects) => {
    for (const item of fileObjects) {
      const { file, metadata } = item;
  
      const formData = new FormData();
      formData.append('files', file);
      formData.append('category', metadata.category);  
      formData.append('description', metadata.description || '');
      formData.append('fileType', metadata.fileType || '');
      formData.append('publicationDate', metadata.publicationDate || '');
      formData.append('uploadedBy', metadata.uploadedBy || '');
      
      const uploadUrl = `${API_URL}/upload?category=${encodeURIComponent(metadata.category)}`;


      try {
        const uploadRes = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });
  
        const uploadData = await uploadRes.json();
        const uploadedFile = uploadData.files[0];
  
        await handleMetadataUpload(metadata, uploadedFile.blobName, file);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };
  
  
  const handleMetadataUpload = async (metadata, fileUrl, file) => {
    const metadataPayload = {
      fileName: file.name,
      fileSize: file.size,
      fileType: metadata.fileType,
      category: metadata.category,
      description: metadata.description || '',
      uploadedBy: metadata.uploadedBy || '',
      publicationDate: metadata.publicationDate || null,
      fileUrl: fileUrl,
    };
  
    try {
      const metadataRes = await fetch(`${API_URL}/upload/metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadataPayload),
      });
  
      if (!metadataRes.ok) {
        throw new Error('Metadata upload failed');
      }
  
      const metadataData = await metadataRes.json();
      console.log('Metadata upload complete:', metadataData);
    } catch (error) {
      console.error('Metadata upload error:', error);
    }
  };
  

  const handleFileEdit = (id) => {
    const fileToEdit = files.find(file => file.id === id);
    if (fileToEdit) {
      setSelectedFile(fileToEdit);
    }
  };

  const handleFileDelete = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const handleMetadataUpdate = (id, metadata) => {
    setFiles(files.map(file => 
      file.id === id ? { ...file, ...metadata } : file
    ));
    setSelectedFile(null);
  };

  return {
    files,
    selectedFile,
    handleFileUpload,
    handleFileEdit,
    handleFileDelete,
    handleMetadataUpdate,
    setSelectedFile,
  };
};