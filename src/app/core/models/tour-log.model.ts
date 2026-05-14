export interface TourLog {
  id?: string;
  tourId: string;
  /** ISO 8601 date-time. */
  dateTime: string;
  comment: string;
  difficulty: number;
  totalDistance: number;
  totalTime: number;
  rating: number;
}
