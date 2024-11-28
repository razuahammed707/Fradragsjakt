import { QuestionnaireItem } from '@/redux/slices/questionnaire';

const safeParseNumber = (value: string | undefined): number => {
  if (value === undefined) return 0;

  const parsedNum = parseFloat(value.replace(/,/g, ''));
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
) => {
  if (!hobbyOddjobsPayload || !hobbyOddjobsPayload.answers) return 0;

  const expenses = hobbyOddjobsPayload.answers.reduce((total, answer) => {
    const expenseKeys = [
      'I have a sole proprietorship',
      'Sell goods or services blog/influencer practise e-sports (gaming) breed animals on a small scale',
    ];

    expenseKeys.forEach((key) => {
      const expense = safeParseNumber(
        answer[key]?.[1]?.['proprietorship expense'] ||
          answer[key]?.[1]?.['Documented expense']
      );
      total += expense;
    });

    return total;
  }, 0);

  return expenses;
};

const housingAndPropertyExpenseCalculator = (
  housingAndPropertyPayload: QuestionnaireItem
) => {
  if (!housingAndPropertyPayload || !housingAndPropertyPayload.answers)
    return 0;

  const expenses = housingAndPropertyPayload.answers.reduce((total, answer) => {
    const expenseKeys = [
      'Housing in a housing association housing company or jointly owned property',
    ];

    expenseKeys.forEach((key) => {
      const expense = safeParseNumber(answer[key]?.[0]?.['Documented cost']);
      total += expense;
    });

    return total;
  }, 0);

  return expenses;
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

  // Rule: Return Donation Amount if > 500 NOK, max 25,000 NOK
  if (donationAmount > 500) {
    return Math.min(donationAmount, 25000);
  }

  return 0;
};

const foreignIncomeExpenseCalculator = (
  foreignIncomePayload: QuestionnaireItem
) => {
  if (!foreignIncomePayload || !foreignIncomePayload.answers) return 0;

  const foreignIncomeEntry =
    foreignIncomePayload.answers[0][
      'Have income or wealth in another country than Norway and pay tax in the other country'
    ];

  const foreignIncome = safeParseNumber(
    foreignIncomeEntry?.[0]?.['Foreign income']
  );
  const foreignTaxAmount = safeParseNumber(
    foreignIncomeEntry?.[0]?.['Foreign tax amount']
  );
  const norwayTaxRateString =
    foreignIncomeEntry?.[0]?.['Norway tax rate on this income'];

  const norwayTaxRate = norwayTaxRateString
    ? parseFloat(norwayTaxRateString.replace('%', '').trim()) / 100
    : 0;

  if (foreignIncome === 0) return 0;
  console.log({ foreignTaxAmount, norwayTaxRate, foreignIncome });

  return foreignTaxAmount * (norwayTaxRate / foreignIncome);
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
