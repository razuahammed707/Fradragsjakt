import { QuestionnaireItem, SubAnswer } from '@/redux/slices/questionnaire';

const safeParseNumber = (value: string): number => {
  if (value === '') return 0;

  const parsedNum = parseFloat(value?.replace(/,/g, ''));
  return isNaN(parsedNum) ? 0 : parsedNum;
};

const healthAndFamilyExpenseCalculator = (
  healthAndFamilyPayload: QuestionnaireItem
) => {
  if (!healthAndFamilyPayload || !healthAndFamilyPayload.answers) return 0;

  const childCareExpenses = safeParseNumber(
    healthAndFamilyPayload.answers[0][
      'Have additional travel distance or expenses related to dropping off the child in a child day care centre or after-school supervision scheme'
    ]?.[0]?.['Documented expenses']
  );

  const specialCareExpenses = safeParseNumber(
    healthAndFamilyPayload.answers[1][
      'I have children aged 12 or older with special care needs'
    ]?.[1]?.['Documented care expenses']
  );

  return childCareExpenses + specialCareExpenses;
};

const workAndEducationExpenseCalculator = (
  workAndEducationPayload: QuestionnaireItem
) => {
  if (!workAndEducationPayload || !workAndEducationPayload.answers) return 0;

  const expenses = workAndEducationPayload.answers.reduce((total, answer) => {
    const expenseKeys = [
      'Moved for a new job',
      'I went to school last year',
      'Have a separate room in your house used only as your home office',
      'Disputation of a PhD',
      'I Stay away from home overnight because of work',
      'Have expenses for road toll or ferry when travelling between your home and workplace',
    ];

    expenseKeys.forEach((key) => {
      const expense = safeParseNumber(
        answer[key]?.[0]?.['Documented expenses'] ||
          answer[key]?.[0]?.[
            'Documented Education Expenses (if job-related)'
          ] ||
          answer[key]?.[0]?.['Operating Cost'] ||
          answer[key]?.[0]?.['Meals and accommodation cost'] ||
          answer[key]?.[0]?.[
            'Documented Costs for Thesis Printing Travel and Defense Ceremony'
          ]
      );
      total += expense;
    });

    return total;
  }, 0);

  return expenses;
};

const bankAndLoansExpenseCalculator = (
  bankAndLoansPayload: QuestionnaireItem
) => {
  if (!bankAndLoansPayload || !bankAndLoansPayload.answers) return 0;

  const expenses = bankAndLoansPayload.answers.reduce((total, answer) => {
    const expenseKeys = [
      'Have a loan',
      'Have taken out a joint loan with someone',
      'Have refinanced a loan in the last year',
    ];

    expenseKeys.forEach((key) => {
      const expense = safeParseNumber(
        answer[key]?.[0]?.['Total interest paid'] ||
          answer[key]?.[0]?.['Interest amount'] ||
          answer[key]?.[0]?.['Refinancing cost']
      );
      total += expense;
    });

    return total;
  }, 0);

  return expenses;
};

const hobbyOddjobsAndExtraIncomesExpenseCalculator = (
  hobbyOddjobsPayload: QuestionnaireItem
): number => {
  if (!hobbyOddjobsPayload?.answers) return 0;

  return hobbyOddjobsPayload.answers.reduce((total, answer) => {
    const [key, value] = Object.entries(answer)[0];

    const extractExpense = (field: string) =>
      safeParseNumber(
        value.find((item: SubAnswer) => field in item)?.[field] || ''
      ) || 0;

    switch (key) {
      case 'I have a sole proprietorship':
        return total + extractExpense('proprietorship expense');

      case 'Sell goods or services blog/influencer practise e-sports (gaming) breed animals on a small scale':
        return total + extractExpense('Documented expense');

      case 'I have received salary from odd jobs and services':
        const salary = extractExpense('Odd job income');
        return total + Math.min(salary, 6000);

      default:
        return total;
    }
  }, 0);
};

const housingAndPropertyExpenseCalculator = (
  housingAndPropertyPayload: QuestionnaireItem
) => {
  console.log({ housingAndPropertyPayload });

  if (!housingAndPropertyPayload?.answers) return 0;

  return housingAndPropertyPayload.answers.reduce((total, answer) => {
    const [key, value] = Object.entries(answer)[0];

    const extractExpense = (field: string) =>
      safeParseNumber(
        value.find((item: SubAnswer) => field in item)?.[field] || ''
      ) || 0;

    switch (key) {
      case 'Housing in a housing association housing company or jointly owned property':
        return total + extractExpense('Documented cost');

      case 'I have rented out a residential property or a holiday home':
        return total + extractExpense('Expense');

      case 'Sold a residential property or holiday home profit or loss':
        // const isCapitalGain = extractExpense(
        //   'Was the property your primary residence for at least 12 of the last 24 months'
        // );
        const CapitatGainOrLoss = extractExpense('Odd job income');
        return total + CapitatGainOrLoss;

      default:
        return total;
    }
  }, 0);
};

const giftsOrDonationsExpenseCalculator = (
  giftsOrDonationsPayload: QuestionnaireItem
) => {
  if (!giftsOrDonationsPayload || !giftsOrDonationsPayload.answers) return 0;

  const donationAmount = safeParseNumber(
    giftsOrDonationsPayload.answers[0][
      'Gifts to voluntary organisations'
    ]?.[0]?.['Donation Amount']
  );

  if (donationAmount >= 500) {
    return Math.min(donationAmount, 25000);
  }

  return 0;
};

const foreignIncomeExpenseCalculator = (
  foreignIncomePayload: QuestionnaireItem
): number => {
  if (!foreignIncomePayload?.answers?.length) return 0;

  const foreignIncomeEntry =
    foreignIncomePayload.answers[0][
      'Have income or wealth in another country than Norway and pay tax in the other country'
    ];

  if (!foreignIncomeEntry) return 0;

  const extractValue = (field: string) =>
    safeParseNumber(
      foreignIncomeEntry.find(
        (item: Record<string, string>) => field in item
      )?.[field] || ''
    ) || 0;

  const foreignIncome = extractValue('Foreign income');
  if (foreignIncome === 0) return 0;

  const foreignTaxAmount = extractValue('Foreign tax amount');
  const norwayTaxRate = extractValue('Norway tax rate on this income');

  return foreignTaxAmount * (norwayTaxRate / 100);
};

export const savingExpenseCalculator = (payload: QuestionnaireItem[]) => {
  const {
    'Health and Family': healthAndFamilyPayload = null,
    'Work and Education': workAndEducationPayload = null,
    'Bank and Loans': bankAndLoansPayload = null,
    'Hobby, Odd Jobs, and Extra Incomes': hobbyOddjobsPayload = null,
    'Housing and Property': housingAndPropertyPayload = null,
    'Gifts/Donations': giftsOrDonationsPayload = null,
    'Foreign Income': foreignIncomePayload = null,
  } = payload.reduce(
    (acc, item) => {
      acc[item.question] = item;
      return acc;
    },
    {} as Record<string, QuestionnaireItem | null>
  );

  const healthAndFamilyExpenseAmount = healthAndFamilyPayload
    ? healthAndFamilyExpenseCalculator(healthAndFamilyPayload)
    : 0;
  const workAndEducationExpenseAmount = workAndEducationPayload
    ? workAndEducationExpenseCalculator(workAndEducationPayload)
    : 0;
  const bankAndLoansExpenseAmount = bankAndLoansPayload
    ? bankAndLoansExpenseCalculator(bankAndLoansPayload)
    : 0;
  const hobbyOddjobsAndExtraIncomesExpenseAmount = hobbyOddjobsPayload
    ? hobbyOddjobsAndExtraIncomesExpenseCalculator(hobbyOddjobsPayload)
    : 0;
  const housingAndPropertyExpenseAmount = housingAndPropertyPayload
    ? housingAndPropertyExpenseCalculator(housingAndPropertyPayload)
    : 0;
  const giftsOrDonationsExpenseAmount = giftsOrDonationsPayload
    ? giftsOrDonationsExpenseCalculator(giftsOrDonationsPayload)
    : 0;
  const foreignIncomeExpenseAmount = foreignIncomePayload
    ? foreignIncomeExpenseCalculator(foreignIncomePayload)
    : 0;

  return {
    workAndEducationExpenseAmount,
    healthAndFamilyExpenseAmount,
    bankAndLoansExpenseAmount,
    hobbyOddjobsAndExtraIncomesExpenseAmount,
    housingAndPropertyExpenseAmount,
    giftsOrDonationsExpenseAmount,
    foreignIncomeExpenseAmount,
  };
};
