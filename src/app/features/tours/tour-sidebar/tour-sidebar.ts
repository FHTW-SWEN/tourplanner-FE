import { Component } from '@angular/core';
import { TourList } from '../tour-list/tour-list';

@Component({
  selector: 'app-tour-sidebar',
  standalone: true,
  host: { class: 'flex h-full shrink-0 flex-col' },
  templateUrl: './tour-sidebar.html',
  imports: [TourList],
})
export class TourSidebar {}
