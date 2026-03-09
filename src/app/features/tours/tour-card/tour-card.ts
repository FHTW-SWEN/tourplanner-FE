import { Component, Input, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import type { Tour } from '../../../core/models/tour.model'
import { DurationPipe } from '../../../duration-pipe'
import { ToursViewModel } from '../tours.viewmodel'

@Component({
    selector: 'tour-card',
    standalone: true,
    templateUrl: './tour-card.html',
    imports: [ DurationPipe, CommonModule ],
})
export class TourCard {
  @Input() tour!: Tour
  vm = inject(ToursViewModel)

  get isSelected() {
    return this.vm.selectedTour()?.id === this.tour.id
  }

  selectTour(tour: Tour) {
    this.vm.selectTour(tour)
  }
}