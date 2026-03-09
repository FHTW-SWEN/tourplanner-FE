import { Component, Input, inject } from '@angular/core'
import type { Tour } from '../../../core/models/tour.model'
import { DurationPipe } from '../../../duration-pipe'
import { ToursViewModel } from '../tours.viewmodel'

@Component({
    selector: 'tour-card',
    standalone: true,
    templateUrl: './tour-card.html',
    imports: [ DurationPipe ]
})
export class TourCard {
  @Input() tour!: Tour
  vm = inject(ToursViewModel)
}