export type ExpenseWithRulesType = {
  rule: string;
  expenses: any[]; // Replace 'any' with your specific expense type
  expensePayload: {
    category: string;
    expense_type?: string;
    rule?: unknown;
  };
};
