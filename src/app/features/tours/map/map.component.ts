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
import { OpenRouteService, OrsResult } from '../../../core/services/open-route.service';
import { ToursViewModel } from '../tours.viewmodel';
import { concatMap, of } from 'rxjs';

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
  private readonly ors = inject(OpenRouteService);
  private readonly vm = inject(ToursViewModel);

  constructor() {
    effect(() => {
      const tour = this.vm.selectedTour();
      if (!tour) {
        this.mapFacade.clearAll();
        return;
      }

      const sub = this.geocode.geocodeFromTo(tour.from, tour.to).pipe(
        concatMap(({ fromCoords, toCoords }: { fromCoords: [number,number]|null, toCoords: [number,number]|null }) => {
          if (!fromCoords || !toCoords) {
            return of({ fromCoords, toCoords, orsResult: null as OrsResult | null });
          }
          return this.ors.getRoute(fromCoords, toCoords, tour.transportType).pipe(
            concatMap((orsResult: OrsResult | null) => of({ fromCoords, toCoords, orsResult }))
          );
        })
      ).subscribe({
        next: ({ fromCoords, toCoords, orsResult }) => {
          this.drawRouteWhenReady(
            tour.from,
            tour.to,
            fromCoords,
            toCoords,
            orsResult?.coordinates ?? null,
          );
        },
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
    routeCoordinates: [number, number][] | null,
  ): void {
    const apply = () => {
      if (!this.mapFacade.isMapReady()) {
        requestAnimationFrame(apply);
        return;
      }

      this.mapFacade.clearAll();

      let a = fromCoords;
      let b = toCoords;

      if (a && !b) b = [a[0] + 0.04, a[1] + 0.04];
      if (!a && b) a = [b[0] - 0.04, b[1] - 0.04];
      if (!a || !b) {
        a = [48.2082, 16.3738];
        b = [48.2482, 16.4138];
      }

      this.mapFacade.addMarker(a[0], a[1], `Start: ${fromLabel}`);
      this.mapFacade.addMarker(b[0], b[1], `Destination: ${toLabel}`);

      const coords = routeCoordinates && routeCoordinates.length >= 2
        ? routeCoordinates
        : [a, b];

      this.mapFacade.drawRoute(coords);
      queueMicrotask(() => this.mapFacade.invalidateSize());
    };

    apply();
  }
}