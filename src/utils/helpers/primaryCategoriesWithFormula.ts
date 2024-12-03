type DBCategories = {
  id: number;
  category: string;
  amount: number;
};

type PredefinedCategories = {
  id: number;
  name: string;
  items: { name: string; amount: number }[];
  total_amount: number;
};

export const finalCalculation = (
  dbCategories: DBCategories[],
  predefinedCategories: PredefinedCategories[]
) => {
  return predefinedCategories.map((predefined: PredefinedCategories) => {
    const predefinedCategories = predefined.items.map(
      (item: { name: string; amount: number }) => {
        const matchedWithDbCategory = dbCategories.find(
          (dbCategory: DBCategories) => dbCategory.category === item.name
        );
        if (matchedWithDbCategory) {
          if (matchedWithDbCategory.category === 'Furniture and Equipment') {
            return {
              ...item,
              amount: item.amount - matchedWithDbCategory.amount || 0,
            };
          }
          if (matchedWithDbCategory.category === 'Computer Hardware') {
            return {
              ...item,
              amount: item.amount - matchedWithDbCategory.amount || 0,
            };
          }
          return {
            ...item,
            amount: matchedWithDbCategory.amount,
          };
        }
        return item;
      }
    );
    const total_amount = predefinedCategories.reduce(
      (acc: number, curr: { amount: number }) => acc + curr.amount,
      0
    );
    return {
      title: predefined.name,
      predefinedCategories,
      total_amount,
    };
  });
};
