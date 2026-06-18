import { Routes } from '@angular/router';
import { ToursPage } from './features/tours/tours-page/tours-page';
import { AuthPage } from './features/tours/auth/auth-page';
import { authGuard } from './core/services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/tours', pathMatch: 'full' },
  { path: 'login', component: AuthPage },
  { path: 'tours', component: ToursPage, canActivate: [authGuard] },
];
