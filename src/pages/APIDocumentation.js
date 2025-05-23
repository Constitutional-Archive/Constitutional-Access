import React from 'react';
import { ChevronRight } from 'lucide-react';

const APIDocumentation = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Constitutional Archive API Documentation
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
          Build applications using our comprehensive REST API
        </p>
      </header>

      <section className="bg-white shadow rounded-lg overflow-hidden">
        <article className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Getting Started</h2>
          <p className="mt-2 text-gray-600">
            Our API provides programmatic access to constitutional documents and metadata.
          </p>
        </article>

        <article className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Base URL</h3>
          <code className="mt-2 inline-block px-3 py-2 bg-gray-100 rounded text-sm font-mono">
            https://searchback-guhvgzbmdkcudvf4.canadacentral-01.azurewebsites.net/
          </code>
        </article>

        <article className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Authentication</h3>
          <p className="mt-2 text-gray-600">
            All API requests require an API key sent in the Authorization Key header.
          </p>
          <aside className="mt-4 bg-gray-50 p-4 rounded-md" aria-label="Example Authorization Header">
            <pre className="text-sm font-mono text-gray-800 overflow-x-auto">
              x-api-key: APP_API_KEY
            </pre>
          </aside>
        </article>

        <section className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Endpoints</h3>
          <ul className="mt-6 space-y-8 list-none">
            <li>
              <article>
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <ChevronRight className="h-5 w-5 text-blue-500" />
                  Search Documents
                </h4>
                <section className="mt-2 ps-7">
                  <p className="flex items-baseline gap-2">
                    <kbd className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-mono rounded">GET</kbd>
                    <code className="text-sm font-mono">/api/search?q=&#123;query&#125;</code>
                  </p>
                  <p className="mt-2 text-gray-600">Search constitutional documents by keyword or phrase.</p>
                  <aside className="mt-4 bg-gray-50 p-4 rounded-md" aria-label="Example Request">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Example Request</h5>
                    <pre className="text-sm font-mono text-gray-800 overflow-x-auto">
{`fetch('https://searchback-guhvgzbmdkcudvf4.canadacentral-01.azurewebsites.net/api/search?q=freedom', {
  headers: {
    'x-api-key': 'APP_API_KEY'
  }
})`}
                    </pre>
                  </aside>
                </section>
              </article>
            </li>

            <li>
              <article>
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <ChevronRight className="h-5 w-5 text-blue-500" />
                  Get Document by ID
                </h4>
                <section className="mt-2 ps-7">
                  <p className="flex items-baseline gap-2">
                    <kbd className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-mono rounded">POST</kbd>
                    <code className="text-sm font-mono">/api/files/</code>
                  </p>
                  <p className="mt-2 text-gray-600">
                    Retrieve a specific user's constitutional documents with metadata using their email in the request body.
                  </p>
                </section>
              </article>
            </li>
          </ul>
        </section>

        <section className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Response Format</h3>
          <p className="mt-2 text-gray-600">
            All responses are in JSON format with the following structure:
          </p>
          <aside className="mt-4 bg-gray-50 p-4 rounded-md" aria-label="Response Example">
            <pre className="text-sm font-mono text-gray-800 overflow-x-auto">
{`[
  {.....},
  {
    "id": "682xxxxxxxxxx7dxx3",
    "title": "African-National-Congress-Membership-Form-Download.pdf",
    "excerpt": "This is a legal form used to register members of the African National Congress (ANC).",
    "type": "legal",
    "relevance": "96%",
    "fileUrl": "https://searchback-guhvgzbmdkcudvf4.canadacentral-01.azurewebsites.net/api/search/download?path=xxxxxxxxxxxxxxxxxx",
    "uploadedAt": "2025-05-19T13:15:51.032Z"
  },
  {......}
]`}
            </pre>
          </aside>
        </section>
      </section>
    </main>
  );
};

export default APIDocumentation;
