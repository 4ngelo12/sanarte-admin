import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { INewPersonal } from '@app/core/interfaces/Personal';
import { IService } from '@app/core/interfaces/Services';
import { AlertsService } from '@app/core/services/alerts.service';
import { CategoryService } from '@app/core/services/category.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { PersonalService } from '@app/core/services/personal.service';
import { ServiceService } from '@app/core/services/service.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './create.component.html',
  styles: ``
})
export default class CreateComponent implements OnInit{
  PersonalForm!: FormGroup;
  PersonalData: INewPersonal = {} as INewPersonal;
  serviceData: IService[] = [];

  constructor(private personalService: PersonalService, private serviceSrv: ServiceService,
    private alertService: AlertsService, private lsService: LocalstorageService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();

    if (tokenValidate) {
      window.location.reload();
    }

    this.getServiceData();

    this.PersonalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^[9]\d{8}$/)]],
      service_id: ['', [Validators.required]],
    });
  }

  getServiceData() {
    this.serviceSrv.getServiceActive().subscribe({
      next: (data: any) => {
        this.serviceData = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  submitService() {
    if (this.PersonalForm.invalid) {
      this.alertService.error(undefined, 'Formulario invalido, por favor llene los campos requeridos');
      return;
    }

    this.PersonalData = this.PersonalForm.value;
    this.personalService.newPersonal(this.PersonalData).subscribe({
      next: (resp: any) => {
        this.PersonalForm.reset();
        this.alertService.success(resp.message);
      },
      error: (err: any) => {
        this.alertService.error(undefined, err.error.message);
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

  get service_id() {
    return this.PersonalForm.get('service_id') as FormGroup;
  }
}
