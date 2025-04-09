-- queries/agent-stats.sql
-- Recent transactions (2 years)
SELECT 
  COUNT(*) as total_transactions
FROM transactions
WHERE 
  salesperson_name = $1
  AND transaction_date >= NOW() - INTERVAL '2 years';

-- By property type
SELECT 
  property_type,
  COUNT(*) as count
FROM transactions
WHERE 
  salesperson_name = $1
  AND transaction_date >= NOW() - INTERVAL '2 years'
GROUP BY property_type;

-- By transaction type
SELECT 
  transaction_type,
  COUNT(*) as count
FROM transactions
WHERE 
  salesperson_name = $1
  AND transaction_date >= NOW() - INTERVAL '2 years'
GROUP BY transaction_type;