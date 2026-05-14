import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tour, TourLog } from '../models/index';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class TourApiService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl; // 'http://localhost:8080/api'

  // Tours
  getTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.base}/tours`);
  }

  createTour(tour: Tour): Observable<Tour> {
    return this.http.post<Tour>(`${this.base}/tours`, tour);
  }

  updateTour(id: string, tour: Tour): Observable<Tour> {
    return this.http.put<Tour>(`${this.base}/tours/${id}`, tour);
  }

  deleteTour(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/tours/${id}`);
  }

  // Tour Logs
  getLogsByTourId(tourId: string): Observable<TourLog[]> {
    return this.http.get<TourLog[]>(`${this.base}/logs?tourId=${tourId}`);
  }

  createLog(log: TourLog): Observable<TourLog> {
    return this.http.post<TourLog>(`${this.base}/logs`, log);
  }

  updateLog(id: string, log: TourLog): Observable<TourLog> {
    return this.http.put<TourLog>(`${this.base}/logs/${id}`, log);
  }

  deleteLog(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/logs/${id}`);
  }
}
