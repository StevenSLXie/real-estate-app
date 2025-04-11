// app/search/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const [results, setResults] = useState<{ agents: any[] }>({ agents: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/agents/search?name=${encodeURIComponent(name || '')}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [name]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-gray-600 animate-pulse">Loading search results...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Search Results</h1>
      {results.agents.length === 0 ? (
        <p className="text-lg text-gray-600 text-center">No agents found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.agents.map((agent) => (
            <div
              key={agent.salesperson_reg_num}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
              onClick={() => router.push(`/agent/${agent.salesperson_reg_num}`)}
            >
              <h2 className="text-lg font-semibold text-gray-800 text-center">
                {agent.salesperson_name}
              </h2>
              <p className="text-sm text-gray-500 text-center">
                Registration: {agent.salesperson_reg_num}
              </p>
              <p className="text-blue-600 font-medium text-center mt-2">
                {agent.total_transactions} Transactions
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}