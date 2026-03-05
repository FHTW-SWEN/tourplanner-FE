import { Component, inject } from '@angular/core';
import { SelectableItemsViewModel } from './selectable-items.vm';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.html',
  providers: [SelectableItemsViewModel],
})
export class ItemList {
  vm = inject(SelectableItemsViewModel);
}
