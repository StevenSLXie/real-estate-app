// app/rankings/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RankingsPage() {
  const [rankings, setRankings] = useState<{ rental: any[]; sale: any[] }>({
    rental: [],
    sale: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/agents/ranking');
        const data = await response.json();
        setRankings(data);
      } catch (error) {
        console.error('Error fetching rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading rankings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Top 20 Agents by Transactions (Last 12 Months)
      </h1>

      

      {/* Sale Transactions Table */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sale Transactions</h2>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Rank</th>
                <th scope="col" className="px-6 py-3">Agent Name</th>
                <th scope="col" className="px-6 py-3">Registration Number</th>
                <th scope="col" className="px-6 py-3">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {rankings.sale?.length > 0 ? (
                rankings.sale.map((agent, index) => (
                  <tr
                    key={agent.salesperson_reg_num}
                    className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{index + 1}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/agent/${agent.salesperson_reg_num}`}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {agent.salesperson_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{agent.salesperson_reg_num}</td>
                    <td className="px-6 py-4">{agent.transaction_count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No sale transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Rental Transactions Table */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rental Transactions</h2>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Rank</th>
                <th scope="col" className="px-6 py-3">Agent Name</th>
                <th scope="col" className="px-6 py-3">Registration Number</th>
                <th scope="col" className="px-6 py-3">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {rankings.rental?.length > 0 ? (
                rankings.rental.map((agent, index) => (
                  <tr
                    key={agent.salesperson_reg_num}
                    className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{index + 1}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/agent/${agent.salesperson_reg_num}`}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {agent.salesperson_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{agent.salesperson_reg_num}</td>
                    <td className="px-6 py-4">{agent.transaction_count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No rental transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}