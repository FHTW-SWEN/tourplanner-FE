import { Component } from '@angular/core';

@Component({
  selector: 'app-tour-sidebar',
  standalone: true,
  host: { class: 'flex h-full shrink-0 flex-col' },
  template: `
    <aside class="flex min-h-0 w-72 flex-1 flex-col border-r border-secondary-light p-4">
      <div class="text-secondary">Tour sidebar</div>
    </aside>
  `,
})
export class TourSidebar {}
