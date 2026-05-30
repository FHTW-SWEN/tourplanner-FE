import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
})
export class Header {
  protected authService = inject(AuthService);

  protected onLogout(): void {
    this.authService.logout();
  }
}