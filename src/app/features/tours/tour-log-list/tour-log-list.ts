import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToursViewModel } from '../tours.viewmodel';
import { TourLogCard } from '../tour-log-card/tour-log-card';
import { AddTourLogModal } from '../add-tour-log-modal/add-tour-log-modal';
import type { TourLog } from '../../../core/models/index';

@Component({
  selector: 'app-tour-log-list',
  standalone: true,
  imports: [CommonModule, TourLogCard, AddTourLogModal],
  templateUrl: './tour-log-list.html',
})
export class TourLogList {
  vm = inject(ToursViewModel);

  isModalOpen = false;
  editLog: TourLog | null = null;

  openAdd(): void {
    this.editLog = null;
    this.isModalOpen = true;
  }

  openEdit(log: TourLog): void {
    this.editLog = log;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editLog = null;
  }

  handleSave(log: TourLog): void {
    if (log.id) {
      this.vm.updateTourLog(log);
    } else {
      this.vm.addTourLog(log);
    }
  }

  handleDelete(id: string | undefined): void {
    if (id) this.vm.deleteTourLog(id);
  }
}
