import { Column } from '@/types/upload-statements';
export const targetColumns: Column[] = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Withdrawal',
    dataIndex: 'withdrawal',
    key: 'withdrawal',
  },
  {
    title: 'Deposit',
    dataIndex: 'deposit',
    key: 'deposit',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
];
export const findBestMatch = (
  columnTitle: string,
  headers: Column[]
): string | undefined => {
  // Convert to lowercase for case-insensitive matching
  const targetTitle = columnTitle.toLowerCase();

  // First try exact match
  const exactMatch = headers.find(
    (header) => header.title.toLowerCase() === targetTitle
  );
  if (exactMatch) return exactMatch.title;

  // Then try partial match
  const partialMatch = headers.find((header) => {
    const headerLower = header.title.toLowerCase();
    return (
      headerLower.includes(targetTitle) || targetTitle.includes(headerLower)
    );
  });
  if (partialMatch) return partialMatch.title;

  // Common variations for date
  if (targetTitle === 'date') {
    const dateVariations = headers.find((header) => {
      const headerLower = header.title.toLowerCase();
      return (
        headerLower.includes('date') ||
        headerLower.includes('time') ||
        headerLower.includes('when') ||
        headerLower.includes('posted') ||
        headerLower.includes('transaction')
      );
    });
    if (dateVariations) return dateVariations.title;
  }

  // Common variations for description
  if (targetTitle === 'description') {
    const descVariations = headers.find((header) => {
      const headerLower = header.title.toLowerCase();
      return (
        headerLower.includes('desc') ||
        headerLower.includes('narration') ||
        headerLower.includes('details') ||
        headerLower.includes('transaction') ||
        headerLower.includes('particulars') ||
        headerLower.includes('remarks')
      );
    });
    if (descVariations) return descVariations.title;
  }

  // Common variations for withdrawal
  if (targetTitle === 'withdrawal') {
    const withdrawalVariations = headers.find((header) => {
      const headerLower = header.title.toLowerCase();
      return (
        headerLower.includes('withdrawal') ||
        headerLower.includes('debit') ||
        headerLower.includes('out') ||
        headerLower.includes('spent') ||
        (headerLower.includes('amount') && headerLower.includes('dr'))
      );
    });
    if (withdrawalVariations) return withdrawalVariations.title;
  }

  // Common variations for deposit
  if (targetTitle === 'deposit') {
    const depositVariations = headers.find((header) => {
      const headerLower = header.title.toLowerCase();
      return (
        headerLower.includes('deposit') ||
        headerLower.includes('credit') ||
        headerLower.includes('in') ||
        headerLower.includes('received') ||
        (headerLower.includes('amount') && headerLower.includes('cr'))
      );
    });
    if (depositVariations) return depositVariations.title;
  }

  return undefined;
};
