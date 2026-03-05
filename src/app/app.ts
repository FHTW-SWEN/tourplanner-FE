import { Component, signal } from '@angular/core';
import { SearchInput } from '../components/search/search-input';
import { ItemList } from '../components/selectable-items/item-list';
import { ThreeValues } from '../components/three-values/three-values';

@Component({
  selector: 'app-root',
  imports: [SearchInput, ThreeValues, ItemList],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('SWEN1');
}
