import { Component, inject } from '@angular/core';
import { TourList } from '../tour-list/tour-list';
import { AddTourModal, TourPayload } from '../add-tour-modal/add-tour-modal';
import { ToursViewModel } from '../tours.viewmodel';
import type { Tour } from '../../../core/models/index';

@Component({
  selector: 'app-tour-sidebar',
  standalone: true,
  imports: [AddTourModal, TourList],
  host: { class: 'flex h-full shrink-0 flex-col' },
  templateUrl: './tour-sidebar.html',
})
export class TourSidebar {
  private vm = inject(ToursViewModel);
  isModalOpen = false;
  editingTour: Tour | null = null;

  openAddTourModal(): void {
    this.editingTour = null;
    this.isModalOpen = true;
  }

  openEditTourModal(tour: Tour): void {
    this.editingTour = tour;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingTour = null;
  }

  handleSaveTour(payload: TourPayload): void {
    const imageUrl = payload.imageUrl?.trim() || undefined;

    if (this.editingTour) {
      this.vm.updateTour({
        ...this.editingTour,
        name: payload.name,
        description: payload.description,
        from: payload.from,
        to: payload.to,
        transportType: payload.transport,
        imageUrl,
      });
    } else {
      this.vm.tours.update(tours => [
        ...tours,
        {
          id: crypto.randomUUID(),
          name: payload.name,
          description: payload.description,
          from: payload.from,
          to: payload.to,
          transportType: payload.transport,
          ...(imageUrl ? { imageUrl } : {}),
          distance: 0,
          estimatedTime: 0,
        },
      ]);
    }
  }
}
