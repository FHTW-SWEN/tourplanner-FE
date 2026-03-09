import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TourCard } from '../tour-card/tour-card';
import { ToursViewModel } from './tour-list.viewmodel';

@Component ({
    selector: 'tour-list',
    standalone: true,
    templateUrl: './tour-list.html',
    imports: [CommonModule, TourCard]
})
export class TourList {
    constructor(public vm: ToursViewModel) {}
}