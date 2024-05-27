import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import LoginComponent from './pages/login/login.component';
import RegisterComponent from './pages/register/register.component';
import { routes } from '../app.routes';

@Component({
  standalone: true,
  imports: [RouterModule, LoginComponent, RegisterComponent],
  templateUrl: './auth.component.html',
  styles: ``
})
export default class AuthComponent {
  public authRoutes = routes.map(route => route.children ?? [])
    .flat().filter(route => route && route.path);

  constructor() {


  }

}
