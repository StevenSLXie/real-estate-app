// app/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    router.push(`/search?name=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          AgentTrack
        </h1>
        <div>
          <input
            type="text"
            id="search"
            placeholder="Enter agent name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="block w-full px-5 py-4 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
          {/* Disclaimer Section */}
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className={`mt-6 w-full px-5 py-4 text-lg font-medium rounded-lg ${
            isLoading
              ? 'bg-gray-300 cursor-not-allowed text-gray-700'
              : 'bg-black text-white hover:bg-gray-800 active:bg-gray-900'
          }`}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
        <div className="mt-4 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-lg p-4">
            <p>
              <strong>Disclaimer:</strong> Only for agents with at least 1 transaction registered in the past 2 years. All data displayed on this platform is sourced from : 
              <a 
                href="https://data.gov.sg" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline"
              >
                data.gov.sg
              </a>. Due to potential input errors, industry practices, or other factors, inaccuracies may exist in the original data source. Additionally, in a team setting, the agent who registered the transaction might not be the one actually handling or marketing the deal, which could lead to further inaccuracies. The information provided here is for informational purposes only, and we do not guarantee its accuracy or completeness. Users are advised to verify the information independently.
            </p>
          </div>
      </div>
    </div>
  );
}