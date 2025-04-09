// types/transaction.ts
export interface Transaction {
    id: number;
    salesperson_name: string;
    transaction_date: Date;
    salesperson_reg_num: string;
    property_type: string;
    transaction_type: string;
    represented: string;
    town: string;
    district: string;
    general_location: string;
  }
  
  export interface AgentStats {
    totalTransactions: number;
    byPropertyType: {
      type: string;
      count: number;
    }[];
    byTransactionType: {
      type: string;
      count: number;
    }[];
  }