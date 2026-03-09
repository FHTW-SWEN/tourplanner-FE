import { Component, Input } from '@angular/core'
import type { Tour } from '../../../core/models/tour.model'
import { DurationPipe } from '../../../duration-pipe'

@Component({
    selector: 'tour-card',
    standalone: true,
    templateUrl: './tour-card.html',
    imports: [ DurationPipe ]
})
export class TourCard {
  @Input() tour!: Tour
}