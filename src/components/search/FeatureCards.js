const React = require('react');
const { useState } = require('react');
const { ChevronRight, Download, FileText } = require('lucide-react');

const ResultCard = ({ result }) => {
  const [showChat, setShowChat] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const title = result.title || result.name || 'Untitled';
  const excerpt = result.excerpt || result.summary || 'No summary available.';
  const relevance = result.relevance || result.score || 'N/A';
  const type = result.type || result.filetype || 'Unknown';
  const fileUrl = result.fileUrl;

  const handleSend = async () => {
    const userMessage = { role: 'user', content: input };
    const response = await fetch('/api/chat-with-doc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: result.fullText || result.excerpt || '',  // Replace with full doc if available
        history: [...messages, userMessage],
      })
    });
    const data = await response.json();
    const botMessage = { role: 'assistant', content: data.reply };

    setMessages([...messages, userMessage, botMessage]);
    setInput('');
  };

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
          React.createElement('a', {
            href: fileUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'inline-flex items-center text-sm text-blue-600 hover:text-blue-800'
          }, 'View ', React.createElement(ChevronRight, { className: 'h-4 w-4 ml-1' })),
          React.createElement('a', {
            href: fileUrl,
            download: true,
            className: 'inline-flex items-center text-sm text-blue-600 hover:text-blue-800'
          }, 'Download ', React.createElement(Download, { className: 'h-4 w-4 ml-1' })),
          React.createElement('button', {
            className: 'text-sm text-indigo-600 hover:text-indigo-800',
            onClick: () => setShowChat(!showChat)
          }, showChat ? 'Close Chat' : '💬 Chat')
        ),
        showChat && React.createElement('div', { className: 'mt-4 p-3 border rounded bg-gray-50 space-y-2' },
          messages.map((msg, i) => (
            React.createElement('div', {
              key: i,
              className: msg.role === 'user' ? 'text-right text-blue-700' : 'text-left text-gray-700'
            }, React.createElement('p', null, msg.content))
          )),
          React.createElement('div', { className: 'flex space-x-2 mt-2' },
            React.createElement('input', {
              value: input,
              onChange: e => setInput(e.target.value),
              placeholder: 'Ask something...',
              className: 'flex-1 border px-2 py-1 rounded'
            }),
            React.createElement('button', {
              onClick: handleSend,
              className: 'bg-indigo-600 text-white px-3 py-1 rounded'
            }, 'Send')
          )
        )
      )
    )
  );
};

module.exports = ResultCard;