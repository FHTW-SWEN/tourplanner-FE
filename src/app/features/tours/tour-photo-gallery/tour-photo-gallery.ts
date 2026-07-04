import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToursViewModel } from '../tours.viewmodel';
import type { TourPhoto } from '../../../core/models/index';

@Component({
  selector: 'app-tour-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tour-photo-gallery.html',
})
export class TourPhotoGallery {
  vm = inject(ToursViewModel);

  lightboxPhoto: TourPhoto | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Datei ist zu groß (max. 8 MB).');
      input.value = '';
      return;
    }

    const caption = window.prompt('Bildunterschrift (optional):') ?? '';
    this.vm.uploadPhoto(file, caption.trim() || undefined);
    input.value = '';
  }

  openLightbox(photo: TourPhoto): void {
    this.lightboxPhoto = photo;
  }

  closeLightbox(): void {
    this.lightboxPhoto = null;
  }

  handleDelete(photoId: string | undefined, event: Event): void {
    event.stopPropagation();
    if (!photoId) return;
    if (confirm('Foto wirklich löschen?')) {
      this.vm.deletePhoto(photoId);
    }
  }
}