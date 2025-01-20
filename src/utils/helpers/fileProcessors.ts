import * as XLSX from 'xlsx';

export const processExcelFile = (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    const handleWorkbook = (data: string | ArrayBuffer) => {
      const workbook = XLSX.read(data, {
        type: 'binary',
        cellDates: true,
        cellNF: true,
        cellText: false,
      });
      return workbook;
    };

    const getWorksheet = (workbook: XLSX.WorkBook) => {
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      return worksheet;
    };

    const formatValue = (value: any, cell: XLSX.CellObject): string => {
      if (value === undefined || value === null) {
        return '';
      }

      if (
        cell.t === 'd' ||
        (typeof value === 'number' && isDateSerial(value))
      ) {
        if (value instanceof Date) {
          return formatDate(value);
        }
        if (typeof value === 'number') {
          return formatExcelDate(value);
        }
      }

      if (typeof value === 'number') {
        const format = cell.z;
        if (format) {
          if (String(format).includes(',')) {
            return value.toLocaleString('en-US', {
              minimumFractionDigits: countDecimals(value),
              maximumFractionDigits: countDecimals(value),
            });
          }
        }
        return String(value);
      }

      return String(value);
    };

    const convertToJson = (worksheet: XLSX.WorkSheet): string[][] => {
      const range = XLSX.utils.decode_range(worksheet['!ref']!);

      const rows: string[][] = [];
      for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex++) {
        const row: string[] = [];
        for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
          const cellAddress = XLSX.utils.encode_cell({
            r: rowIndex,
            c: colIndex,
          });
          const cell = worksheet[cellAddress];
          if (cell) {
            row.push(formatValue(cell.v, cell));
          } else {
            row.push('');
          }
        }
        rows.push(row);
      }

      return rows;
    };

    const isDateSerial = (value: number): boolean => {
      return value >= 25569 && value <= 47483;
    };

    const formatExcelDate = (value: number): string => {
      const date = new Date((value - 25569) * 86400 * 1000);
      return formatDate(date);
    };

    const formatDate = (date: Date): string => {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    };

    const countDecimals = (value: number): number => {
      if (Math.floor(value) === value) return 0;
      return value.toString().split('.')[1]?.length || 0;
    };

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        if (!e.target?.result) {
          throw new Error('Failed to read file');
        }

        const workbook = handleWorkbook(e.target.result);
        const worksheet = getWorksheet(workbook);
        const jsonData = convertToJson(worksheet);

        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

export const processCsvFile = (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const firstLine = text.split('\n')[0];
        const delimiter = firstLine.includes(';') ? ';' : ',';

        const data = text.split('\n').map((line) => {
          const values: string[] = [];
          let currentValue = '';
          let insideQuotes = false;

          for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
              insideQuotes = !insideQuotes;
            } else if (char === delimiter && !insideQuotes) {
              values.push(currentValue.trim().replace(/^"|"$/g, ''));
              currentValue = '';
            } else {
              currentValue += char;
            }
          }
          values.push(currentValue.trim().replace(/^"|"$/g, ''));
          return values;
        });

        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};
