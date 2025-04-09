// scripts/import-data.js
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
    user: 'steven',
    password: 'steven_1234',
    host: 'localhost',
    port: 5432,
    database: 'real_estate'
  });

async function importTransactions() {
  const csvPath = path.join(process.cwd(), 'data', 'cea_person_9Apr2025.csv');
  
  const parser = fs.createReadStream(csvPath).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true
    })
  );

  try {
    for await (const record of parser) {
      await pool.query(
        `INSERT INTO transactions (
          salesperson_name, 
          transaction_date, 
          salesperson_reg_num,
          property_type, 
          transaction_type, 
          represented,
          town, 
          district, 
          general_location
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          record.salesperson_name,
          new Date(record.transaction_date),
          record.salesperson_reg_num,
          record.property_type,
          record.transaction_type,
          record.represented,
          record.town,
          record.district,
          record.general_location
        ]
      );
    }
    console.log('Data import completed');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

importTransactions();