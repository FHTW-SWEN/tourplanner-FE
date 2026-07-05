export interface TourDataExport {
  tours: ExportedTour[];
}

export interface ExportedTour {
  name: string;
  description?: string;
  from: string;
  to: string;
  transportType: string;
  distance?: number;
  estimatedTime?: number;
  routeCoordinates?: string;
  logs: ExportedTourLog[];
}

export interface ExportedTourLog {
  dateTime?: string;
  comment?: string;
  difficulty?: number;
  totalDistance?: number;
  totalTime?: number;
  rating?: number;
}

export interface ImportResult {
  importedTours: number;
  importedLogs: number;
}
