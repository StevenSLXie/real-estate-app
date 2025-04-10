// components/Header.tsx
'use client';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  return (
    <header className="bg-gray-800 text-white py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Real Estate Portal</h1>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium"
        >
          Home
        </button>
      </div>
    </header>
  );
}