import { Component } from '@angular/core';
import { TourDetail } from '../tour-detail/tour-detail';
import { TourSidebar } from '../tour-sidebar/tour-sidebar';

@Component({
  selector: 'app-tours-page',
  standalone: true,
  imports: [TourSidebar, TourDetail],
  host: { class: 'flex min-h-0 flex-1 flex-col' },
  templateUrl: './tours-page.html',
})
export class ToursPage {}
