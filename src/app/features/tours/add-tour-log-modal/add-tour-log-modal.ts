import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { TourLog } from '../../../core/models/index';

@Component({
  selector: 'app-add-tour-log-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-tour-log-modal.html',
})
export class AddTourLogModal implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() tourId = '';
  @Input() editLog: TourLog | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TourLog>();

  form = this.fb.nonNullable.group({
    dateTime: ['', Validators.required],
    comment: [''],
    totalDistance: [0, [Validators.required, Validators.min(0)]],
    totalTime: [0, [Validators.required, Validators.min(0)]],
    difficulty: [1, Validators.required],
    rating: [3, Validators.required],
  });

  ngOnChanges(): void {
    if (!this.isOpen) return;

    if (this.editLog) {
      this.form.patchValue({
        dateTime: this.editLog.dateTime,
        comment: this.editLog.comment,
        totalDistance: this.editLog.totalDistance,
        totalTime: this.editLog.totalTime,
        difficulty: this.editLog.difficulty,
        rating: this.editLog.rating,
      });
    } else {
      this.form.reset({
        dateTime: new Date().toISOString().slice(0, 16),
        comment: '',
        totalDistance: 0,
        totalTime: 0,
        difficulty: 1,
        rating: 3,
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const payload: TourLog = this.editLog?.id
      ? { ...v, id: this.editLog.id, tourId: this.tourId }
      : { ...v, tourId: this.tourId };
    this.save.emit(payload);
    this.closeModal();
  }

  closeModal(): void {
    this.close.emit();
  }
}
