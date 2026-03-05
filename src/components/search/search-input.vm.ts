import { computed, Injectable, signal } from '@angular/core';

@Injectable()
export class SearchInputViewModel {
  query = signal<string>('');

  isSearchEnabled = computed<boolean>(() => this.query().trim().length > 0);

  setQuery(value: string) {
    this.query.set(value);
  }
}
