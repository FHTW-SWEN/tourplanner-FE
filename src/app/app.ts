import { Component, signal } from '@angular/core';
import { ItemList } from '../components/selectable-items/item-list';

@Component({
  selector: 'app-root',
  imports: [ItemList],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('SWEN1');
}
