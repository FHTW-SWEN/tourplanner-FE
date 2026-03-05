import { Component, inject } from '@angular/core';
import { ThreeValuesViewModel } from './three-values.vm';

@Component({
  selector: 'three-bars',
  templateUrl: './three-bars.html',
})
export class ThreeBars {
  vm = inject(ThreeValuesViewModel);
}
