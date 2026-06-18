import { Injectable } from '@angular/core';
import * as L from 'leaflet';

// Fix: Webpack mangles Leaflet's default icon URLs — reset them explicitly
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'assets/marker-icon.png',
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  shadowUrl: 'assets/marker-shadow.png',
});

/**
 * Facade Pattern: Wraps the complex Leaflet API behind a simple, application-specific interface.
 * Components never interact with Leaflet directly — only through this facade.
 */
@Injectable({ providedIn: 'root' })
export class LeafletMapFacade {
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];
  private routeLayer: L.Polyline | null = null;

  /** True after `initMap` has created the Leaflet instance. */
  isMapReady(): boolean {
    return this.map !== null;
  }

  /**
   * Initializes a Leaflet map inside the given HTML element.
   * Uses OpenStreetMap tiles by default.
   */
  initMap(container: HTMLElement, lat = 48.2082, lng = 16.3738, zoom = 13): void {
    if (this.map) {
      this.destroy();
    }

    this.map = L.map(container).setView([lat, lng], zoom);

    queueMicrotask(() => this.map?.invalidateSize());

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);
  }

  /**
   * Centers the map on the given coordinates.
   */
  setView(lat: number, lng: number, zoom = 13): void {
    this.map?.setView([lat, lng], zoom);
  }

  /**
   * Adds a marker at the given coordinates with an optional popup label.
   */
  addMarker(lat: number, lng: number, label?: string): void {
    if (!this.map) return;

    const marker = L.marker([lat, lng]);
    if (label) {
      marker.bindPopup(label).openPopup();
    }
    marker.addTo(this.map);
    this.markers.push(marker);
  }

  /**
   * Draws a route polyline from an array of coordinate pairs.
   */
  drawRoute(coordinates: [number, number][]): void {
    if (!this.map || coordinates.length < 2) return;

    this.clearRoute();
    this.routeLayer = L.polyline(coordinates, { color: '#e879a3', weight: 4 }).addTo(this.map);
    this.map.fitBounds(this.routeLayer.getBounds(), { padding: [40, 40] });
    queueMicrotask(() => this.map?.invalidateSize());
  }

  /** Call after layout changes so tiles render in flex/scroll containers. */
  invalidateSize(): void {
    this.map?.invalidateSize();
  }

  /**
   * Removes all markers from the map.
   */
  clearMarkers(): void {
    this.markers.forEach(m => m.remove());
    this.markers = [];
  }

  /**
   * Removes the current route polyline from the map.
   */
  clearRoute(): void {
    this.routeLayer?.remove();
    this.routeLayer = null;
  }

  /**
   * Removes all overlays (markers + route).
   */
  clearAll(): void {
    this.clearMarkers();
    this.clearRoute();
  }

  /**
   * Destroys the map instance and cleans up all resources.
   * Must be called when the component is destroyed to avoid memory leaks.
   */
  destroy(): void {
    this.clearAll();
    this.map?.remove();
    this.map = null;
  }
}
