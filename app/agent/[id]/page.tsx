// app/agent/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Table, Th, Td, Tr } from '@/components/Table';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
      <Header>
        <Title>{stats?.salesperson_name}</Title>
        <Subtitle>Agent Performance Dashboard</Subtitle>
      </Header>

      <StatGrid>
        <StatCard>
          <StatValue>{stats?.total_transactions}</StatValue>
          <StatLabel>Total Transactions</StatLabel>
        </StatCard>
      </StatGrid>

      <Card>
        <h2>Property Types</h2>
        <Table>
          <thead>
            <tr>
              <Th>Type</Th>
              <Th>Transactions</Th>
            </tr>
          </thead>
          <tbody>
            {stats?.by_property_type.map(item => (
              <Tr key={item.type}>
                <Td>{item.type}</Td>
                <Td>{item.count}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card>
        <h2>Transaction Types</h2>
        <Table>
          <thead>
            <tr>
              <Th>Type</Th>
              <Th>Count</Th>
            </tr>
          </thead>
          <tbody>
            {stats?.by_transaction_type.map(item => (
              <Tr key={item.type}>
                <Td>{item.type}</Td>
                <Td>{item.count}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}