import * as XLSX from 'xlsx';

export const processExcelFile = (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    const handleWorkbook = (data: string | ArrayBuffer) => {
      const workbook = XLSX.read(data, { type: 'binary' });
      return workbook;
    };

    const getWorksheet = (workbook: XLSX.WorkBook) => {
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      return worksheet;
    };

    const convertToJson = (worksheet: XLSX.WorkSheet): string[][] => {
      // Get the range of the sheet
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
            const cellValue = cell.v;
            if (typeof cellValue === 'number' && isDateSerial(cellValue)) {
              row.push(formatExcelDate(cellValue)); // Format as a date if necessary
            } else {
              row.push(String(cellValue)); // Convert everything to strings for consistency
            }
          } else {
            row.push(''); // Explicitly add an empty string for missing cells
          }
        }
        rows.push(row);
      }

      return rows;
    };

    const isDateSerial = (value: number): boolean => {
      return value > 25569 && value < 2958465;
    };

    const formatExcelDate = (value: number): string => {
      const epoch = new Date(1899, 11, 30);
      return new Date(epoch.getTime() + value * 86400000)
        .toISOString()
        .split('T')[0];
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

        const data = text
          .split('\n')
          .map((line) =>
            line
              .split(delimiter)
              .map((value) => value.trim().replace(/^"|"$/g, ''))
          );

        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

export const processTxtFile = (file: File): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;

        const data = text
          .split('\n')
          .map((line) =>
            line
              .trim()
              .split(/\s+/)
              .filter((cell) => cell.length > 0)
          )
          .filter((row) => row.length > 0);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);

    reader.readAsText(file);
  });
};
