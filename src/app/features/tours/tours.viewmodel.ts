import { Injectable, signal, computed } from '@angular/core';
import type { Tour, TourLog } from '../../core/models/index';

@Injectable({ providedIn: 'root' })
export class ToursViewModel {
  tours = signal<Tour[]>([
    {
      id: '1',
      name: 'Berlin City Tour',
      description: 'Historic landmarks',
      from: 'Alexanderplatz',
      to: 'Brandenburg Gate',
      transportType: 'walk',
      distance: 5,
      estimatedTime: 120,
      imageUrl: 'https://picsum.photos/seed/berlin-tour/800/400',
    },
    {
      id: '2',
      name: 'Munich to Neuschwanstein',
      description: 'Fairytale castle',
      from: 'Munich Hauptbahnhof',
      to: 'Neuschwanstein Castle',
      transportType: 'car',
      distance: 120,
      estimatedTime: 480,
      imageUrl: 'https://picsum.photos/seed/munich-tour/800/400',
    },
    {
      id: '3',
      name: 'Riverside Walk',
      description: 'Scenic path',
      from: 'Central Bridge',
      to: 'Marina Park',
      transportType: 'bike',
      distance: 15,
      estimatedTime: 90,
      imageUrl: 'https://picsum.photos/seed/riverside-tour/800/400',
    },
  ]);

  tourLogs = signal<TourLog[]>([
    { id: 'l1', tourId: '1', dateTime: '2024-03-15T10:00', comment: 'Great weather, enjoyed the walk!', difficulty: 2, totalDistance: 5.2, totalTime: 130, rating: 5 },
    { id: 'l2', tourId: '1', dateTime: '2024-04-01T09:30', comment: 'A bit crowded but still fun.', difficulty: 1, totalDistance: 4.8, totalTime: 110, rating: 4 },
    { id: 'l3', tourId: '2', dateTime: '2024-02-20T08:00', comment: 'Long drive but worth it.', difficulty: 3, totalDistance: 122, totalTime: 500, rating: 5 },
  ]);

  selectedTourId = signal<string | null>(null);

  /** Tours enriched with computed popularity and childFriendliness. */
  toursWithStats = computed(() => {
    const logs = this.tourLogs();
    return this.tours().map(tour => {
      const tourLogs = logs.filter(l => l.tourId === tour.id);
      const popularity = tourLogs.length;

      if (tourLogs.length === 0) {
        return { ...tour, popularity, childFriendliness: undefined };
      }

      const avgDifficulty = tourLogs.reduce((s, l) => s + l.difficulty, 0) / tourLogs.length;
      const avgDistance   = tourLogs.reduce((s, l) => s + l.totalDistance, 0) / tourLogs.length;
      const avgTime       = tourLogs.reduce((s, l) => s + l.totalTime, 0) / tourLogs.length;

      // Higher difficulty, longer distance, longer time → less child-friendly
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

  selectTour(tour: Tour): void {
    this.selectedTourId.set(tour.id ?? null);
  }

  updateTour(updated: Tour): void {
    this.tours.update(tours => tours.map(t => t.id === updated.id ? updated : t));
  }

  deleteTour(id: string): void {
    this.tours.update(tours => tours.filter(t => t.id !== id));
    if (this.selectedTourId() === id) {
      this.selectedTourId.set(null);
    }
  }

  addTourLog(log: TourLog): void {
    this.tourLogs.update(logs => [...logs, { ...log, id: crypto.randomUUID() }]);
  }

  updateTourLog(updated: TourLog): void {
    this.tourLogs.update(logs => logs.map(l => l.id === updated.id ? updated : l));
  }

  deleteTourLog(id: string): void {
    this.tourLogs.update(logs => logs.filter(l => l.id !== id));
  }
}
