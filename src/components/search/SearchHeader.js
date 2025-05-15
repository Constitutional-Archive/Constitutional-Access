const React = require('react');
const { Search } = require('lucide-react');

const SearchHeader = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, handleSearch, handleKeyDown }) => {
  const categories = [
    { label: "Constitution", value: "constitution" },
    { label: "Amendment", value: "amendment" },
    { label: "Legal Documents", value: "legal" }
  ];

  return React.createElement('div', { className: 'text-center mb-16' },
    React.createElement('h1', { className: 'text-4xl font-bold text-gray-900 mb-6' }, 'What do you want to search?'),
    React.createElement('div', { className: 'max-w-2xl mx-auto relative' },
      React.createElement('input', {
        type: 'text',
        value: searchQuery,
        onChange: (e) => setSearchQuery(e.target.value),
        onKeyDown: handleKeyDown,
        placeholder: 'Ask anything about constitutional documents...',
        className: 'w-full px-6 py-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-lg',
        autoFocus: true
      }),
      React.createElement('button', {
        onClick: handleSearch,
        className: 'absolute right-3 top-3 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none'
      }, React.createElement(Search, { className: 'h-6 w-6' }))
    ),
    React.createElement('div', { className: 'mt-6 flex justify-center gap-6' },
      categories.map((cat) =>
        React.createElement('label', { key: cat.value, className: 'inline-flex items-center text-gray-700 text-lg' },
          React.createElement('input', {
            type: 'radio',
            name: 'docType',
            value: cat.value,
            className: 'form-radio h-5 w-5 text-blue-600',
            checked: selectedCategory === cat.value,
            onChange: () => {
              const newCategory = selectedCategory === cat.value ? '' : cat.value;
              setSelectedCategory(newCategory); // ✅ Don't call handleSearch here
            },
          }),
          React.createElement('span', { className: 'ml-2' }, cat.label)
        )
      )
    )
  );
};

module.exports = SearchHeader;
