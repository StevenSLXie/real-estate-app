// app/api/property-request/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import Configuration, { OpenAI } from 'openai';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DATABASE,
});

const openai = new OpenAI(
);

export async function POST(request: Request) {
    try {
      const { request: userRequest } = await request.json();
  
      // Use OpenAI to generate SQL
      const prompt = `
        You are a SQL expert. Convert the following natural language request into a postgresql SQL query:
        Request: "${userRequest}"
        Database Schema with their ENUM values:
        - Table: transactions
          Columns: salesperson_name, 
                   salesperson_reg_num, transaction_type ('NEW SALE', 'RESALE', 'ROOM RENTAL', 'SUB-SALE', 'WHOLE RENTAL'), 
                   property_type (CONDOMINIUM_APARTMENTS, EXECUTIVE_CONDOMINIUM, LANDED, STRATA_LANDED, HDB), 
                   represented (BUYER, SELLER, TENANT, LANDLORD),
                   general_location (for non-HDB only, apply enum value filtering as further notes below), 
                   town (for HDB only, apply enum value filtering as further notes below),
                   transaction_date
        - Requirement: 1) check transactions of last 2 years only; 
                        2) return list of agents name, num, their transaction_count ranked by transaction_count DESC; 
                        3) only return the SQL, not special chars, not explanation;
                        4) for rental, only when room is explicitly mentioned, use ROOM RENTAL, otherwise use WHOLE RENTAL;
                        5) for sale, only when new sale is explicitly mentioned, use NEW SALE, otherwise use RESALE;
                        6) if no location info is mentioned, do filter general_location or town;
                        7 ) for HDB, the col town only has the following: JURONG EAST, CLEMENTI, GEYLANG, PASIR RIS, SERANGOON
                        ,BUKIT PANJANG,SEMBAWANG,ANG MO KIO,YISHUN,QUEENSTOWN
                        ,SENGKANG,JURONG WEST,TENGAH,BEDOK
                        ,TOA PAYOH,WOODLANDS,BUKIT TIMAH,BISHAN,TAMPINES
                        ,HOUGANG,CENTRAL AREA,BUKIT BATOK
                        ,PUNGGOL,QUEESTOWN,MARINE PARADE
                        ,KALLANG/WHAMPOA,CHOA CHU KANG,BUKIT MERAH; use your geo knowledge to map user requested area to 1 or 2 of these if and only if location info is mentioned;
                        8) for condo, col general_loication only has the followng; one line, one enum value:
                        Katong/ Joo Chiat/ Amber Road
                        Balestier/ Toa Payoh/ Serangoon
                        Little India
                        Seletar
                        Kranji/ Woodgrove
                        Queenstown/ Tiong Bahru
                        Raffles Place/ Cecil/ Marina/ People's Park
                        Pasir Panjang/ Hong Leong Garden/ Clementi New Town
                        Anson/ Tanjong Pagar
                        Watten Estate/ Novena/ Thomson
                        Lim Chu Kang/ Tengah
                        Bedok/ Upper East Coast/ Eastwood/ Kew Drive
                        Middle Road/ Golden Mile
                        Bishan/ Ang Mo Kio
                        Yishun/ Sembawang
                        Tampines/ Pasir Ris
                        High Street/ Beach Road (part)
                        Geylang/ Eunos
                        Telok Blangah/ Harbourfront
                        Loyang/ Changi
                        Upper Bukit Timah/ Clementi Park/ Ulu Pandan
                        Upper Thomson/ Springleaf
                        Jurong
                        Ardmore/ Bukit Timah/ Holland Road/ Tanglin
                        Hillview/ Dairy Farm/ Bukit Panjang/ Choa Chu Kang
                        Macpherson/ Braddell
                        Serangoon Garden/ Hougang/ Punggol
                        Orchard/ Cairnhill/ River Valley
                        use you geo knowledge to match user request to 1 or 2 of these enum value if and only if location info is mentioned;
                        9) apply escape to SQL if there is special char. single quotes (') inside a string must be escaped by doubling them ('').;    
                        10) limit to 10 results;
        SQL Query:
      `;
  
      const response = await openai.chat.completions.create({
        messages: [{ role: "developer", content: prompt }],
        model: "gpt-4o-mini",
      });
  
    const sqlQuery = response.choices[0].message.content?.trim() || '';
    let cleanedSqlQuery = '';
    const selectIndex = sqlQuery?.toUpperCase().indexOf('SELECT');
    const semicolonIndex = sqlQuery?.indexOf(';');

    if (selectIndex !== -1 && semicolonIndex !== -1) {
    cleanedSqlQuery = sqlQuery.slice(selectIndex, semicolonIndex + 1).trim();
    }
    console.log('Generated SQL Query:', cleanedSqlQuery);
  
      if (!cleanedSqlQuery) {
        return NextResponse.json({ error: 'Failed to generate SQL query.' }, { status: 500 });
      }

  
    //   // Test the SQL query
    //   const isValid = await testSQLQuery(sqlQuery);
    //   if (!isValid) {
    //     return NextResponse.json({ error: 'SQL query failed validation.' }, { status: 400 });
    //   }
  
      // Execute the SQL query
      const result = await pool.query(cleanedSqlQuery);
      if (result.rows.length === 0) {
        return NextResponse.json({
          message: 'No matching agents found. Please simplify your request and be more concise.',
          agents: [],
        });
      }
      
      return NextResponse.json({ 
        agents: result.rows, sqlQuery: cleanedSqlQuery,});
    } catch (error) {
      console.error('Error processing property request:', error);
      return NextResponse.json({ error: 'Failed to process property request.' }, { status: 500 });
    }
  }