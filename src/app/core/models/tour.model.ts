
export interface Tour {
  id?: string;
  name: string;
  description: string;
  from: string;
  to: string;
  transportType: string;
  distance: number;
  estimatedTime: number;
  /** Computed by backend (e.g. from log count). */
  popularity?: number;
  /** Computed by backend. */
  childFriendliness?: number;
}
