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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Property Request</h1>
      <textarea
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        placeholder="Describe your property request (e.g., I want to find a resale HDB near XX area with a 1-million budget)"
        className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-4 px-6 py-2 text-white rounded-lg ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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