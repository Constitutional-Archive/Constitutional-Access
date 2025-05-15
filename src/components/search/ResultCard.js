const React = require('react');
const { ChevronRight, Download, FileText } = require('lucide-react');

const ResultCard = ({ result }) => {
  console.log("Rendering result:", result); 
  const title = result.title || result.name || 'Untitled';
  const excerpt = result.excerpt || result.summary || 'No summary available.';
  const relevance = result.relevance || result.score || 'N/A';
  const type = result.type || result.filetype || 'Unknown';
  const fileUrl = result.fileUrl;

  return React.createElement('div', {
    className: 'bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'
  },
    React.createElement('div', { className: 'flex items-start space-x-4' },
      React.createElement('div', { className: 'flex-shrink-0 mt-1 text-gray-400' },
        React.createElement(FileText, { className: 'w-6 h-6' })
      ),
      React.createElement('div', { className: 'flex-1' },
        React.createElement('div', { className: 'flex justify-between items-start' },
          React.createElement('div', null,
            React.createElement('h3', { className: 'text-lg font-semibold text-gray-900' }, title),
            React.createElement('p', { className: 'mt-2 text-gray-600' }, excerpt)
          ),
          React.createElement('span', {
            className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
          }, `Relevance: ${relevance}`)
        ),
        React.createElement('div', { className: 'mt-4 flex items-center space-x-6' },
          React.createElement('span', { className: 'inline-flex items-center text-sm text-gray-500' }, type),

          // View Button
          React.createElement('a', {
            href: fileUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'inline-flex items-center text-sm text-blue-600 hover:text-blue-800'
          }, 'View ', React.createElement(ChevronRight, { className: 'h-4 w-4 ml-1' })),

          // Download Button
          React.createElement('a', {
            href: fileUrl,
            download: true,
            className: 'inline-flex items-center text-sm text-blue-600 hover:text-blue-800'
          }, 'Download ', React.createElement(Download, { className: 'h-4 w-4 ml-1' }))
        )
      )
    )
  );
};

module.exports = ResultCard;