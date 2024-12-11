export const transformToUppercase = (str: string) => {
  console.log('str', str);
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const transformToLowercase = (str: string) => {
  if (str.length === 0) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};
