import { Component, inject } from '@angular/core';
import { ToursViewModel } from '../tours.viewmodel';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  host: { class: 'min-h-0 flex-1' },
  templateUrl: "./tour-detail.html",
})
export class TourDetail {
  vm = inject(ToursViewModel)
}
