import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';
import FileUpload from '../components/admin/FileUpload';
import FileTable from '../components/admin/FileTable';
import EditMetadataModal from '../components/admin/EditMetadataModal';
import { useFileManagement } from '../hooks/useFileManagement';
import { useEffect } from 'react';

const AdminPage = () => {
  const navigate = useNavigate();
  const {
    fetchFiles,
    files,
    selectedFile,
    handleFileUpload,
    handleFileEdit,
    handleFileDelete,
    handleMetadataUpdate,
    setSelectedFile,
  } = useFileManagement();

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleSignOut = () => {
    // Mock implementation - in real app, this would call an auth service
    console.log('Signing out...');
    navigate('/');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <article className="bg-white rounded-lg shadow p-6">
        <AdminHeader onSignOut={handleSignOut} />
        
        {/* File Upload Section */}
        <section aria-labelledby="file-upload-heading">
          <h2 id="file-upload-heading" className="sr-only">File Upload</h2>
          <FileUpload onFileSelect={handleFileUpload} />
        </section>

        {/* File Management Section */}
        <section aria-labelledby="file-management-heading">
          <header>
            <h2 id="file-management-heading" className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h2>
          </header>
          <FileTable
            files={files}
            onEdit={handleFileEdit}
            onDelete={handleFileDelete}
          />
        </section>

        {/* Edit Metadata Modal */}
        {selectedFile && (
          <EditMetadataModal
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
            onSave={handleMetadataUpdate}
          />
        )}
      </article>
    </main>
  );
};

export default AdminPage;