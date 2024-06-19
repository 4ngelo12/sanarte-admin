import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IRegistration } from '@app/core/interfaces/auth/Registration';
import { AlertsService } from '@app/core/services/alerts.service';
import { AuthService } from '@app/core/services/auth.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { repeat } from 'rxjs';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styles: ``
})
export default class RegisterComponent implements OnInit {
  Registrationform!: FormGroup;
  registrationData: IRegistration = {} as IRegistration;

  constructor(private authService: AuthService, private lsService: LocalstorageService,
    private alertService: AlertsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.Registrationform = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registerSubmit(): void {

  }

  get name() {
    return this.Registrationform.get('name') as FormGroup;
  }

  get email() {
    return this.Registrationform.get('email') as FormGroup;
  }

  get password() {
    return this.Registrationform.get('password') as FormGroup;
  }

  get repeatPassword() {
    return this.Registrationform.get('repeatPassword') as FormGroup;
  }
}
