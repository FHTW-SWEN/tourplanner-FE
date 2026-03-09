import { Component } from '@angular/core';

@Component({
  selector: 'app-tour-sidebar',
  standalone: true,
  host: { class: 'flex h-full shrink-0 flex-col' },
  templateUrl: "./tour-sidebar.html",
})
export class TourSidebar {}
