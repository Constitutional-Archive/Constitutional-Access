import React, { useState } from 'react';
import { ChevronRight, Download, FileText, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];

const isImageUrl = (url) => {
  if (!url) return false;
  const parts = url.split(`files/`);
  const blobNameWithQuery = parts[1] || '';
  const blobName = decodeURI(blobNameWithQuery.split('?')[0] || '');
  return imageExtensions.some(ext => blobName.toLowerCase().endsWith(ext));
};

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
      const response = await fetch(
        `${process.env.REACT_APP_SEARCH_BACKEND_URL || 'http://localhost:5000'}/api/chat/chat-with-doc`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileUrl, history: [...messages, userMessage] }),
        }
      );

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
    <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow w-full max-w-full overflow-hidden">
      <header className="flex items-start gap-4">
        <figure className="flex-shrink-0 mt-1 text-gray-400">
          {isImageUrl(fileUrl) ? (
            <img
              src={fileUrl}
              alt={title}
              className="w-16 h-16 object-cover rounded-md border border-gray-300"
              loading="lazy"
            />
          ) : (
            <FileText className="w-6 h-6" />
          )}
        </figure>

        <section className="flex-1 min-w-0">
          <header className="flex justify-between items-start gap-4">
            <section className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 max-w-full truncate">{title}</h3>
              <p className="mt-2 text-gray-600 whitespace-pre-wrap break-words">{excerpt}</p>
            </section>
            <mark className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
              Relevance: {relevance}
            </mark>
          </header>

          <nav className="mt-4 flex flex-wrap items-center gap-4 text-sm" aria-label="Result actions">
            <p className="text-gray-500">{type}</p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              View <ChevronRight className="h-4 w-4 ml-1" />
            </a>
            <a
              href={fileUrl}
              download
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              Download <Download className="h-4 w-4 ml-1" />
            </a>
            <button
              className="text-indigo-600 hover:text-indigo-800"
              onClick={() => setShowChat(!showChat)}
            >
              {showChat ? 'Close Chat' : '💬 Chat'}
            </button>
          </nav>

          {showChat && (
            <aside className="mt-4 border rounded-lg bg-gray-50 p-4 space-y-3 max-w-full overflow-hidden" aria-label="AI chat">
              <section className="space-y-3 max-h-64 overflow-y-auto pr-1" aria-live="polite">
                {messages.map((msg, i) => (
                  <section
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <figure className="flex-shrink-0 mr-2 text-indigo-500">
                        <Bot className="w-5 h-5 mt-1" />
                      </figure>
                    )}
                    <section
                      className={`p-2 px-3 rounded-lg max-w-[75%] text-sm break-words ${
                        msg.role === 'user'
                          ? 'bg-blue-400 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <article className="prose prose-sm max-w-none text-black [&_li::marker]:text-black [&_ol>li::marker]:text-black">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </article>
                    </section>
                  </section>
                ))}
              </section>

              <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask AI a question related to this document..."
                  className="flex-1 min-w-0 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
                >
                  {isLoading ? '...' : 'Send'}
                </button>
              </form>
            </aside>
          )}
        </section>
      </header>
    </article>
  );
};

export default ResultCard;
