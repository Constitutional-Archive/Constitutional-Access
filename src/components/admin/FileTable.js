import React from 'react';
import { Edit, Trash2, FolderTree } from 'lucide-react';

const FileTable = ({ files, onEdit, onDelete }) => {
  return (
    <figure className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <caption className="sr-only">Uploaded files with metadata</caption>
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {files.map((file) => (
            <tr key={file._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <figure className="flex items-center">
                  <FolderTree className="h-5 w-5 text-gray-400 me-2" />
                  <figcaption>
                    <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                    {file.tags && (
                      <ul className="flex flex-wrap mt-1">
                        {file.tags.map((tag, index) => (
                          <li
                            key={index}
                            className="mr-2 mb-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
                          >
                            <mark className="bg-transparent">{tag}</mark>
                          </li>
                        ))}
                      </ul>
                    )}
                  </figcaption>
                </figure>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {file.category || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                {file.fileUrl ? (
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Open
                  </a>
                ) : (
                  <code>/</code>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {file.uploadedAt}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <nav className="flex space-x-3" aria-label={`Actions for ${file.fileName}`}>
                  <button
                    type="button"
                    onClick={() => onEdit(file._id)}
                    className="text-blue-600 hover:text-blue-900"
                    aria-label={`Edit ${file.fileName}`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(file._id)}
                    className="text-red-600 hover:text-red-900"
                    aria-label={`Delete ${file.fileName}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};

export default FileTable;
