cat > prisma/migrations/001_create_transactions.sql << "EOF"
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    salesperson_name VARCHAR(255),
    transaction_date DATE,
    salesperson_reg_num VARCHAR(50),
    property_type VARCHAR(100),
    transaction_type VARCHAR(100),
    represented VARCHAR(100),
    town VARCHAR(100),
    district VARCHAR(100),
    general_location VARCHAR(255)
);
EOF