import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '@app/core/interfaces/auth/Login';
import { AlertsService } from '@app/core/services/alerts.service';
import { AuthService } from '@app/core/services/auth.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styles: ``
})
export default class LoginComponent implements OnInit {
  Loginform!: FormGroup;
  loginData: Login = {} as Login;

  constructor(private authService: AuthService, private lsService: LocalstorageService, private alertService: AlertsService,
    private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.Loginform = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  loginSubmit() {
    if (this.Loginform.invalid) {
      this.alertService.error('Acceso no autorizado', 'Por favor, llena los campos requeridos');
      return;
    }

    this.loginData = this.Loginform.value;
    this.authService.login(this.loginData).subscribe({
      next: (resp: any) => {
        this.lsService.setToken(resp.token);
      },
      complete: () => {
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.alertService.error('Acceso no Autorizado', err.error.message);
      }
    });
  }

  // Validaciones de formulario

  get email() {
    return this.Loginform.get('email') as FormGroup;
  }

  get password() {
    return this.Loginform.get('password') as FormGroup;
  }
}
