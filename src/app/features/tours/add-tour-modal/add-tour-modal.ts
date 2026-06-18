import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
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
export class AddTourModal implements OnChanges {
  readonly transportOptions = TRANSPORT_OPTIONS;

  @Input() isOpen = false;
  /** Pass a Tour to open the modal in Edit mode; null = Create mode. */
  @Input() editTour: Tour | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TourPayload>();

  form: TourPayload = this.emptyForm();

  ngOnChanges(): void {
    if (this.editTour) {
      this.form = {
        name: this.editTour.name,
        description: this.editTour.description,
        from: this.editTour.from,
        to: this.editTour.to,
        transport: this.editTour.transportType,
        imageUrl: this.editTour.imageUrl ?? '',
      };
    } else {
      this.form = this.emptyForm();
    }
  }

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
    this.closeModal();
  }
}
