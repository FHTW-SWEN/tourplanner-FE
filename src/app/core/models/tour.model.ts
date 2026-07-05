export interface Tour {
  id?: string;
  name: string;
  description: string;
  from: string;
  to: string;
  transportType: string;
  /** Distanz in km — wird vom Backend via ORS befüllt, nicht vom User eingegeben. */
  distance: number;
  /** Geschätzte Zeit in Minuten — wird vom Backend via ORS befüllt. */
  estimatedTime: number;
  /**
   * Route-Koordinaten als JSON-String: "[[lat,lng],[lat,lng],...]"
   * Kommt vom Backend (ORS Directions API), wird von Leaflet gerendert.
   */
  routeCoordinates?: string;
  /** Computed: abgeleitet aus der Anzahl der Tour-Logs. */
  popularity?: number;
  /** Computed: abgeleitet aus Schwierigkeit, Zeit und Distanz der Logs. */
  childFriendliness?: number;
}
