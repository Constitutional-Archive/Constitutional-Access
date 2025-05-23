import React from 'react';
import { Filter } from 'lucide-react';
import ResultCard from './ResultCard';
import ReactMarkdown from 'react-markdown';

const SearchResults = ({ searchQuery, results, hasSearched, aiAnswer, filter, setFilter }) => {
  return (
    <main className="max-w-4xl mx-auto mt-10" aria-labelledby="results-heading">
      {aiAnswer && (
        <aside className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-lg shadow-sm" aria-label="AI generated answer">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Answer</h3>
          <article className="text-blue-800 prose max-w-none whitespace-pre-wrap">
            <ReactMarkdown>{aiAnswer}</ReactMarkdown>
          </article>
        </aside>
      )}

      <header className="flex items-center justify-between mb-6">
        <h2 id="results-heading" className="text-2xl font-semibold text-gray-900">
          {results.length > 0 && `Results for "${searchQuery}"`}
        </h2>

        <form className="flex items-center gap-4 text-sm" aria-label="Filter search results">
          <label className="flex items-center text-gray-600" htmlFor="filter-select">
            <Filter className="h-4 w-4 mr-1" />
            Filters:
          </label>
          <select
            id="filter-select"
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
        </form>
      </header>

      {!hasSearched ? null : results.length === 0 ? (
        <p className="text-gray-500 text-center animate-pulse">No results found.</p>
      ) : (
        <section className="space-y-4" aria-label="Document results list">
          {results.map((result) => (
            <ResultCard key={result._id || result.fileName || Math.random()} result={result} />
          ))}
        </section>
      )}
    </main>
  );
};

export default SearchResults;
