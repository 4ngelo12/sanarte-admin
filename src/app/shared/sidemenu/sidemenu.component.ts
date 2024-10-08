import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { routes } from '@app/app.routes';
import { ShowForRoleDirective } from '@app/core/directives/show-for-role.directive';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [CommonModule, RouterModule, ShowForRoleDirective],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.scss'
})
export class SidemenuComponent {
  collapsed = true;
  isSelected = false;
  showRoute!: boolean;
  public menuItems = routes.filter(route => route.path !== 'auth' && route.path !== '')
    .map(route => ({
      ...route,
      icon: (route.data?.['icon'] ?? 'info') // Ícono predeterminado si no se especifica
    }))
    .flat();

  public menu = routes.filter(route =>
    route.path !== 'auth' &&
    route.path !== '' &&
    route.data &&
    route.data['allowedRoles'] &&
    Array.isArray(route.data['allowedRoles'])
  ).map(route => ({
    ...route,
    icon: (route.data?.['icon'] ?? 'info') // Ícono predeterminado si no se especifica
  }))
    .flat();

  public routesNotInMenu = routes.filter(route =>
    route.path !== 'auth' && route.path!.trim() !== '' && // Verificar que el path no esté vacío
    !(route.data &&
      route.data['allowedRoles'] &&
      Array.isArray(route.data['allowedRoles']))
  );

  // Comparar el tamaño de la pantalla
  private breakpointObserver = inject(BreakpointObserver);
  private isMobile$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  isMobile = toSignal(this.isMobile$, { initialValue: false });


  constructor(private lsService: LocalstorageService, private router: Router, private route: ActivatedRoute) {
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  toggleHover(event: boolean) {
    this.showRoute = event;
  }

  logout(): void {
    // logout logic
    this.lsService.deleteToken();
    location.reload();
  }

  isRouteActive(path: string): boolean {
    return this.router.url.includes(path);
  }
}
