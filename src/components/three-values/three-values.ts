import { Component } from '@angular/core';
import { ThreeBars } from './three-bars';
import { ThreeValuesSlider } from './three-values-slider';
import { ThreeValuesViewModel } from './three-values.vm';

@Component({
  selector: 'three-values',
  templateUrl: './three-values.html',
  providers: [ThreeValuesViewModel],
  imports: [ThreeValuesSlider, ThreeBars],
})
export class ThreeValues {}
