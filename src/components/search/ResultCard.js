import React, { useState } from 'react';
import { ChevronRight, Download, FileText, Bot } from 'lucide-react';

const ResultCard = ({ result }) => {
  const [showChat, setShowChat] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const title = result.title || result.fileName || result.name || 'Untitled';
  const excerpt = result.excerpt || result.summary || result.preview || 'No summary available.';
  const relevance = typeof result.relevance === 'string'
    ? result.relevance
    : result.score
    ? `${(result.score * 100).toFixed(1)}%`
    : 'N/A';
  const type = result.type || result.filetype || 'Unknown';
  const fileUrl = result.fileUrl || result.url;

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      const response = await fetch('http://localhost:5000/api/chat/chat-with-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl, history: [...messages, userMessage] }),
      });

      const data = await response.json();
      const botMessage = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Error fetching response from AI.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 mt-1 text-gray-400">
          <FileText className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-gray-600 whitespace-pre-wrap">{excerpt}</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Relevance: {relevance}
            </span>
          </div>

          <div className="mt-4 flex items-center space-x-6">
            <span className="inline-flex items-center text-sm text-gray-500">{type}</span>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              View <ChevronRight className="h-4 w-4 ml-1" />
            </a>
            <a
              href={fileUrl}
              download
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              Download <Download className="h-4 w-4 ml-1" />
            </a>
            <button
              className="text-sm text-indigo-600 hover:text-indigo-800"
              onClick={() => setShowChat(!showChat)}
            >
              {showChat ? 'Close Chat' : '💬 Chat'}
            </button>
          </div>

          {showChat && (
            <div className="mt-4 p-3 border rounded bg-gray-50 space-y-2">
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-md ${msg.role === 'user' ? 'bg-blue-100 text-right text-blue-700' : 'bg-gray-200 text-left text-gray-800'}`}
                  >
                    {msg.role === 'assistant' && <Bot className="inline-block w-4 h-4 mr-1" />}
                    <span>{msg.content}</span>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2 mt-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something..."
                  className="flex-1 border px-2 py-1 rounded"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-indigo-600 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  {isLoading ? '...' : 'Send'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
