export const getStepDynamicTitle = (
  baseTitle: string,
  selectedOptions: string[]
) => {
  const businessTypes = ['freelance', 'business', 'organization'];
  const selectedBusinessTypes = selectedOptions.filter((opt) =>
    businessTypes.includes(opt)
  );

  if (selectedBusinessTypes.length === 0) {
    console.log('No business types selected, returning base title');
    return baseTitle;
  }

  const titles = {
    freelance:
      baseTitle === 'What do you do for' ||
      baseTitle === 'Do you go out to eat with' ||
      baseTitle === 'Do you have a home workspace for'
        ? 'freelancing'
        : 'freelancer',
    business:
      baseTitle === 'What do you do for' ||
      baseTitle === 'Do you go out to eat with' ||
      baseTitle === 'Do you have a home workspace for'
        ? 'business'
        : 'business owner',
    organization: 'organization',
  };

  const selectedTitles = selectedBusinessTypes.map(
    (type) => titles[type as keyof typeof titles]
  );

  let result;
  if (selectedTitles.length === 1) {
    result = `${baseTitle} ${selectedTitles[0]}${baseTitle === 'Do you go out to eat with' ? ' needs' : ''}?`;
  } else if (selectedTitles.length === 2) {
    result = `${baseTitle} ${selectedTitles[0]} / ${selectedTitles[1]}${baseTitle === 'Do you go out to eat with' ? ' needs' : ''}?`;
  } else {
    const lastTitle = selectedTitles.pop();
    result = `${baseTitle} ${selectedTitles.join(' / ')} / ${lastTitle}${baseTitle === 'Do you go out to eat with' ? ' needs' : ''}?`;
  }

  return result;
};
