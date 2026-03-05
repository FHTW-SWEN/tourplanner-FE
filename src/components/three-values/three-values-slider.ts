import { Component, inject } from '@angular/core';
import { ThreeValuesViewModel } from './three-values.vm';

@Component({
  selector: 'values-slider',
  templateUrl: './three-values-slider.html',
})
export class ThreeValuesSlider {
  vm = inject(ThreeValuesViewModel);

  onInputA(value: string) {
    this.vm.setA(parseInt(value));
  }
  onInputB(value: string) {
    this.vm.setB(parseInt(value));
  }
  onInputC(value: string) {
    this.vm.setC(parseInt(value));
  }
}
