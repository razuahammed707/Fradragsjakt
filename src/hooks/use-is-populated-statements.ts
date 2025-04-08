import { trpc } from '@/utils/trpc';

const useIsStatementsPopulated = () => {
  const { data: incomesResponse, isLoading: isIncomeLoading } =
    trpc.incomes.getIncomes.useQuery({
      page: 1,
      limit: 5,
    });

  const { data: expenseResponse, isLoading: isExpenseLoading } =
    trpc.expenses.getExpenses.useQuery({
      category: null, // Add the required category parameter
      page: 1,
      limit: 5,
    });

  const hasIncomes = (incomesResponse?.data?.length ?? 0) > 0;
  const hasExpenses = (expenseResponse?.data?.length ?? 0) > 0;

  const isLoading = isIncomeLoading || isExpenseLoading;
  const isStatementsPopulated = hasIncomes || hasExpenses;

  return {
    isLoading,
    isStatementsPopulated,
  };
};

export default useIsStatementsPopulated;
