import type { Tour } from './tour.model';
import type { TourLog } from './tour-log.model';

export interface SearchResponse {
  tours: Tour[];
  tourLogs: TourLog[];
}
