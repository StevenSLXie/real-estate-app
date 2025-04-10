// app/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f8fafc;
`;

const SearchBox = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #1e293b;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Button = styled.button`
  background: #000000;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #333333; /* Slightly lighter black for hover */
  }

  &:active {
    background: #1a1a1a; /* Darker black for active state */
    transform: scale(0.98); /* Slightly shrink on click */
  }

  &:disabled {
    background: #cccccc; /* Gray for disabled state */
    cursor: not-allowed;
  }
`;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    router.push(`/search?name=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <Container>
      <SearchBox>
        <Title>Find Real Estate Agent</Title>
        <Input
          type="text"
          placeholder="Enter agent name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </SearchBox>
    </Container>
  );
}