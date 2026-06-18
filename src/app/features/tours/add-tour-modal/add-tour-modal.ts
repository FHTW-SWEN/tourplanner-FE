import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import type { Tour } from '../../../core/models/index';
import { TRANSPORT_OPTIONS } from '../../../core/constants/tour-transport';

export interface TourPayload {
  name: string;
  description: string;
  from: string;
  to: string;
  transport: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-add-tour-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-tour-modal.html',
})
export class AddTourModal {
  readonly transportOptions = TRANSPORT_OPTIONS;

  @Input() isOpen = false;
  /** Pass a Tour to open the modal in Edit mode; null = Create mode. */
  @Input() set editTour(tour: Tour | null) {
    this.currentEditTour = tour;
    this.form = tour
      ? {
          name: tour.name,
          description: tour.description,
          from: tour.from,
          to: tour.to,
          transport: tour.transportType,
          imageUrl: tour.imageUrl ?? '',
        }
      : this.emptyForm();
  }
  get editTour(): Tour | null {
    return this.currentEditTour;
  }
  @Input() errorMessage = '';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TourPayload>();

  private currentEditTour: Tour | null = null;
  form: TourPayload = this.emptyForm();

  private emptyForm(): TourPayload {
    return { name: '', description: '', from: '', to: '', transport: 'walk', imageUrl: '' };
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.form.imageUrl = URL.createObjectURL(file);
    }
  }

  closeModal(): void {
    this.close.emit();
    this.form = this.emptyForm();
  }

  submitTour(form: NgForm): void {
    if (!form.valid) return;
    this.save.emit({ ...this.form });
  }
}
