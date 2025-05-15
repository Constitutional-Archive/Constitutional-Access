const React = require('react');

const FeatureCards = () => {
  const features = [
    {
      icon: React.createElement('svg', {
        className: 'w-6 h-6 text-blue-600',
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24'
      }, React.createElement('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
      })),
      title: "Understand Your Query",
      description: "We parse and analyze your input intelligently to deliver precise answers.",
      bgColor: "bg-blue-100"
    },
    {
      icon: React.createElement('svg', {
        className: 'w-6 h-6 text-green-600',
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24'
      }, React.createElement('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M5 13l4 4L19 7'
      })),
      title: "Get Reliable Results",
      description: "Our engine uses curated sources to provide trustworthy, referenced answers.",
      bgColor: "bg-green-100"
    },
    {
      icon: React.createElement('svg', {
        className: 'w-6 h-6 text-purple-600',
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24'
      }, React.createElement('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
      })),
      title: "Interact Naturally",
      description: "Chat in natural language—no tech jargon needed.",
      bgColor: "bg-purple-100"
    }
  ];

  return React.createElement('div', { className: 'grid md:grid-cols-3 gap-8 mb-16' },
    features.map((feature, index) =>
      React.createElement('div', { key: index, className: 'bg-white p-6 rounded-xl shadow-sm border border-gray-100' },
        React.createElement('div', { className: `${feature.bgColor} w-12 h-12 rounded-full flex items-center justify-center mb-4` },
          feature.icon
        ),
        React.createElement('h3', { className: 'text-xl font-semibold mb-2' }, feature.title),
        React.createElement('p', { className: 'text-gray-600' }, feature.description)
      )
    )
  );
};

module.exports = FeatureCards;