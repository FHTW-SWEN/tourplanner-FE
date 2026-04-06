import { Component, inject } from '@angular/core';
import { transportLabel } from '../../../core/constants/tour-transport';
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
  vm = inject(ToursViewModel);

  labelTransport(code: string): string {
    return transportLabel(code);
  }
}
