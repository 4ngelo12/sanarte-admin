import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from '@app/app.routes';
import { LocalstorageService } from '@app/core/services/localstorage.service';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {
  collapsed = false;
  isSelected = false;
  public menuItems = routes.filter(route => route.path === 'dashboard')
    .map(route => route.children ?? [])
    .flat()
    .filter(route => route && route.path)

  constructor(private lsService: LocalstorageService) {
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  logout(): void {
    // logout logic
    this.lsService.deleteToken();
    location.reload();
  }
}
