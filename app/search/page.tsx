// app/search/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';

const ResultsContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const AgentCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

export default function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState({ agents: [], pagination: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const response = await fetch(
        `/api/agents/search?${searchParams.toString()}`
      );
      const data = await response.json();
      setResults(data);
      setLoading(false);
    };
    fetchResults();
  }, [searchParams]);

  return (
    <ResultsContainer>
      <h1>Search Results</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {results.agents.map(agent => (
            <AgentCard
              key={agent.salesperson_reg_num}
              onClick={() => router.push(`/agent/${agent.salesperson_reg_num}`)}
            >
              <h3>{agent.salesperson_name}</h3>
              <p>Total Transactions: {agent.total_transactions}</p>
            </AgentCard>
          ))}
          <Pagination>
            {Array.from({ length: results.pagination.pages }, (_, i) => (
              <button
                key={i}
                onClick={() => router.push(`/search?${new URLSearchParams({
                  ...Object.fromEntries(searchParams),
                  page: (i + 1).toString()
                })}`)}
              >
                {i + 1}
              </button>
            ))}
          </Pagination>
        </>
      )}
    </ResultsContainer>
  );
}