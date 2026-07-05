export interface TourPhoto {
  id?: string;
  tourId: string;
  fileName: string;
  caption?: string;
  uploadedAt?: string;
  /** Data-URL (data:image/...;base64,...) — can be used directly <img src> . */
  dataUrl: string;
}