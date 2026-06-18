import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { TourList } from '../tour-list/tour-list';
import { AddTourModal, TourPayload } from '../add-tour-modal/add-tour-modal';
import { ToursViewModel } from '../tours.viewmodel';
import type { Tour } from '../../../core/models/index';
import { TourApiService } from '../../../core/services/tour-api.service';
import type { TourDataExport } from '../../../core/models/index';

@Component({
  selector: 'app-tour-sidebar',
  standalone: true,
  imports: [AddTourModal, TourList],
  host: { class: 'flex h-full shrink-0 flex-col' },
  templateUrl: './tour-sidebar.html',
})
export class TourSidebar {
  private vm = inject(ToursViewModel);
  private api = inject(TourApiService);

  @ViewChild('importFileInput') private importFileInput?: ElementRef<HTMLInputElement>;

  isModalOpen = false;
  editingTour: Tour | null = null;

  openAddTourModal(): void {
    this.editingTour = null;
    this.isModalOpen = true;
  }

  openEditTourModal(tour: Tour): void {
    this.editingTour = tour;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingTour = null;
  }

  exportTours(): void {
    this.api.exportTourData().subscribe({
      next: data => {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'tour-data-export.json';
        link.click();

        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('Export failed.');
      },
    });
  }

  openImportPicker(): void {
    this.importFileInput?.nativeElement.click();
  }

  importTours(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as TourDataExport;

        this.api.importTourData(data).subscribe({
          next: result => {
            alert(`Imported ${result.importedTours} tours and ${result.importedLogs} logs.`);
            this.vm.loadTours();
          },
          error: () => {
            alert('Import failed.');
          },
        });
      } catch {
        alert('Invalid JSON file.');
      }
    };

    reader.readAsText(file);
    input.value = '';
  }

  handleSaveTour(payload: TourPayload): void {
    const imageUrl = payload.imageUrl?.trim() || undefined;

    if (this.editingTour) {
      this.vm.updateTour({
        ...this.editingTour,
        name: payload.name,
        description: payload.description,
        from: payload.from,
        to: payload.to,
        transportType: payload.transport,
        imageUrl,
      });
    } else {
      this.vm.addTour({
        name: payload.name,
        description: payload.description,
        from: payload.from,
        to: payload.to,
        transportType: payload.transport,
        distance: 0,
        estimatedTime: 0,
        ...(imageUrl ? { imageUrl } : {}),
      });
    }

    this.closeModal();
  }
}
