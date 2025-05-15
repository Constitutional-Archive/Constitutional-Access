import React, { useEffect, useState } from 'react';

function uploadpage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/files')
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .catch((err) => console.error('Failed to load files:', err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Uploaded Files</h2>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file._id}>
              <strong>{file.filename}</strong> – uploaded by {file.uploadedBy} on{' '}
              {new Date(file.uploadedAt).toLocaleString()} –{' '}
              <a href={file.blobUrl} target="_blank" rel="noopener noreferrer">Download</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default uploadpage;
