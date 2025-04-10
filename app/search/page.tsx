// app/search/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<{ agents: any[]; pagination: any }>({
    agents: [],
    pagination: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const response = await fetch(
        `/api/agents/search?${searchParams.toString()}`
      );
      const data = await response.json();
      setResults(data);
      setLoading(false);
    };
    fetchResults();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Find Your Agent
      </h1>
      {results.agents.length === 0 ? (
        <p className="text-lg text-gray-600 text-center">
          No agents found. Try searching with a different name.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.agents.map((agent) => (
            <div
              key={agent.salesperson_reg_num}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
              onClick={() =>
                router.push(`/agent/${agent.salesperson_reg_num}`)
              }
            >
              {/* Profile Picture Placeholder */}
            

              {/* Agent Info */}
              <h2 className="text-lg font-semibold text-gray-800 text-center">
                {agent.salesperson_name}
              </h2>
              <p className="text-sm text-gray-500 text-center">
                Registration: {agent.salesperson_reg_num}
              </p>
              <p className="text-blue-600 font-medium text-center mt-2">
                {agent.total_transactions} Transactions
              </p>
              {/* Badge */}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {results.pagination.pages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: results.pagination.pages }, (_, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-md ${
                results.pagination.page === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() =>
                router.push(
                  `/search?${new URLSearchParams({
                    ...Object.fromEntries(searchParams),
                    page: (i + 1).toString(),
                  })}`
                )
              }
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}