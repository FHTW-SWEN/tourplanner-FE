export interface Tour {
  id?: string;
  name: string;
  description: string;
  from: string;
  to: string;
  transportType: string;
  distance: number;
  estimatedTime: number;
  /** Path/URL to the tour image stored on the server filesystem. */
  imageUrl?: string;
  /** Computed: derived from number of tour logs. */
  popularity?: number;
  /** Computed: derived from difficulty, total time and distance of logs. */
  childFriendliness?: number;
}
