// app/property-request/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PropertyRequestPage() {
  const [request, setRequest] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!request.trim()) {
      setError('Please enter a valid property request.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/property-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request }),
      });

      const data = await response.json();
      if (response.ok) {
        setResults(data.agents || []);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to process your request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Match an Agent</h1>
      
      {/* Tagline */}
      <p className="text-lg text-gray-600 mb-6">
        Property listings are everywhere, but good agents are hard to find.<br />
        Use our AI tool to find a list of agents with sound records, tailored to your request.
      </p>
      <textarea
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        placeholder="e.g., I am looking to:&#10;1) buy a resale HDB in Punggol;&#10;2) sell my condo in Clementi;&#10;3) rent a HDB room near the city area"
        className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-4 px-6 py-2 text-white rounded-lg ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
        }`}
        >
        {loading ? 'Processing...' : 'Submit Request'}
        </button>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Matching Agents</h2>
          <ul className="space-y-4">
            {results.map((agent, index) => (
              <li key={index} className="p-4 border border-gray-300 rounded-lg">
                <p className="font-bold">
                <Link
                        href={`/agent/${agent.salesperson_reg_num}`}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                  {agent.salesperson_name}
                  </Link>
                </p>
                <p>Registration Number: {agent.salesperson_reg_num}</p>
                <p>Similar Transactions Done: {agent.transaction_count}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}