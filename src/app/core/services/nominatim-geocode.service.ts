import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, concatMap, map, of, switchMap, timer } from 'rxjs';

/** Single Nominatim search hit (subset of API fields). */
interface NominatimHit {
  lat: string;
  lon: string;
}

/**
 * Client-side geocoding via OpenStreetMap Nominatim.
 * Policy: keep request rate low (~1/s); see https://operations.osmfoundation.org/policies/nominatim/
 */
@Injectable({ providedIn: 'root' })
export class NominatimGeocodeService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, [number, number]>();
  private readonly baseUrl = 'https://nominatim.openstreetmap.org/search';

  /**
   * Resolve `from` then `to` in sequence to respect Nominatim rate limits.
   */
  geocodeFromTo(
    from: string,
    to: string,
  ): Observable<{ fromCoords: [number, number] | null; toCoords: [number, number] | null }> {
    return this.geocodeOne(from).pipe(
      concatMap((fromCoords) => timer(1100).pipe(switchMap(() => of(fromCoords)))),
      concatMap((fromCoords) =>
        this.geocodeOne(to).pipe(map((toCoords) => ({ fromCoords, toCoords }))),
      ),
    );
  }

  private geocodeOne(query: string): Observable<[number, number] | null> {
    const q = query.trim();
    if (!q) return of(null);

    const key = q.toLowerCase();
    const cached = this.cache.get(key);
    if (cached) return of(cached);

    const params = new HttpParams().set('format', 'json').set('limit', '1').set('q', q);

    return this.http.get<NominatimHit[]>(this.baseUrl, { params }).pipe(
      map((rows) => {
        const row = rows?.[0];
        if (!row) return null;
        const lat = Number.parseFloat(row.lat);
        const lon = Number.parseFloat(row.lon);
        if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
        const coords: [number, number] = [lat, lon];
        this.cache.set(key, coords);
        return coords;
      }),
      catchError(() => of(null)),
    );
  }
}
