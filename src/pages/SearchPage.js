// --- SearchPage.js ---
import React, { useState } from 'react';
import SearchHeader from '../components/search/SearchHeader';
import SearchResults from '../components/search/SearchResults';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setHasSearched(true);
    setResults([]);
    try {
      const endpoint = `${process.env.REACT_APP_SEARCH_BACKEND_URL || 'http://localhost:5000'}/api/semantic-search?query=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(endpoint);
      if (!res.ok) {
        const text = await res.text();
        console.error('Non-OK response:', text);
        throw new Error(`Invalid response type. Got: ${text.slice(0, 100)}`);
      }
      const data = await res.json();
      console.log("🔍 Results:", data);
      setResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
      alert('❌ Failed to fetch search results. Make sure the backend is running and returning valid JSON.\n\n' + err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <SearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleSearch={handleSearch}
        handleKeyDown={handleKeyDown}
      />
      {loading ? (
        <div className="text-center text-gray-600 mt-12 text-lg animate-pulse">🔍 Searching documents...</div>
      ) : (
        <SearchResults searchQuery={searchQuery} results={results} hasSearched={hasSearched} />
      )}
    </div>
  );
};

export default SearchPage;
