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
          Total Transactions: {data.summary.total_transactions} (last 2 years)
        </p>
        {/* Badges Section */}
    <div className="mt-4 flex flex-wrap justify-center gap-4">
      {data.badges?.length > 0 ? (
        data.badges.map((badge: string, index: number) => (
          <span
            key={index}
            className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg shadow"
          >
            {badge}
          </span>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No badges awarded.</p>
      )}
    </div>
      </header>

      <div className="mt-6 mb-6 bg-gray-100 border border-gray-300 rounded-lg p-4 text-sm text-gray-700">
  <p>
    <strong>Disclaimer:</strong> All data displayed on this page is sourced from:  
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

      {/* Summary Section */}
      <div className="relative overflow-x-auto">
  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-6 py-3">
          Property Type
        </th>
        <th scope="col" className="px-6 py-3">
          Count
        </th>
      </tr>
    </thead>
    <tbody>
      {data.summary.by_property_type?.map((item: any) => (
        <tr
          key={item.type}
          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
        >
          <th
            scope="row"
            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {item.type}
          </th>
          <td className="px-6 py-4">{item.count}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

<div className="relative overflow-x-auto mt-6">
  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-6 py-3">
          Transaction Type
        </th>
        <th scope="col" className="px-6 py-3">
          Count
        </th>
      </tr>
    </thead>
    <tbody>
      {data.summary.by_transaction_type?.map((item: any) => (
        <tr
          key={item.type}
          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
        >
          <th
            scope="row"
            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {item.type}
          </th>
          <td className="px-6 py-4">{item.count}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
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