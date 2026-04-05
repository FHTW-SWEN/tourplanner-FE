import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import type { TourLog } from '../../../core/models/index';

@Component({
  selector: 'app-add-tour-log-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-tour-log-modal.html',
})
export class AddTourLogModal implements OnChanges {
  @Input() isOpen = false;
  @Input() tourId!: string;
  @Input() editLog: TourLog | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TourLog>();

  form: Omit<TourLog, 'id'> = this.emptyForm();

  ngOnChanges(): void {
    if (this.editLog) {
      this.form = { ...this.editLog };
    } else {
      this.form = this.emptyForm();
    }
  }

  private emptyForm(): Omit<TourLog, 'id'> {
    return {
      tourId: this.tourId ?? '',
      dateTime: new Date().toISOString().slice(0, 16),
      comment: '',
      difficulty: 1,
      totalDistance: 0,
      totalTime: 0,
      rating: 3,
    };
  }

  submit(ngForm: NgForm): void {
    if (!ngForm.valid) return;
    const payload: TourLog = this.editLog?.id
      ? { ...this.form, id: this.editLog.id }
      : { ...this.form, tourId: this.tourId };
    this.save.emit(payload);
    this.closeModal();
  }

  closeModal(): void {
    this.close.emit();
  }
}
