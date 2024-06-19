import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IRoles } from '@app/core/interfaces/Roles';
import { IUserUpdate } from '@app/core/interfaces/Usuarios';
import { AlertsService } from '@app/core/services/alerts.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { RoleService } from '@app/core/services/role.service';
import { UsersService } from '@app/core/services/users.service';
import SpinnerComponent from '@app/shared/spinner/spinner.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, SpinnerComponent],
  templateUrl: './edit.component.html',
  styles: ``
})
export default class EditComponent implements OnInit {
  UpdateForm!: FormGroup;
  userUpdData: IUserUpdate = {} as IUserUpdate;
  rolesData!: IRoles[];
  idUser: string = this.router.url.split('/')[3];

  constructor(private userService: UsersService, private lsService: LocalstorageService,
    private alertService: AlertsService, private rolesService: RoleService,
    private router: Router, private fb: FormBuilder) { }

  async ngOnInit(): Promise<void> {
    const tokenValidate = this.lsService.validateToken();

    if (tokenValidate) {
      window.location.reload();
    }

    await this.initializeForm();
    await this.getRoles();
  }

  async initializeForm(): Promise<void> {
    this.UpdateForm = this.fb.group({
      id: [this.idUser],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      state: ['', [Validators.required]],
      role_id: ['', [Validators.required]],
    });

    await this.getUsersDataById(this.idUser);
  }

  getUsersDataById(id: string) {
    this.userService.getUserId(id).subscribe({
      next: (data: any) => {
        const datos = data.data;
        this.UpdateForm.patchValue(datos);
      },
      error: (error) => {
        this.alertService.error(undefined, error.error.message);
        this.router.navigate(['/usuarios']);
      }
    });
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
    if (this.UpdateForm.invalid) {
      this.alertService.error(undefined, 'Formulario invalido, por favor llene los campos requeridos');
      return;
    }

    this.userUpdData = this.UpdateForm.value;
    this.userService.updateUser(this.userUpdData).subscribe({
      next: (data: any) => {
        this.alertService.success(data.message);
        this.router.navigate(['/usuarios']);
      },
      error: (error) => {
        this.alertService.error(undefined, error.error.message);
      }
    });
  }

  get name() {
    return this.UpdateForm.get('name') as FormGroup;
  }

  get email() {
    return this.UpdateForm.get('email') as FormGroup;
  }

  get state() {
    return this.UpdateForm.get('state') as FormGroup;
  }

  get role_id() {
    return this.UpdateForm.get('role_id') as FormGroup;
  }
}
