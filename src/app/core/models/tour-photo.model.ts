export interface TourPhoto {
  id?: string;
  tourId: string;
  fileName: string;
  caption?: string;
  uploadedAt?: string;
  /** Data-URL (data:image/...;base64,...) — direkt in <img src> nutzbar. */
  dataUrl: string;
}