import React, { useState, useCallback } from 'react';
import SearchHeader from '../components/search/SearchHeader';
import SearchResults from '../components/search/SearchResults';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setHasSearched(true);
    setResults([]);
    try {
      const backendUrl = process.env.REACT_APP_SEARCH_BACKEND_URL || 'http://localhost:5000';
      const categoryParam = selectedCategories.join(',');
      const endpoint = `${backendUrl}/api/semantic-search?query=${encodeURIComponent(searchQuery)}&filter=${filter}&categories=${categoryParam}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setResults(data.results || []);
      setAnswer(data.answer || '');
    } catch (err) {
      alert('Search failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filter, selectedCategories]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // ✅ Re-trigger search only when filter/category changes after an initial search
  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <SearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        handleSearch={handleSearch}
        handleKeyDown={handleKeyDown}
      />
      {loading ? (
        <div className="text-center text-gray-600 mt-12 text-lg animate-pulse">
          🔍 Searching documents...
        </div>
      ) : (
        <SearchResults
          searchQuery={searchQuery}
          results={results}
          hasSearched={hasSearched}
          aiAnswer={answer}
          filter={filter}
          setFilter={setFilter}
        />
      )}
    </div>
  );
};

export default SearchPage;