import React from 'react';
import { Filter } from 'lucide-react';
import ResultCard from './ResultCard';
import ReactMarkdown from 'react-markdown';

const SearchResults = ({ searchQuery, results, hasSearched, aiAnswer, filter, setFilter }) => {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      {aiAnswer && (
        <div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Answer</h3>
          <div className="text-blue-800 prose max-w-none whitespace-pre-wrap">
            <ReactMarkdown>{aiAnswer}</ReactMarkdown>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {results.length > 0 && `Results for "${searchQuery}"`}
        </h2>
        <div className="flex items-center space-x-4 text-sm">
          <span className="flex items-center text-gray-600">
            <Filter className="h-4 w-4 mr-1" />
            Filters:
          </span>
          <select
            className="border rounded-lg px-3 py-1.5 text-gray-600 bg-white shadow-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="pdf">Articles (PDF)</option>
            <option value="image">Image</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
        </div>
      </div>

      {!hasSearched ? null : results.length === 0 ? (
        <p className="text-gray-500 text-center animate-pulse">No results found.</p>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <ResultCard key={result._id || result.fileName || Math.random()} result={result} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;