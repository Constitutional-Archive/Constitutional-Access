const React = require('react');
const { Filter } = require('lucide-react');
const ResultCard = require('./ResultCard');

const SearchResults = ({ searchQuery, results, selectedFileType, onFileTypeChange }) => {
  return React.createElement('div', { className: 'max-w-4xl mx-auto' },
    React.createElement('div', { className: 'flex items-center justify-between mb-6' },
      React.createElement('h2', { className: 'text-2xl font-semibold text-gray-900' },
        `Search Results for "${searchQuery || ''}"`
      ),
      React.createElement('div', { className: 'flex items-center space-x-4 text-sm' },
        React.createElement('span', { className: 'flex items-center text-gray-600' },
          React.createElement(Filter, { className: 'h-4 w-4 mr-1' }),
          'Filters:'
        ),
        React.createElement('select', {
          className: 'border rounded-lg px-3 py-1.5 text-gray-600 bg-white shadow-sm',
          value: selectedFileType || '', // Make this controlled
          onChange: (e) => onFileTypeChange(e.target.value), // Trigger callback
        },
          React.createElement('option', { value: '' }, 'All Types'),
          React.createElement('option', { value: 'article' }, 'Article'),
          React.createElement('option', { value: 'audio' }, 'Audio'),
          React.createElement('option', { value: 'video' }, 'Video'),
          React.createElement('option', { value: 'image' }, 'Image')
        )
      )
    ),
    results.length === 0
      ? React.createElement('p', { className: 'text-gray-500 text-center' }, 'No results found.')
      : React.createElement('div', { className: 'space-y-4' },
          results.map(result =>
            React.createElement(ResultCard, {
              key: result._id || result.id || Math.random(),
              result: result
            })
          )
        )
  );
};

module.exports = SearchResults;
