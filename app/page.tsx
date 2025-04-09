// app/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
`;

const SearchBox = styled.input`
  width: 300px;
  padding: 1rem;
  font-size: 1.2rem;
  border: 2px solid #eee;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const SearchButton = styled.button`
  padding: 1rem 2rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: #1d4ed8;
  }
`;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = async () => {
    setError(''); // Clear previous errors
    if (!searchTerm.trim()) {
      setError('Please enter a name');
      return;
    }

    try {
      const response = await fetch(`/api/agents/search?name=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      console.log(data);
      if (data.agent) {
        router.push(`/agent/${data.agent.salesperson_reg_num}`);
      } else {
        setError('Agent not found');
      }
    } catch (err) {
      setError('An error occurred while searching');
    }
  };

  return (
    <SearchContainer>
      <SearchBox
        type="text"
        placeholder="Enter salesperson name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <SearchButton onClick={handleSearch}>Search</SearchButton>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </SearchContainer>
  );
}