import { Component, Input } from '@angular/core';
import { Vehicle } from '../../../Model/Vehicle';
import { NationBackgroundPipe } from '../../Pipes/nation-background.pipe';
import { VehicleSortPipe } from '../../Pipes/vehicle-sort.pipe';
import { NgOptimizedImage } from '@angular/common';
import { VehicleTypePipe } from '../../Pipes/vehicle-type.pipe';

@Component({
  selector: 'app-tank-card',
  standalone: true,
  imports: [NationBackgroundPipe, VehicleSortPipe, NgOptimizedImage, VehicleTypePipe],
  templateUrl: './tank-card.component.html',
  styleUrl: './tank-card.component.css',
})
export class TankCardComponent {
  @Input() vehicle?: Vehicle;
}
