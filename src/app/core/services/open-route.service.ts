import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface OrsResult {
  distance: number;        // km
  estimatedTime: number;   // minutes
  coordinates: [number, number][];  // [lat, lng] pairs for Leaflet
}

@Injectable({ providedIn: 'root' })
export class OpenRouteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.openrouteservice.org/v2/directions';

  /**
   * Maps our transport type to ORS profile.
   */
  private getProfile(transportType: string): string {
    switch (transportType) {
      case 'bike':    return 'cycling-regular';
      case 'car':     return 'driving-car';
      case 'walk':
      default:        return 'foot-walking';
    }
  }

  /**
   * Fetches route from ORS given start/end coordinates.
   * Returns distance (km), estimatedTime (minutes), and route coordinates for Leaflet.
   */
  getRoute(
    fromCoords: [number, number],
    toCoords: [number, number],
    transportType: string,
  ): Observable<OrsResult | null> {
    const profile = this.getProfile(transportType);
    const url = `${this.baseUrl}/${profile}/geojson`;

    const headers = new HttpHeaders({
      'Authorization': environment.orsApiKey,
      'Content-Type': 'application/json',
    });

    const body = {
      coordinates: [
        [fromCoords[1], fromCoords[0]],   // ORS uses [lng, lat]
        [toCoords[1], toCoords[0]],
      ],
    };

    return this.http.post<any>(url, body, { headers }).pipe(
      map(response => {
        const feature = response?.features?.[0];
        if (!feature) return null;

        const distanceMeters: number = feature.properties.summary.distance;
        const durationSeconds: number = feature.properties.summary.duration;

        // ORS returns [lng, lat] — convert to [lat, lng] for Leaflet
        const coordinates: [number, number][] = feature.geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
        );

        return {
          distance: Math.round(distanceMeters / 100) / 10,       // meters → km (1 decimal)
          estimatedTime: Math.round(durationSeconds / 60),        // seconds → minutes
          coordinates,
        };
      }),
      catchError(err => {
        console.error('ORS API error:', err);
        return of(null);
      }),
    );
  }
}
