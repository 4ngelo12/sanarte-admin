import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import RegisterComponent from './pages/register/register.component';
import LoginComponent from './pages/login/login.component';

@Component({
  standalone: true,
  imports: [RouterModule, LoginComponent, RegisterComponent],
  templateUrl: './auth.component.html',
  styles: ``
})
export default class AuthComponent {

  constructor() {


  }

}
