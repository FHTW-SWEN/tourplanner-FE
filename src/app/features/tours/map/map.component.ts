import {
  Component,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  inject,
  effect,
} from '@angular/core';
import { LeafletMapFacade } from '../../../core/services/leaflet-map-facade.service';
import { NominatimGeocodeService } from '../../../core/services/nominatim-geocode.service';
import { ToursViewModel } from '../tours.viewmodel';

/**
 * Renders a Leaflet map for the currently selected tour.
 * Start/end are geocoded from tour.from / tour.to (Nominatim); line is a straight segment (demo).
 */
@Component({
  selector: 'app-map',
  standalone: true,
  template: `
    <div #mapContainer class="h-full w-full rounded-lg"></div>
  `,
  host: { class: 'block h-64 w-full min-h-64 shrink-0' },
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLElement>;

  private readonly mapFacade = inject(LeafletMapFacade);
  private readonly geocode = inject(NominatimGeocodeService);
  private readonly vm = inject(ToursViewModel);

  constructor() {
    effect(() => {
      const tour = this.vm.selectedTour();
      if (!tour) {
        this.mapFacade.clearAll();
        return;
      }

      const sub = this.geocode.geocodeFromTo(tour.from, tour.to).subscribe({
        next: ({ fromCoords, toCoords }) =>
          this.drawRouteWhenReady(tour.from, tour.to, fromCoords, toCoords),
      });

      return () => sub.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
    this.mapFacade.initMap(this.mapContainer.nativeElement);

    requestAnimationFrame(() => {
      this.mapFacade.invalidateSize();
      setTimeout(() => this.mapFacade.invalidateSize(), 200);
    });
  }

  ngOnDestroy(): void {
    this.mapFacade.destroy();
  }

  private drawRouteWhenReady(
    fromLabel: string,
    toLabel: string,
    fromCoords: [number, number] | null,
    toCoords: [number, number] | null,
  ): void {
    const apply = () => {
      if (!this.mapFacade.isMapReady()) {
        requestAnimationFrame(apply);
        return;
      }

      this.mapFacade.clearAll();

      let a = fromCoords;
      let b = toCoords;
      if (a && !b) {
        b = [a[0] + 0.04, a[1] + 0.04];
      }
      if (!a && b) {
        a = [b[0] - 0.04, b[1] - 0.04];
      }
      if (!a || !b) {
        a = [52.52, 13.405];
        b = [52.55, 13.45];
      }

      this.mapFacade.addMarker(a[0], a[1], `Start: ${fromLabel}`);
      this.mapFacade.addMarker(b[0], b[1], `Destination: ${toLabel}`);
      this.mapFacade.drawRoute([a, b]);
      queueMicrotask(() => this.mapFacade.invalidateSize());
    };

    apply();
  }
}
