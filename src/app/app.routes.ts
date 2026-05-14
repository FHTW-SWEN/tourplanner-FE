import { Routes } from '@angular/router';
import { ToursPage } from './features/tours/tours-page/tours-page';

export const routes: Routes = [
  { path: '', redirectTo: '/tours', pathMatch: 'full' },
  { path: 'tours', component: ToursPage },
];
