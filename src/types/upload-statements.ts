export interface Column {
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
  Description?: string;
  Withdrawal?: string;
  Deposit?: string;
  Date?: string;
  [key: string]: string | undefined;
}
