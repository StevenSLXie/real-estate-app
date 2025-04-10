// app/agent/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import styled from 'styled-components';
// import { Table, Th, Td, Tr } from '@/components/Table';

// Add these styled components at the top of page.tsx

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  margin-bottom: 3rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
`;

const TotalTransactions = styled.div`
  font-size: 1.25rem;
  color: #2563eb;
  margin-top: 1rem;
`;

const StatSection = styled.section`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  
  h2 {
    color: #1e293b;
    margin-bottom: 1.5rem;
  }
`;

const TransactionSection = styled.section`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  
  h2 {
    color: #1e293b;
    margin: 1.5rem 0;
  }
`;

const TransactionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  
  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`;

const Table = styled(TransactionTable)``;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #f8fafc;
  color: #1e293b;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
`;

const Tr = styled.tr`
  &:hover {
    background: #f8fafc;
  }
`;

interface Transaction {
    transaction_date: string;
    transaction_type: string;
    property_type: string;
    general_location: string;
    district: string;
  }
  
  interface AgentData {
    summary: {
      salesperson_name: string;
      salesperson_reg_num: string;
      total_transactions: number;
      by_property_type: Array<{
        type: string;
        count: number;
      }>;
      by_transaction_type: Array<{
        type: string;
        count: number;
      }>;
    };
    rental_transactions: Transaction[];
    sale_transactions: Transaction[];
  }

  export default function AgentPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [data, setData] = useState<AgentData | null>(null);
  
    useEffect(() => {
      fetch(`/api/agents/${resolvedParams.id}`)
        .then(res => res.json())
        .then(setData);
    }, [resolvedParams.id]);
  
    if (!data) return <div>Loading...</div>;
  
    return (
      <Container>
        <Header>
          <Title>{data.summary.salesperson_name}</Title>
          <Subtitle>Registration: {data.summary.salesperson_reg_num}</Subtitle>
          <TotalTransactions>
            Total Transactions within 2 years: {data.summary.total_transactions}
          </TotalTransactions>
        </Header>
  
        <StatSection>
          <h2>Transaction Summary</h2>
          <Table>
            <thead>
              <tr>
                <Th>Property Type</Th>
                <Th>Count</Th>
              </tr>
            </thead>
            <tbody>
              {data.summary.by_property_type?.map(item => (
                <Tr key={item.type}>
                  <Td>{item.type}</Td>
                  <Td>{item.count}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
          <Table>
            <thead>
              <tr>
                <Th>Sale/Rental </Th>
                <Th>Count</Th>
              </tr>
            </thead>
            <tbody>
              {data.summary.by_transaction_type?.map(item => (
                <Tr key={item.type}>
                  <Td>{item.type}</Td>
                  <Td>{item.count}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </StatSection>
  
        <TransactionSection>
          <h2>Sale Transactions</h2>
          <TransactionTable>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Property Type</Th>
                <Th>Location</Th>
                <Th>District</Th>
              </tr>
            </thead>
            <tbody>
              {data.sale_transactions?.map((t) => (
                <Tr key={`${t.transaction_date}-${t.property_type}-${t.general_location}`}>
                  <Td>{t.transaction_date}</Td>
                  <Td>{t.property_type}</Td>
                  <Td>{t.general_location}</Td>
                  <Td>{t.district}</Td>
                </Tr>
              ))}
            </tbody>
          </TransactionTable>
  
          <h2>Rental Transactions</h2>
          <TransactionTable>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Type</Th>
                <Th>Property Type</Th>
                <Th>Location</Th>
                <Th>District</Th>
              </tr>
            </thead>
            <tbody>
              {data.rental_transactions?.map((t) => (
                <Tr key={`${t.transaction_date}-${t.property_type}-${t.general_location}`}>
                  <Td>{t.transaction_date}</Td>
                  <Td>{t.transaction_type}</Td>
                  <Td>{t.property_type}</Td>
                  <Td>{t.general_location}</Td>
                  <Td>{t.district}</Td>
                </Tr>
              ))}
            </tbody>
          </TransactionTable>
        </TransactionSection>
      </Container>
    );
  }