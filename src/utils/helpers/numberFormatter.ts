export function numberFormatter(input: number) {
  const inputStr = input.toString();
  const digitsOnly = inputStr.replace(/[^\d]/g, '');
  const number = Number(digitsOnly || 0);
  return new Intl.NumberFormat('no-NO').format(number);
}
