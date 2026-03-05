import { Component } from '@angular/core';
import { TourDetail } from './tour-detail';
import { TourSidebar } from './tour-sidebar';

@Component({
  selector: 'app-tours-page',
  standalone: true,
  imports: [TourSidebar, TourDetail],
  host: { class: 'flex min-h-0 flex-1 flex-col' },
  template: `
    <div class="flex min-h-0 flex-1">
      <app-tour-sidebar />
      <app-tour-detail />
    </div>
  `,
})
export class ToursPage {}
