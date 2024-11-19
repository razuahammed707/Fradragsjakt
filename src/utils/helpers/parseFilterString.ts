export const parseFilterString = (filterString?: string) => {
  if (!filterString) return {};

  return filterString
    .split('&')
    .reduce((acc: Record<string, unknown>, curr) => {
      const [key, value] = curr.split('=');
      if (key && value) {
        // Split the value by comma and trim each item
        const values = value.split(',').map((item) => {
          const trimmedValue = item.trim();
          // Capitalize first letter only for category field
          return key === 'category'
            ? trimmedValue.charAt(0).toUpperCase() +
                trimmedValue.slice(1).toLowerCase()
            : trimmedValue;
        });
        acc[key] = { $in: values };
      }
      return acc;
    }, {});
};
