'use client';

export default function AgentStatPage() {
  // Hardcoded results
  const results = [
    { metric: 'Total Agents', value: '37,218', description: 'Total number of registered agents.' },
    { metric: 'Active Agents', value: '24,341', description: 'Agents with at least 1 transaction in the last 2 years.' },
    { metric: 'Buy/Sell Agents', value: '18,717', description: 'Agents with at least 1 buy/sell transaction in the last 2 years.' },
    { metric: 'Buy/Sell Percentage', value: '50.29%', description: 'Percentage of agents with at least 1 buy/sell transaction.' },
    { metric: 'Rental Agents', value: '20,928', description: 'Agents with at least 1 rental transaction in the last 2 years.' },
    { metric: 'Rental Percentage', value: '56.23%', description: 'Percentage of agents with at least 1 rental transaction.' },
    { metric: 'Rental Top 1%', value: '74', description: 'Minimum number of rental transactions for the top 1% of active agents.' },
    { metric: 'Rental Top 5%', value: '36', description: 'Minimum number of rental transactions for the top 5% of active agents.' },
    { metric: 'Rental Top 10%', value: '24', description: 'Minimum number of rental transactions for the top 10% of active agents.' },
    { metric: 'Rental Top 20%', value: '14', description: 'Minimum number of rental transactions for the top 20% of active agents.' },
    { metric: 'Rental Top 50%', value: '4', description: 'Minimum number of rental transactions for the top 50% of active agents.' },
    { metric: 'Sale Top 1%', value: '45', description: 'Minimum number of sale transactions for the top 1% of active agents.' },
    { metric: 'Sale Top 5%', value: '22', description: 'Minimum number of sale transactions for the top 5% of active agents.' },
    { metric: 'Sale Top 10%', value: '14', description: 'Minimum number of sale transactions for the top 10% of active agents.' },
    { metric: 'Sale Top 20%', value: '8', description: 'Minimum number of sale transactions for the top 20% of active agents.' },
    { metric: 'Sale Top 50%', value: '2', description: 'Minimum number of sale transactions for the top 50% of active agents.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">SG Property Agent Statistics</h1>
      <p className="text-gray-600 text-center mb-8">
        A detailed breakdown of agent activity and performance metrics based on recent transactions.
      </p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 border border-gray-200">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Metric</th>
              <th scope="col" className="px-6 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr
                key={index}
                className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-6 py-4 font-medium text-gray-900">{row.metric}</td>
                <td className="px-6 py-4">
                  <p className="text-gray-700">{row.value}</p>
                  <p className="text-gray-500 text-sm">{row.description}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}