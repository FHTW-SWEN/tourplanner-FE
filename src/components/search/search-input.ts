import { Component, inject } from '@angular/core';
import { SearchInputViewModel } from './search-input.vm';

@Component({
  selector: 'search-input',
  templateUrl: './search-input.html',
  providers: [SearchInputViewModel],
})
export class SearchInput {
  vm = inject(SearchInputViewModel);
}
