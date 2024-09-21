import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IPersonal } from '@app/core/interfaces/Personal';
import { IService } from '@app/core/interfaces/Services';
import { AlertsService } from '@app/core/services/alerts.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { PersonalService } from '@app/core/services/personal.service';
import { ServiceService } from '@app/core/services/service.service';
import SpinnerComponent from '@app/shared/spinner/spinner.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, SpinnerComponent],
  templateUrl: './edit.component.html',
  styles: ''
})
export default class EditComponent implements OnInit {
  PersonalForm!: FormGroup;
  personalData: IPersonal = {} as IPersonal;
  serviceData: IService[] = [];
  idPersonal: string = this.router.url.split('/')[3];
  

  constructor(private personalService: PersonalService, private lsService: LocalstorageService, 
    private serviceSrv: ServiceService, private alertService: AlertsService, 
    private router: Router, private fb: FormBuilder) { }

  async ngOnInit(): Promise<void> {
    const tokenValidate = this.lsService.validateToken();
    if (tokenValidate) {
      window.location.reload();
    }

    this.PersonalForm = this.fb.group({
      id: [this.idPersonal],
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^[9]\d{8}$/)]],
      status: ['', [Validators.required]],
      service_id: ['', [Validators.required]],
    });

    this.getPersonalDataById(this.idPersonal);
    await this.getServiceData();
  }

  async getServiceData() {
    await this.serviceSrv.getServiceActive().subscribe({
      next: (data: any) => {
        this.serviceData = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getPersonalDataById(id: string) {
    this.personalService.getPersonalById(id).subscribe({
      next: (data: any) => {
        this.PersonalForm.patchValue(data.data);
      },
      error: (error) => {
        this.alertService.error(undefined, error.error.message);
        this.router.navigate(['/personal']);
      }
    });
  }

  clientUpdate() {
    if (this.PersonalForm.invalid) {
      this.alertService.error(undefined, 'Formulario invalido, por favor llene los campos requeridos');
      return;
    }

    this.personalData = this.PersonalForm.value;
    this.personalService.updatePersonal(this.personalData).subscribe({
      next: (resp: any) => {
        this.alertService.success(resp.message);
        this.PersonalForm.reset();
      },
      complete: () => {
        this.router.navigate(['/personal']);
      },
      error: (err: any) => {
        this.alertService.error(undefined, 'Hubo un problema al actualizar el cliente, por favor intente de nuevo');
      }
    });
  }

  // Validaciones del teclado
  onKeyPress(event: KeyboardEvent) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  // Validaciones del formulario

  get name() {
    return this.PersonalForm.get('name') as FormGroup;
  }

  get lastname() {
    return this.PersonalForm.get('lastname') as FormGroup;
  }

  get phone() {
    return this.PersonalForm.get('phone') as FormGroup;
  }

  get status() {
    return this.PersonalForm.get('status') as FormGroup;
  }

  get service_id() {
    return this.PersonalForm.get('service_id') as FormGroup;
  }
}
