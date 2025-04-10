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
          Find Real Estate Agent
        </h1>
        <div>
          <label
            htmlFor="search"
            className="block mb-3 text-lg font-medium text-gray-700"
          >
            Agent Name
          </label>
          <input
            type="text"
            id="search"
            placeholder="Enter agent name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="block w-full px-5 py-4 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
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
      </div>
    </div>
  );
}