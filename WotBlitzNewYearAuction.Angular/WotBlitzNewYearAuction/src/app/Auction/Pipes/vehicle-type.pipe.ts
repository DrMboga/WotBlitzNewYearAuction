import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehicleType',
  standalone: true,
})
export class VehicleTypePipe implements PipeTransform {
  transform(tankTypeId?: string, isPremium?: boolean, isCollectible?: boolean): string {
    const chooseAsset = (
      premiumAsset: string,
      collectibleAsset: string,
      normalAsset: string,
      isPremium?: boolean,
      isCollectible?: boolean,
    ): string => {
      if (!isPremium && !isCollectible) {
        return normalAsset;
      }
      return isCollectible ? collectibleAsset : premiumAsset;
    };
    switch (tankTypeId) {
      case 'heavyTank':
        return chooseAsset(
          'assets/tank-type/heavy.premium.svg',
          'assets/tank-type/heavy.collectible.svg',
          'assets/tank-type/heavy.svg',
          isPremium,
          isCollectible,
        );
      case 'AT-SPG':
        return chooseAsset(
          'assets/tank-type/at.premium.svg',
          'assets/tank-type/at.collectible.svg',
          'assets/tank-type/at.svg',
          isPremium,
          isCollectible,
        );
      case 'mediumTank':
        return chooseAsset(
          'assets/tank-type/medium.premium.svg',
          'assets/tank-type/medium.collectible.svg',
          'assets/tank-type/medium.svg',
          isPremium,
          isCollectible,
        );
      case 'lightTank':
        return chooseAsset(
          'assets/tank-type/light.premium.svg',
          'assets/tank-type/light.collectible.svg',
          'assets/tank-type/light.svg',
          isPremium,
          isCollectible,
        );
      default:
        return '';
    }
  }
}
