import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nationBackground',
  standalone: true,
})
export class NationBackgroundPipe implements PipeTransform {
  transform(nationTypeId?: string): string {
    let imageUrl = 'assets/flags/vehicle.nation.unknown.scale-200-faded.png';
    switch (nationTypeId) {
      case 'usa':
        imageUrl = 'assets/flags/usa-faded.png';
        break;
      case 'france':
        imageUrl = 'assets/flags/france-faded.png';
        break;
      case 'ussr':
        imageUrl = 'assets/flags/ussr-faded.png';
        break;
      case 'china':
        imageUrl = 'assets/flags/china-faded.png';
        break;
      case 'uk':
        imageUrl = 'assets/flags/uk-faded.png';
        break;
      case 'japan':
        imageUrl = 'assets/flags/japan-faded.png';
        break;
      case 'germany':
        imageUrl = 'assets/flags/germany-faded.png';
        break;
      case 'other':
        imageUrl = 'assets/flags/other-faded.png';
        break;
      case 'european':
        imageUrl = 'assets/flags/eu-faded.png';
        break;
      default:
        imageUrl = 'assets/flags/vehicle.nation.unknown.scale-200-faded.png';
        break;
    }

    return `background-image: url('${imageUrl}')`;
  }
}
