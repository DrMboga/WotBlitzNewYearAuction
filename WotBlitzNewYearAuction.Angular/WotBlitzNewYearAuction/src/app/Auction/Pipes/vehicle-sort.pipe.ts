import { Pipe, PipeTransform } from '@angular/core';
import { COLLECTIBLE_COLOR, PREMIUM_COLOR } from '../constants';

@Pipe({
  name: 'vehicleSort',
  standalone: true,
})
export class VehicleSortPipe implements PipeTransform {
  transform(isPremium?: boolean, isCollectible?: boolean): string {
    if (isPremium) {
      if (isCollectible) {
        return `color: ${COLLECTIBLE_COLOR}; font-size: 16px`;
      }
      return `color: ${PREMIUM_COLOR}; font-size: 16px`;
    }
    return 'font-size: 16px';
  }
}
