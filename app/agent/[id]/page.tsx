// app/agent/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

interface AgentStats {
  salesperson_name: string;
  total_transactions: number;
  by_property_type: { type: string; count: number }[];
  by_transaction_type: { type: string; count: number }[];
}

export default function AgentPage({ params }: { params: { id: string } }) {
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/agents/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Agent not found');
        return res.json();
      })
      .then(setStats)
      .catch(() => setError('Agent not found'));
  }, [params.id]);

  if (error) {
    return (
      <Container>
        <h1>Error</h1>
        <p>{error}</p>
      </Container>
    );
  }

  if (!stats) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <h1>{stats.salesperson_name}</h1>
      <StatsGrid>
        <div>
          <h2>Total Transactions</h2>
          <p>{stats.total_transactions}</p>
        </div>
        <div>
          <h2>By Property Type</h2>
          {stats.by_property_type.map(item => (
            <p key={item.type}>
              {item.type}: {item.count}
            </p>
          ))}
        </div>
        <div>
          <h2>By Transaction Type</h2>
          {stats.by_transaction_type.map(item => (
            <p key={item.type}>
              {item.type}: {item.count}
            </p>
          ))}
        </div>
      </StatsGrid>
    </Container>
  );
}