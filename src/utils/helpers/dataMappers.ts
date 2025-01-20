import {
  Column,
  ExpenseData,
  FileRowData,
  FormData,
} from '@/types/upload-statements';
import moment from 'moment';

interface ParsedFileResult {
  fileData: FileRowData[];
  headers: Column[];
}
export const parseFileData = (data: string[][]): ParsedFileResult => {
  const headers: Column[] = data[0].map((header, index) => ({
    title: header,
    dataIndex: `column_${index}`,
    key: `column_${index}`,
  }));

  const parsedData: FileRowData[] = data
    .slice(1)
    .filter((row) => row.some((cell) => cell && cell.trim() !== ''))
    .map((row, rowIndex) => {
      const cleanedRow = [];
      let tempValue = '';

      for (let i = 0; i < row.length; i++) {
        const cell = row[i].trim();

        if (cell.startsWith('"') && !cell.endsWith('"')) {
          tempValue = cell;
        } else if (!cell.startsWith('"') && cell.endsWith('"') && tempValue) {
          tempValue += `,${cell}`;
          cleanedRow.push(tempValue.replace(/["']/g, ''));
          tempValue = '';
        } else if (tempValue) {
          tempValue += `,${cell}`;
        } else {
          cleanedRow.push(cell.replace(/,/g, ''));
        }
      }

      const processedRow = cleanedRow.reduce(
        (acc: FileRowData, val: string, colIndex: number) => {
          if (val && val.trim() !== '') {
            acc[`column_${colIndex}`] = val.trim();
          }
          return acc;
        },
        { key: `row_${rowIndex}` }
      );

      return Object.keys(processedRow).length > 1 ? processedRow : null;
    })
    .filter((row): row is FileRowData => row !== null);
  return {
    fileData: parsedData,
    headers: headers,
  };
};
export const mapToExpenseData = (
  formData: FormData,
  fileData: FileRowData[],
  headers: Column[]
): ExpenseData[] => {
  return fileData
    ?.map((row) => {
      const descriptionColumnIndex = headers.findIndex(
        (col) => col.title === formData.Description
      );
      const withdrawalColumnIndex = headers.findIndex(
        (col) => col.title === formData.Withdrawal
      );
      const depositColumnIndex = headers.findIndex(
        (col) => col.title === formData.Deposit
      );
      const dateColumnIndex = headers.findIndex(
        (col) => col.title === formData.Date
      );

      const description = row[`column_${descriptionColumnIndex}`];
      const withdrawal = row[`column_${withdrawalColumnIndex}`];
      const deposit = row[`column_${depositColumnIndex}`];
      const date = row[`column_${dateColumnIndex}`];

      if (description && (withdrawal || deposit)) {
        const parsedWithdrawal = parseFloat(
          withdrawal?.replace(/[^\d.-]/g, '') || '0'
        );
        const parsedDeposit = parseFloat(
          deposit?.replace(/[^\d.-]/g, '') || '0'
        );

        if (!isNaN(parsedWithdrawal) || !isNaN(parsedDeposit)) {
          // Try parsing the date with multiple formats
          const parsedDate = moment(
            date,
            [
              'MM/DD/YYYY',
              'DD/MM/YYYY',
              'YYYY-MM-DD',
              'DD-MM-YYYY',
              'MM-DD-YYYY',
              'YYYY/MM/DD',
              'DD.MM.YYYY',
              'MM.DD.YYYY',
              'YYYY.MM.DD',
              'M/D/YYYY',
              'D/M/YYYY',
              'MM/D/YYYY',
              'M/DD/YYYY',
              moment.ISO_8601,
              'MMMM DD, YYYY',
              'DD MMMM YYYY',
              'MMM DD, YYYY',
              'DD MMM YYYY',
            ],
            true
          );

          const finalDate = parsedDate.isValid()
            ? parsedDate.toDate()
            : moment(date, moment.ISO_8601).toDate();

          const payload = {
            description: description.trim(),
            withdrawal: parsedWithdrawal || 0,
            deposit: parsedDeposit || 0,
            transaction_date: finalDate,
          };
          return payload;
        }
      }
      return null;
    })
    .filter((item): item is ExpenseData => item !== null);
};
