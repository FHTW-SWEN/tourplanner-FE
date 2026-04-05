import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef, inject, effect } from '@angular/core';
import { LeafletMapFacade } from '../../../core/services/leaflet-map-facade.service';
import { ToursViewModel } from '../tours.viewmodel';

/**
 * Renders a Leaflet map for the currently selected tour.
 * All map operations are delegated to the LeafletMapFacade — this component
 * has zero direct Leaflet imports, which is the point of the Facade Pattern.
 */
@Component({
  selector: 'app-map',
  standalone: true,
  template: `
    <div #mapContainer class="w-full h-full rounded-lg"></div>
  `,
  host: { class: 'block w-full h-64' },
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLElement>;

  private readonly mapFacade = inject(LeafletMapFacade);
  private readonly vm = inject(ToursViewModel);

  constructor() {
    // React to tour selection changes via Angular signal effect
    effect(() => {
      const tour = this.vm.selectedTour();
      if (tour) {
        this.showTourOnMap(tour.from, tour.to);
      } else {
        this.mapFacade.clearAll();
      }
    });
  }

  ngAfterViewInit(): void {
    this.mapFacade.initMap(this.mapContainer.nativeElement);

    // Show the currently selected tour immediately on init
    const tour = this.vm.selectedTour();
    if (tour) {
      this.showTourOnMap(tour.from, tour.to);
    }
  }

  ngOnDestroy(): void {
    this.mapFacade.destroy();
  }

  /**
   * Uses placeholder coordinates for from/to until geocoding is integrated.
   * Markers are placed at Vienna (from) and a slightly offset position (to)
   * to demonstrate the map functionality with the Facade.
   */
  private showTourOnMap(from: string, to: string): void {
    this.mapFacade.clearAll();

    // Placeholder coordinates — replace with real geocoding (e.g. OpenRouteService)
    const fromCoords: [number, number] = [48.2082, 16.3738];
    const toCoords: [number, number] = [48.2300, 16.4100];

    this.mapFacade.addMarker(fromCoords[0], fromCoords[1], `Start: ${from}`);
    this.mapFacade.addMarker(toCoords[0], toCoords[1], `Ziel: ${to}`);
    this.mapFacade.drawRoute([fromCoords, toCoords]);
  }
}
