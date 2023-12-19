export const nationAsset = (nationTypeId: string): string => {
  switch (nationTypeId) {
    case 'usa':
      return 'Assets/flags/usa-faded.png';
    case 'france':
      return 'Assets/flags/france-faded.png';
    case 'ussr':
      return 'Assets/flags/ussr-faded.png';
    case 'china':
      return 'Assets/flags/china-faded.png';
    case 'uk':
      return 'Assets/flags/uk-faded.png';
    case 'japan':
      return 'Assets/flags/japan-faded.png';
    case 'germany':
      return 'Assets/flags/germany-faded.png';
    case 'other':
      return 'Assets/flags/other-faded.png';
    case 'european':
      return 'Assets/flags/eu-faded.png';
    default:
      return 'flags/vehicle.nation.unknown.scale-200-faded.png';
  }
};

export const tankTypeAsset = (
  tankTypeId: string,
  isPremium: boolean,
  isCollectible: boolean,
): string => {
  const chooseAsset = (
    isPremium: boolean,
    isCollectible: boolean,
    premiumAsset: string,
    collectibleAsset: string,
    normalAsset: string,
  ): string => {
    if (!isPremium && !isCollectible) {
      return normalAsset;
    }
    return isCollectible ? collectibleAsset : premiumAsset;
  };
  switch (tankTypeId) {
    case 'heavyTank':
      return chooseAsset(
        isPremium,
        isCollectible,
        'Assets/tank-type/heavy.premium.svg',
        'Assets/tank-type/heavy.collectible.svg',
        'Assets/tank-type/heavy.svg',
      );
    case 'AT-SPG':
      return chooseAsset(
        isPremium,
        isCollectible,
        'Assets/tank-type/at.premium.svg',
        'Assets/tank-type/at.collectible.svg',
        'Assets/tank-type/at.svg',
      );
    case 'mediumTank':
      return chooseAsset(
        isPremium,
        isCollectible,
        'Assets/tank-type/medium.premium.svg',
        'Assets/tank-type/medium.collectible.svg',
        'Assets/tank-type/medium.svg',
      );
    case 'lightTank':
      return chooseAsset(
        isPremium,
        isCollectible,
        'Assets/tank-type/light.premium.svg',
        'Assets/tank-type/light.collectible.svg',
        'Assets/tank-type/light.svg',
      );
    default:
      return '';
  }
};

export const getUtcNow = (): Date => {
  const now = new Date();
  return new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
    now.getUTCMilliseconds(),
  );
};
