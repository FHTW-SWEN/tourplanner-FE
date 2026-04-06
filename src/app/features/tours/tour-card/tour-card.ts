import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import type { Tour } from '../../../core/models/tour.model';
import { transportLabel } from '../../../core/constants/tour-transport';
import { DurationPipe } from '../../../duration-pipe';
import { ToursViewModel } from '../tours.viewmodel';

@Component({
    selector: 'tour-card',
    standalone: true,
    templateUrl: './tour-card.html',
    imports: [ DurationPipe, CommonModule ],
})
export class TourCard {
  @Input() tour!: Tour;
  @Output() edit = new EventEmitter<Tour>();
  @Output() delete = new EventEmitter<string>();

  vm = inject(ToursViewModel);

  get isSelected() {
    return this.vm.selectedTour()?.id === this.tour.id
  }

  selectTour() {
    this.vm.selectTour(this.tour);
  }

  labelTransport(code: string): string {
    return transportLabel(code);
  }
}