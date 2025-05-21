import React, { useState, useEffect, useCallback, useRef } from 'react';
import SearchHeader from '../components/search/SearchHeader';
import SearchResults from '../components/search/SearchResults';
import { Loader2 } from 'lucide-react';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Store latest query in ref for filter/category changes
  const searchQueryRef = useRef(searchQuery);
  useEffect(() => {
    searchQueryRef.current = searchQuery;
  }, [searchQuery]);

  // Stable search function
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    setHasSearched(true);
    setResults([]);
    try {
      const backendUrl = process.env.REACT_APP_SEARCH_BACKEND_URL || 'http://localhost:5000';
      const categoryParam = selectedCategories.join(',');
      const endpoint = `${backendUrl}/api/semantic-search?query=${encodeURIComponent(query)}&filter=${filter}&categories=${categoryParam}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setResults(data.results || []);
      setAnswer(data.answer || '');
    } catch (err) {
      alert('Search failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, selectedCategories]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  // Re-run search if filter/category changes after initial search
  useEffect(() => {
    if (hasSearched) {
      handleSearch(searchQueryRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, selectedCategories, hasSearched]);

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <SearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        handleSearch={() => handleSearch(searchQuery)}
        handleKeyDown={handleKeyDown}
      />
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-16 text-gray-600">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="mt-4 text-sm text-gray-500">Searching documents...</p>
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