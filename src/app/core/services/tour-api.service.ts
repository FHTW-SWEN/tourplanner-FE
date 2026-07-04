import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImportResult, Tour, TourDataExport, TourLog, TourPhoto } from '../models/index';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TourApiService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  // Tours
  getTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.base}/tours`);
  }

  searchTours(query: string): Observable<Tour[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Tour[]>(`${this.base}/tours/search`, { params });
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

  exportTourData(): Observable<TourDataExport> {
    return this.http.get<TourDataExport>(`${this.base}/tours/export`);
  }

  importTourData(data: TourDataExport): Observable<ImportResult> {
    return this.http.post<ImportResult>(`${this.base}/tours/import`, data);
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

  // Tour Photos
  getPhotos(tourId: string): Observable<TourPhoto[]> {
    return this.http.get<TourPhoto[]>(`${this.base}/tours/${tourId}/photos`);
  }

  uploadPhoto(tourId: string, file: File, caption?: string): Observable<TourPhoto> {
    const formData = new FormData();
    formData.append('file', file);
    if (caption) formData.append('caption', caption);
    return this.http.post<TourPhoto>(`${this.base}/tours/${tourId}/photos`, formData);
  }

  deletePhoto(tourId: string, photoId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/tours/${tourId}/photos/${photoId}`);
  }
  
}
