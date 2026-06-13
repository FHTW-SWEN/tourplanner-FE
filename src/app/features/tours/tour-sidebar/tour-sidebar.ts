import { Component, inject } from '@angular/core';
import { TourList } from '../tour-list/tour-list';
import { AddTourModal, TourPayload } from '../add-tour-modal/add-tour-modal';
import { ToursViewModel } from '../tours.viewmodel';
import type { Tour } from '../../../core/models/index';
import { NominatimGeocodeService } from '../../../core/services/nominatim-geocode.service';
import { OpenRouteService, OrsResult } from '../../../core/services/open-route.service';
import { concatMap, of } from 'rxjs';

@Component({
  selector: 'app-tour-sidebar',
  standalone: true,
  imports: [AddTourModal, TourList],
  host: { class: 'flex h-full shrink-0 flex-col' },
  templateUrl: './tour-sidebar.html',
})
export class TourSidebar {
  private vm = inject(ToursViewModel);
  private geocode = inject(NominatimGeocodeService);
  private ors = inject(OpenRouteService);

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
    const editingTour = this.editingTour;
    const imageUrl = payload.imageUrl?.trim() || undefined;

    this.geocode.geocodeFromTo(payload.from, payload.to).pipe(
      concatMap(({
        fromCoords,
        toCoords,
      }: {
        fromCoords: [number, number] | null;
        toCoords: [number, number] | null;
      }) => {
        if (!fromCoords || !toCoords) return of(null as OrsResult | null);
        return this.ors.getRoute(fromCoords, toCoords, payload.transport);
      }),
    ).subscribe((orsResult: OrsResult | null) => {
      const distance = orsResult?.distance ?? 0;
      const estimatedTime = orsResult?.estimatedTime ?? 0;

      if (editingTour) {
        this.vm.updateTour({
          ...editingTour,
          name: payload.name,
          description: payload.description,
          from: payload.from,
          to: payload.to,
          transportType: payload.transport,
          distance,
          estimatedTime,
          imageUrl,
        });
      } else {
        this.vm.addTour({
          name: payload.name,
          description: payload.description,
          from: payload.from,
          to: payload.to,
          transportType: payload.transport,
          distance,
          estimatedTime,
          ...(imageUrl ? { imageUrl } : {}),
        });
      }
    });
  }
}
