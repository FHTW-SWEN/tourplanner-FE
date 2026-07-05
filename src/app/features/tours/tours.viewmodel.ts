import { Injectable, signal, computed, inject } from '@angular/core';
import type { Tour, TourLog, TourPhoto } from '../../core/models/index';
import { TourApiService } from '../../core/services/tour-api.service';

@Injectable({ providedIn: 'root' })
export class ToursViewModel {
  private api = inject(TourApiService);
  private searchDebounceId: ReturnType<typeof setTimeout> | null = null;
  private tourRequestId = 0;

  tours = signal<Tour[]>([]);
  tourLogs = signal<TourLog[]>([]);
  photos = signal<TourPhoto[]>([]);
  photoUploadError = signal<string | null>(null);
  selectedTourId = signal<string | null>(null);
  tourSearchQuery = signal('');
  tourListLoading = signal(false);

  //  Tours 

  loadTours(): void {
    const requestId = ++this.tourRequestId;
    this.tourListLoading.set(true);

    this.api.getTours().subscribe({
      next: tours => {
        if (requestId !== this.tourRequestId) return;
        this.tours.set(tours);
        this.ensureSelectedTourIsVisible();
      },
      error: () => {
        if (requestId !== this.tourRequestId) return;
        this.tours.set([]);
        this.tourListLoading.set(false);
      },
      complete: () => {
        if (requestId === this.tourRequestId) this.tourListLoading.set(false);
      },
    });
  }

  setTourSearchQuery(query: string): void {
    this.tourSearchQuery.set(query);

    if (this.searchDebounceId) {
      clearTimeout(this.searchDebounceId);
    }

    this.searchDebounceId = setTimeout(() => this.searchTours(query), 300);
  }

  private searchTours(query: string): void {
    const requestId = ++this.tourRequestId;
    this.tourListLoading.set(true);

    this.api.searchTours(query).subscribe({
      next: tours => {
        if (requestId !== this.tourRequestId) return;
        this.tours.set(tours);
        this.ensureSelectedTourIsVisible();
      },
      error: () => {
        if (requestId !== this.tourRequestId) return;
        this.tours.set([]);
        this.tourListLoading.set(false);
      },
      complete: () => {
        if (requestId === this.tourRequestId) this.tourListLoading.set(false);
      },
    });
  }

  addTour(tour: Tour): void {
    this.api.createTour(tour).subscribe(created =>
      this.tours.update(ts => [...ts, created])
    );
  }

  updateTour(updated: Tour): void {
    this.api.updateTour(updated.id!, updated).subscribe(saved =>
      this.tours.update(ts => ts.map(t => t.id === saved.id ? saved : t))
    );
  }

  deleteTour(id: string): void {
    this.api.deleteTour(id).subscribe(() => {
      this.tours.update(ts => ts.filter(t => t.id !== id));
      if (this.selectedTourId() === id) this.selectedTourId.set(null);
    });
  }

  selectTour(tour: Tour): void {
  this.selectedTourId.set(tour.id ?? null);
  this.api.getLogsByTourId(tour.id!).subscribe(logs => this.tourLogs.set(logs));
  this.api.getPhotos(tour.id!).subscribe(photos => this.photos.set(photos));
}

  // Tour Logs 

  addTourLog(log: TourLog): void {
    this.api.createLog(log).subscribe(created =>
      this.tourLogs.update(ls => [...ls, created])
    );
  }

  updateTourLog(updated: TourLog): void {
    this.api.updateLog(updated.id!, updated).subscribe(saved =>
      this.tourLogs.update(ls => ls.map(l => l.id === saved.id ? saved : l))
    );
  }

  deleteTourLog(id: string): void {
    this.api.deleteLog(id).subscribe(() =>
      this.tourLogs.update(ls => ls.filter(l => l.id !== id))
    );
  }

  uploadPhoto(file: File, caption?: string): void {
    const tourId = this.selectedTourId();
    if (!tourId) return;
    this.photoUploadError.set(null);
    this.api.uploadPhoto(tourId, file, caption).subscribe({
      next: created => this.photos.update(ps => [created, ...ps]),
      error: err => this.photoUploadError.set(err?.error?.message ?? 'Upload failed.'),
    });
  }

  deletePhoto(photoId: string): void {
    const tourId = this.selectedTourId();
    if (!tourId) return;
    this.api.deletePhoto(tourId, photoId).subscribe(() =>
      this.photos.update(ps => ps.filter(p => p.id !== photoId))
    );
  }

  // Computed 

  toursWithStats = computed(() => {
    const logs = this.tourLogs();
    return this.tours().map(tour => {
      const tourLogs = logs.filter(l => l.tourId === tour.id);
      const popularity = tourLogs.length || (tour.popularity ?? 0);

      if (tourLogs.length === 0) {
        return { ...tour, popularity, childFriendliness: tour.childFriendliness };
      }

      const avgDifficulty = tourLogs.reduce((s, l) => s + l.difficulty, 0) / tourLogs.length;
      const avgDistance   = tourLogs.reduce((s, l) => s + l.totalDistance, 0) / tourLogs.length;
      const avgTime       = tourLogs.reduce((s, l) => s + l.totalTime, 0) / tourLogs.length;

      const childFriendliness = Math.min(5, Math.max(1, Math.round(
        (6 - avgDifficulty)
        - (avgDistance > 30 ? 1 : 0)
        - (avgTime > 180 ? 1 : 0)
      )));

      return { ...tour, popularity, childFriendliness };
    });
  });

  selectedTour = computed(() =>
    this.toursWithStats().find(t => t.id === this.selectedTourId()) ?? null
  );

  logsForSelectedTour = computed(() => {
    const id = this.selectedTourId();
    if (!id) return [];
    return this.tourLogs().filter(log => log.tourId === id);
  });

   photosForSelectedTour = computed(() => {
    const id = this.selectedTourId();
    if (!id) return [];
    return this.photos().filter(p => p.tourId === id);
  });

  private ensureSelectedTourIsVisible(): void {
    const selectedId = this.selectedTourId();
    if (selectedId && !this.tours().some(tour => tour.id === selectedId)) {
      this.selectedTourId.set(null);
      this.tourLogs.set([]);
      this.photos.set([]);
    }
  }
  
}
