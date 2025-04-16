// components/Header.tsx
'use client';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  return (
    <header className="bg-gray-800 text-white py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center">
        {/* Logo */}
        <h1
          className="text-xl font-bold cursor-pointer mb-4 sm:mb-0"
          onClick={() => router.push('/')}
        >
          AgentTrack
        </h1>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <button
            onClick={() => router.push('/property-request')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium w-full sm:w-auto"
          >
            Find an Agent
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium w-full sm:w-auto"
          >
            Search
          </button>
          <button
            onClick={() => router.push('/ranking')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium w-full sm:w-auto"
          >
            Top 30
          </button>
          <button
            onClick={() => router.push('/agent_stat')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium w-full sm:w-auto"
          >
            Agent Stats
          </button>
        </div>
      </div>
    </header>
  );
}