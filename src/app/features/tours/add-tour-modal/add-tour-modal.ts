import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

export interface NewTourPayload {
  name: string;
  description: string;
  from: string;
  to: string;
  transport: string;
}

@Component({
  selector: 'app-add-tour-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-tour-modal.html',
})
export class AddTourModal {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<NewTourPayload>();

  newTour: NewTourPayload = {
    name: '',
    description: '',
    from: '',
    to: '',
    transport: 'Bike',
  };

  closeModal(): void {
    this.isOpen = false;
    this.close.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.newTour = {
      name: '',
      description: '',
      from: '',
      to: '',
      transport: 'Bike',
    };
  }

  submitTour(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    this.save.emit({ ...this.newTour });
    this.closeModal();
  }
}
