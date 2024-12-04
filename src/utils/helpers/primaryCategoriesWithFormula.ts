type DBCategories = {
  id: number;
  category: string;
  amount: number;
};

type PredefinedCategories = {
  id: number;
  name: string;
  items: { name: string; amount: number; original_amount: number }[];
  total_amount: number;
  total_original_amount: number;
};

export const finalCalculation = (
  dbCategories: DBCategories[],

  predefinedCategories: PredefinedCategories[]
) => {
  console.log({ dbCategories });

  return predefinedCategories.map((predefined: PredefinedCategories) => {
    const predefinedCategories = predefined.items.map(
      (item: { name: string; amount: number; original_amount: number }) => {
        const matchedWithDbCategory = dbCategories?.find(
          (dbCategory: DBCategories) => dbCategory.category === item.name
        );
        if (matchedWithDbCategory) {
          if (
            ['Furniture and Equipment', 'Computer Hardware'].includes(
              matchedWithDbCategory.category
            )
          ) {
            return {
              ...item,
              amount: item.amount - matchedWithDbCategory.amount,
              original_amount: matchedWithDbCategory.amount,
            };
          }
          return {
            ...item,
            amount: matchedWithDbCategory.amount,
            original_amount: matchedWithDbCategory.amount,
          };
        }
        return item;
      }
    );
    const total_amount = Number(
      predefinedCategories
        .reduce((acc: number, curr: { amount: number }) => acc + curr.amount, 0)
        .toFixed(2)
    );

    const total_original_amount = predefinedCategories.reduce(
      (acc: number, curr: { original_amount: number }) =>
        acc + curr.original_amount,
      0
    );
    console.log({ predefinedCategories });

    return {
      title: predefined.name,
      predefinedCategories,
      total_amount,
      total_original_amount,
    };
  });
};
