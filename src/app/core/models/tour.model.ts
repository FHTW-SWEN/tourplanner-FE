export interface Tour {
  id?: string;
  name: string;
  description: string;
  from: string;
  to: string;
  transportType: string;
  /** Distance in km — is populated by the backend via ORS; it is not entered by the user.. */
  distance: number;
  estimatedTime: number;
  /**
   * Route coordinates as a JSON string: "[[lat,lng],[lat,lng],...]"
   * Comes from the backend (ORS Directions API) and is rendered by Leaflet.
   */
  routeCoordinates?: string;
  /** Computed: derived from the number of tour logs. */
  popularity?: number;
  /** Computed: based on the difficulty, time, and distance of the logs. */
  childFriendliness?: number;
}
