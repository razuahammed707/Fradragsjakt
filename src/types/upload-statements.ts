export interface Column {
  id: any;
  title: string;
  dataIndex: string;
  key: string;
}

export interface FileRowData {
  key: string;
  [key: string]: string;
}

export interface ExpenseData {
  description: string;
  withdrawal: number;
  deposit: number;
  transaction_date: Date;
}

export interface FormData {
  description: any;
  amount: any;
  Description: string;
  Withdrawal: string;
  Deposit: string;
  Date?: string;
}
