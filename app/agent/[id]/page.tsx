// app/agent/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function AgentPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/agents/${params.id}`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error('Error fetching agent data:', err));
  }, [params.id]);

  if (!data) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{data.summary.salesperson_name}</h1>
        <p className="text-lg text-gray-500">Registration: {data.summary.salesperson_reg_num}</p>
        <p className="mt-2 text-xl text-blue-600 font-semibold">
          Total Transactions: {data.summary.total_transactions}
        </p>
      </header>

      {/* Summary Section */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Transaction Summary</h2>
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 text-gray-600 font-medium">Property Type</th>
              <th className="text-left px-4 py-2 text-gray-600 font-medium">Count</th>
            </tr>
          </thead>
          <tbody>
            {data.summary.by_property_type?.map((item: any) => (
              <tr key={item.type} className="border-b">
                <td className="px-4 py-2 text-gray-700">{item.type}</td>
                <td className="px-4 py-2 text-gray-700">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 text-gray-600 font-medium">Transaction Type</th>
              <th className="text-left px-4 py-2 text-gray-600 font-medium">Count</th>
            </tr>
          </thead>
          <tbody>
            {data.summary.by_transaction_type?.map((item: any) => (
              <tr key={item.type} className="border-b">
                <td className="px-4 py-2 text-gray-700">{item.type}</td>
                <td className="px-4 py-2 text-gray-700">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Rental Transactions Section */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rental Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 text-gray-600 font-medium">Date</th>
                <th className="text-left px-4 py-2 text-gray-600 font-medium">Property Type</th>
                <th className="text-left px-4 py-2 text-gray-600 font-medium">Location</th>
                <th className="text-left px-4 py-2 text-gray-600 font-medium">District</th>
              </tr>
            </thead>
            <tbody>
              {data.rental_transactions?.map((t: any) => (
                <tr key={`${t.transaction_date}-${t.property_type}-${t.general_location}`} className="border-b">
                  <td className="px-4 py-2 text-gray-700">{format(new Date(t.transaction_date), 'dd MMM yyyy')}</td>
                  <td className="px-4 py-2 text-gray-700">{t.property_type}</td>
                  <td className="px-4 py-2 text-gray-700">{t.general_location}</td>
                  <td className="px-4 py-2 text-gray-700">{t.district}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sale Transactions Section */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sale Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 text-gray-600 font-medium">Date</th>
                <th className="text-left px-4 py-2 text-gray-600 font-medium">Type</th>
                <th className="text-left px-4 py-2 text-gray-600 font-medium">Property Type</th>
                <th className="text-left px-4 py-2 text-gray-600 font-medium">Location</th>
                <th className="text-left px-4 py-2 text-gray-600 font-medium">District</th>
              </tr>
            </thead>
            <tbody>
              {data.sale_transactions?.map((t: any) => (
                <tr key={`${t.transaction_date}-${t.property_type}-${t.general_location}`} className="border-b">
                  <td className="px-4 py-2 text-gray-700">{format(new Date(t.transaction_date), 'dd MMM yyyy')}</td>
                  <td className="px-4 py-2 text-gray-700">{t.transaction_type}</td>
                  <td className="px-4 py-2 text-gray-700">{t.property_type}</td>
                  <td className="px-4 py-2 text-gray-700">{t.general_location}</td>
                  <td className="px-4 py-2 text-gray-700">{t.district}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}