export const getStepDynamicTitle = (
  baseTitle: string,
  selectedOptions: string[]
) => {
  console.log('getDynamicTitle called with:', { baseTitle, selectedOptions });

  const businessTypes = ['freelance', 'business', 'organization'];
  const selectedBusinessTypes = selectedOptions.filter((opt) =>
    businessTypes.includes(opt)
  );

  console.log('Selected business types:', selectedBusinessTypes);

  if (selectedBusinessTypes.length === 0) {
    console.log('No business types selected, returning base title');
    return baseTitle;
  }

  const titles = {
    freelance: 'as a freelancer',
    business: 'as a business owner',
    organization: 'for your organization',
  };

  const selectedTitles = selectedBusinessTypes.map(
    (type) => titles[type as keyof typeof titles]
  );
  console.log('Selected titles:', selectedTitles);

  let result;
  if (selectedTitles.length === 1) {
    result = `${baseTitle} ${selectedTitles[0]}`;
  } else if (selectedTitles.length === 2) {
    result = `${baseTitle} ${selectedTitles[0]} and ${selectedTitles[1]}`;
  } else {
    const lastTitle = selectedTitles.pop();
    result = `${baseTitle} ${selectedTitles.join(', ')}, and ${lastTitle}`;
  }

  console.log('Final title:', result);
  return result;
};
