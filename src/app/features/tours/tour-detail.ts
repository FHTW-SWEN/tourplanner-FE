import { Component } from '@angular/core';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  host: { class: 'min-h-0 flex-1' },
  template: `
    <section class="h-full min-h-0 overflow-auto p-4">
      <div>Tour detail</div>
    </section>
  `,
})
export class TourDetail {}
