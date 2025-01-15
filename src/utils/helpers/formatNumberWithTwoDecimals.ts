export function formatNumberWithTwoDecimals(
  input: number | null | undefined | string
) {
  if (input === null || input === undefined || input === '') {
    return '';
  }

  const inputStr = input.toString();

  if (inputStr === ',' || inputStr === '.') {
    return inputStr;
  }

  const normalizedInput = inputStr.replace('.', ',');

  const parts = normalizedInput.split(',');
  const integerPart = parts[0].replace(/[^\d]/g, '');
  const decimalPart = parts[1]?.replace(/[^\d]/g, '').slice(0, 2);

  if (!integerPart && !decimalPart) {
    return '';
  }

  const formattedInteger = integerPart
    ? new Intl.NumberFormat('no-NO').format(parseInt(integerPart, 10))
    : '0';

  if (decimalPart || normalizedInput.endsWith(',')) {
    return `${formattedInteger}${decimalPart ? ',' + decimalPart : ','}`;
  }

  return formattedInteger;
}
