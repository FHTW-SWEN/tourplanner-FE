import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
})
export class Header {
  protected readonly userName = 'Max Mustermann';

  protected onLogout(): void {
    // TODO: implement logout
  }
}
