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
  const targetTitle = columnTitle.toLowerCase();

  const exactMatch = headers.find(
    (header) => header.title.toLowerCase() === targetTitle
  );
  if (exactMatch) return exactMatch.title;

  const partialMatch = headers.find((header) => {
    const headerLower = header.title.toLowerCase();
    return (
      headerLower.includes(targetTitle) || targetTitle.includes(headerLower)
    );
  });
  if (partialMatch) return partialMatch.title;

  if (targetTitle === 'date') {
    const dateVariations = headers.find((header) => {
      const headerLower = header.title.toLowerCase();
      return (
        headerLower.includes('date') ||
        headerLower.includes('time') ||
        headerLower.includes('when') ||
        headerLower.includes('posted') ||
        headerLower.includes('dato')
      );
    });
    if (dateVariations) return dateVariations.title;
  }

  if (targetTitle === 'description') {
    const descVariations = headers.find((header) => {
      const headerLower = header.title.toLowerCase();
      return (
        headerLower.includes('desc') ||
        headerLower.includes('narration') ||
        headerLower.includes('details') ||
        headerLower.includes('transaction') ||
        headerLower.includes('particulars') ||
        headerLower.includes('remarks') ||
        headerLower.includes('forklaring')
      );
    });
    if (descVariations) return descVariations.title;
  }

  if (targetTitle === 'withdrawal') {
    const withdrawalVariations = headers.find((header) => {
      const headerLower = header.title.toLowerCase();
      return (
        headerLower.includes('withdrawal') ||
        headerLower.includes('debit') ||
        headerLower.includes('out') ||
        headerLower.includes('spent') ||
        headerLower.includes('ut fra konto') ||
        (headerLower.includes('amount') && headerLower.includes('dr'))
      );
    });
    if (withdrawalVariations) return withdrawalVariations.title;
  }

  if (targetTitle === 'deposit') {
    const depositVariations = headers.find((header) => {
      const headerLower = header.title.toLowerCase();

      return (
        headerLower.includes('deposit') ||
        headerLower.includes('credit') ||
        headerLower.includes('received') ||
        headerLower.includes('inn på konto') ||
        (headerLower.includes('amount') && headerLower.includes('cr'))
      );
    });
    if (depositVariations) return depositVariations.title;
  }

  return undefined;
};
