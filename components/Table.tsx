// components/Table.tsx
import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin: 2rem 0;

  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
  }
`;

export const Th = styled.th`
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #1e293b;
  border-bottom: 2px solid #e2e8f0;
`;

export const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
`;

export const Tr = styled.tr`
  &:hover {
    background: #f8fafc;
  }
`;