import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DurationPipe } from '../../../duration-pipe';
import type { TourLog } from '../../../core/models/index';

@Component({
  selector: 'app-tour-log-card',
  standalone: true,
  imports: [CommonModule, DurationPipe],
  templateUrl: './tour-log-card.html',
})
export class TourLogCard {
  @Input() log!: TourLog;
  @Output() edit = new EventEmitter<TourLog>();
  @Output() delete = new EventEmitter<string>();

  difficultyLabel(d: number): string {
    return ['', 'Easy', 'Moderate', 'Hard', 'Very Hard', 'Extreme'][d] ?? '';
  }

  stars(n: number): string {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }
}
