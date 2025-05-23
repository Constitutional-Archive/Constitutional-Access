import React from 'react';
import { Search } from 'lucide-react';

const categories = [
  { label: "Constitution", value: "constitution" },
  { label: "Amendment", value: "amendment" },
  { label: "Legal", value: "legal" },
  { label: "Bill", value: "bill" },
  { label: "Acts", value: "acts" },
];

const SearchHeader = ({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  handleSearch,
  handleKeyDown
}) => {
  const toggleCategory = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  return (
    <section className="text-center mb-16" aria-labelledby="search-title">
      <header>
        <h1 id="search-title" className="text-4xl font-bold text-gray-900 mb-6">
          What do you want to search?
        </h1>
      </header>

      <form
        className="max-w-2xl mx-auto relative"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <label htmlFor="search-input" className="sr-only">Search input</label>
        <input
          id="search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about constitutional documents..."
          className="w-full px-6 py-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-lg"
          autoFocus
        />
        <button
          type="submit"
          className="absolute right-3 top-3 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none"
          aria-label="Search"
        >
          <Search className="h-6 w-6" />
        </button>
      </form>

      <fieldset
        className="mt-6 flex justify-center gap-4 flex-wrap"
        aria-label="Filter categories"
      >
        <legend className="sr-only">Categories</legend>
        {categories.map((cat) => (
          <label
            key={cat.value}
            className="inline-flex items-center text-gray-700 text-sm"
          >
            <input
              type="checkbox"
              value={cat.value}
              checked={selectedCategories.includes(cat.value)}
              onChange={() => toggleCategory(cat.value)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <abbr title={cat.label} className="ml-2 not-italic">
              {cat.label}
            </abbr>
          </label>
        ))}
      </fieldset>
    </section>
  );
};

export default SearchHeader;
