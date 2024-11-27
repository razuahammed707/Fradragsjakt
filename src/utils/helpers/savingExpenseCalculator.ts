// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { QuestionnaireItem } from '@/redux/slices/questionnaire';

// Utility function to safely parse numeric values
const safeParseNumber = (value: string | undefined): number => {
  if (value === undefined) return 0;

  const parsedNum = parseFloat(value.replace(/,/g, ''));
  return isNaN(parsedNum) ? 0 : parsedNum;
};

const healthAndFamilyExpenseCalculator = () => {
  return 0;
};

const WorkAndEducationExpenseCalculator = () => {
  return 0;
};

const BankAndLoansExpenseCalculator = () => {
  return 0;
};

const HobbyOddjobsAndExtraIncomesExpenseCalculator = () => {
  return 0;
};

const HousingAndPropertyExpenseCalculator = () => {
  return 0;
};

const GiftsOrDonationsExpenseCalculator = (payload: QuestionnaireItem[]) => {
  // Find the Gifts/Donations section
  const donationsSection = payload.find(
    (item) => item.question === 'Gifts/Donations'
  );

  if (
    !donationsSection ||
    !donationsSection.answers ||
    donationsSection.answers.length === 0
  ) {
    return 0;
  }

  // Get the first entry in the donations section
  const donationEntry = donationsSection.answers[0];

  // Extract donation amount
  const donationAmount = safeParseNumber(
    donationEntry['Gifts to voluntary organisations']?.[0]?.['Donation Amount']
  );

  // Rule: Return Donation Amount if > 500 NOK, max 25,000 NOK
  if (donationAmount > 500) {
    return Math.min(donationAmount, 25000);
  }

  return 0;
};

const ForeignIncomeExpenseCalculator = (payload: QuestionnaireItem[]) => {
  // Find the Foreign Income section
  const foreignIncomeSection = payload.find(
    (item) => item.question === 'Foreign Income'
  );

  if (
    !foreignIncomeSection ||
    !foreignIncomeSection.answers ||
    foreignIncomeSection.answers.length === 0
  ) {
    return 0;
  }

  // Get the first entry in the foreign income section
  const foreignIncomeEntry = foreignIncomeSection.answers[0];

  // Extract required values
  const foreignIncome = safeParseNumber(
    foreignIncomeEntry[
      'Have income or wealth in another country than Norway and pay tax in the other country'
    ]?.[0]?.['Foreign income']
  );
  const foreignTaxAmount = safeParseNumber(
    foreignIncomeEntry[
      'Have income or wealth in another country than Norway and pay tax in the other country'
    ]?.[0]?.['Foreign tax amount']
  );
  const norwayTaxRateString =
    foreignIncomeEntry[
      'Have income or wealth in another country than Norway and pay tax in the other country'
    ]?.[0]?.['Norway tax rate on this income'];

  // Handle norwayTaxRate in percentage format
  const norwayTaxRate = norwayTaxRateString
    ? parseFloat(norwayTaxRateString.replace('%', '').trim()) / 100
    : 0;

  // Rule: Foreign tax amount × (Norway tax rate on this income / Foreign income)
  if (foreignIncome === 0) return 0;

  return foreignTaxAmount * (norwayTaxRate / foreignIncome);
};

export const savingExpenseCalculator = (payload: QuestionnaireItem[]) => {
  console.log({ payload });

  const healthAndFamilyExpenseAmount = healthAndFamilyExpenseCalculator();
  const WorkAndEducationExpenseAmount = WorkAndEducationExpenseCalculator();
  const BankAndLoansExpenseAmount = BankAndLoansExpenseCalculator();
  const HobbyOddjobsAndExtraIncomesExpenseAmount =
    HobbyOddjobsAndExtraIncomesExpenseCalculator();
  const HousingAndPropertyExpenseAmount = HousingAndPropertyExpenseCalculator();
  const GiftsOrDonationsExpenseAmount =
    GiftsOrDonationsExpenseCalculator(payload);
  const ForeignIncomeExpenseAmount = ForeignIncomeExpenseCalculator(payload);

  return {
    WorkAndEducationExpenseAmount,
    healthAndFamilyExpenseAmount,
    BankAndLoansExpenseAmount,
    HobbyOddjobsAndExtraIncomesExpenseAmount,
    HousingAndPropertyExpenseAmount,
    GiftsOrDonationsExpenseAmount,
    ForeignIncomeExpenseAmount,
  };
};
