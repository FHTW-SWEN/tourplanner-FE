import { signal } from '@angular/core';

type Item = {
  id: number;
  title: string;
  description: string;
};

export class SelectableItemsViewModel {
  items = signal<Item[]>([]);
  // TODO: make selected item computed
  selectedItem = signal<Item | null>(null);

  addNewItem() {
    const newItem: Item = {
      id: this.items().length + 1,
      title: 'New Item',
      description: 'This is a new item',
    };
    this.items.update((items) => [...items, newItem]);
  }

  selectItem(id: number) {
    this.selectedItem.set(this.items().find((item) => item.id == id) ?? null);
  }
}
