import { Component, EventEmitter, Output, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TourCard } from '../tour-card/tour-card';
import { ToursViewModel } from '../tours.viewmodel';
import type { Tour } from '../../../core/models/index';

@Component ({
    selector: 'tour-list',
    standalone: true,
    templateUrl: './tour-list.html',
    imports: [CommonModule, TourCard]
})
export class TourList {
    vm = inject(ToursViewModel);
    @Output() editTour = new EventEmitter<Tour>();

    handleDelete(id: string | undefined): void {
      if (id) this.vm.deleteTour(id);
    }
}