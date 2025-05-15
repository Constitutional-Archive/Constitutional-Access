import React from 'react';
import { Edit, Trash2, FolderTree } from 'lucide-react';

const FileTable = ({ files, onEdit, onDelete }) => {
  return (
    <figure className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {files.map((file) => (
            <tr key={file.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <figure className="flex items-center">
                  <FolderTree className="h-5 w-5 text-gray-400 mr-2" />
                  <figcaption>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    {file.tags && (
                      <p className="text-sm text-gray-500">
                        {file.tags.map((tag, index) => (
                          <mark key={index} className="mr-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                            {tag}
                          </mark>
                        ))}
                      </p>
                    )}
                  </figcaption>
                </figure>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.category || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.path || '/'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.size}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  className="text-blue-600 hover:text-blue-900 mr-3"
                  onClick={() => onEdit(file.id)}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  className="text-red-600 hover:text-red-900"
                  onClick={() => onDelete(file.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};

export default FileTable;