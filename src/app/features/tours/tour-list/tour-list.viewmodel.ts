import { Injectable, signal } from '@angular/core';
import type { Tour } from '../../../core/models/index';

@Injectable({ providedIn: 'root' })
export class ToursViewModel {
  tours = signal<Tour[]>([
    { id: '1', name: 'Berlin City Tour', description: 'Historic landmarks', from: 'Alexanderplatz', to: 'Brandenburg Gate', transportType: 'foot', distance: 5, estimatedTime: 120, popularity: 4.5, childFriendliness: 3 },
    { id: '2', name: 'Munich to Neuschwanstein', description: 'Fairytale castle', from: 'Munich Hauptbahnhof', to: 'Neuschwanstein Castle', transportType: 'car', distance: 120, estimatedTime: 480, popularity: 4.8, childFriendliness: 5 },
    { id: '3', name: 'Riverside Walk', description: 'Scenic path', from: 'Central Bridge', to: 'Marina Park', transportType: 'bicycle', distance: 15, estimatedTime: 90, popularity: 3.8, childFriendliness: 4.2 },
  ]);
}
