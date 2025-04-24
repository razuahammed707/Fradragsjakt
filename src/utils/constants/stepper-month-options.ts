type DateOption = {
  title: string;
  value: string;
};

export const getDateOptions = (): DateOption[] => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const options: DateOption[] = [];

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  for (let i = 0; i < 12; i++) {
    const monthNum = String(i + 1).padStart(2, '0');
    options.push({
      title: `${currentYear} - ${months[i]}`,
      value: `${currentYear}-${monthNum}`,
    });
  }

  options.push({
    title: `Before ${previousYear}`,
    value: `before-${previousYear}`,
  });

  return options;
};
export const defaultMonthValue = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
