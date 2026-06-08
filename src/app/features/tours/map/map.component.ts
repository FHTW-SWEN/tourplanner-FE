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
import { ToursViewModel } from '../tours.viewmodel';

/**
 * Rendert eine Leaflet-Karte für die aktuell ausgewählte Tour.
 *
 * Die Routenkoordinaten kommen fertig vom Backend (ORS Directions API) —
 * das Frontend macht KEINEN direkten ORS- oder Geocoding-Call mehr.
 * Leaflet zeichnet nur die empfangenen Koordinaten als Polyline.
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
  private readonly vm = inject(ToursViewModel);

  constructor() {
    effect(() => {
      const tour = this.vm.selectedTour();

      if (!tour) {
        this.mapFacade.clearAll();
        return;
      }

      if (!tour.routeCoordinates) {
        this.mapFacade.clearAll();
        this.mapFacade.setView(48.2082, 16.3738, 10);
        return;
      }

      this.drawRouteFromCoordinates(tour.from, tour.to, tour.routeCoordinates);
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

  /**
   * Parst die routeCoordinates vom Backend und zeichnet sie als Leaflet-Polyline.
   * Format: "[[lat,lng],[lat,lng],...]"
   */
  private drawRouteFromCoordinates(
    fromLabel: string,
    toLabel: string,
    routeCoordinatesJson: string,
  ): void {
    const apply = () => {
      if (!this.mapFacade.isMapReady()) {
        requestAnimationFrame(apply);
        return;
      }

      this.mapFacade.clearAll();

      let coords: [number, number][];
      try {
        coords = JSON.parse(routeCoordinatesJson) as [number, number][];
      } catch {
        console.error('Ungültiges routeCoordinates Format:', routeCoordinatesJson);
        return;
      }

      if (!coords || coords.length < 2) return;

      const first = coords[0];
      const last = coords[coords.length - 1];
      this.mapFacade.addMarker(first[0], first[1], `Start: ${fromLabel}`);
      this.mapFacade.addMarker(last[0], last[1], `Ziel: ${toLabel}`);

      this.mapFacade.drawRoute(coords);

      queueMicrotask(() => this.mapFacade.invalidateSize());
    };

    apply();
  }
}