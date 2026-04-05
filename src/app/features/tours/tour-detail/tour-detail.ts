import { Component, inject } from '@angular/core';
import { ToursViewModel } from '../tours.viewmodel';
import { MapComponent } from '../map/map.component';
import { TourLogList } from '../tour-log-list/tour-log-list';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [MapComponent, TourLogList],
  host: { class: 'min-h-0 flex-1' },
  templateUrl: "./tour-detail.html",
})
export class TourDetail {
  vm = inject(ToursViewModel)
}
