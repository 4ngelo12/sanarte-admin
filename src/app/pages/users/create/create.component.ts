import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IRoles } from '@app/core/interfaces/Roles';
import { IRegistration } from '@app/core/interfaces/auth/Registration';
import { AlertsService } from '@app/core/services/alerts.service';
import { AuthService } from '@app/core/services/auth.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { RoleService } from '@app/core/services/role.service';
@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './create.component.html',
  styles: ``
})
export default class CreateComponent implements OnInit {
  Registrationform!: FormGroup;
  registrationData: IRegistration = {} as IRegistration;
  rolesData!: IRoles[];

  constructor(private authService: AuthService, private lsService: LocalstorageService,
    private alertService: AlertsService, private rolesService: RoleService, private fb: FormBuilder) { }

  async ngOnInit(): Promise<void> {
    this.Registrationform = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role_id: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    await this.getRoles();
  }

  async getRoles(): Promise<void> {
    this.rolesService.getRoles().subscribe({
      next: (data: any) => {
        this.rolesData = data.data;
      },
      error: (error) => {
        this.alertService.error(undefined, error.error.message);
      }
    });
  }

  registerSubmit(): void {
    if (this.Registrationform.invalid) {
      this.alertService.error(undefined, 'Formulario invalido, por favor llene los campos requeridos');
      return;
    }

    if (this.Registrationform.value.password !== this.Registrationform.value.repeatPassword) {
      this.alertService.error(undefined, 'Las contraseñas no coinciden');
      return;
    }

    this.registrationData = this.Registrationform.value;
    this.authService.regitration(this.registrationData).subscribe({
      next: (data: any) => {
        this.Registrationform.reset();
        this.alertService.success(data.message);
      },
      error: (error) => {
        this.alertService.error(undefined, error.error.message);
      }
    });
  }

  get name() {
    return this.Registrationform.get('name') as FormGroup;
  }

  get email() {
    return this.Registrationform.get('email') as FormGroup;
  }
  
  get role_id() {
    return this.Registrationform.get('role_id') as FormGroup;
  }

  get password() {
    return this.Registrationform.get('password') as FormGroup;
  }

  get repeatPassword() {
    return this.Registrationform.get('repeatPassword') as FormGroup;
  }
}
