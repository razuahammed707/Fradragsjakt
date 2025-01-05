export function numberFormatter(input: number) {
  const inputStr = input.toString();
  const sanitizedInput = inputStr.replace(/[^\d.]/g, '');
  const number = Number(sanitizedInput);
  return new Intl.NumberFormat('no-NO').format(number);
}
