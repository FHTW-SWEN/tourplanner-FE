import { Component } from '@angular/core';
import { TourList } from '../tour-list/tour-list';
import { AddTourModal, NewTourPayload } from '../add-tour-modal/add-tour-modal';

@Component({
  selector: 'app-tour-sidebar',
  standalone: true,
  imports: [AddTourModal, TourList],
  host: { class: 'flex h-full shrink-0 flex-col' },
  templateUrl: './tour-sidebar.html',
})
export class TourSidebar {
  isModalOpen = false;

  openAddTourModal(): void {
    this.isModalOpen = true;
  }

  closeAddTourModal(): void {
    this.isModalOpen = false;
  }

  handleSaveTour(tour: NewTourPayload): void {
    console.log('saved tour', tour);
    // TODO: hier One-way Data-Fluss implementieren (z.B. Service) statt console.log
  }
}
