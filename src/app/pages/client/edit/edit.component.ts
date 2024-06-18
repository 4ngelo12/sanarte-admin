import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IClient } from '@app/core/interfaces/Clients';
import { AlertsService } from '@app/core/services/alerts.service';
import { ClientService } from '@app/core/services/client.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import SpinnerComponent from '@app/shared/spinner/spinner.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, SpinnerComponent],
  templateUrl: './edit.component.html',
  styles: ``
})
export default class EditComponent implements OnInit {
  clientform!: FormGroup;
  clientData: IClient = {} as IClient;
  idClient: string = this.router.url.split('/')[3];

  constructor(private clientService: ClientService, private lsService: LocalstorageService,
    private alertService: AlertsService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();
    if (tokenValidate) {
      window.location.reload();
    }

    this.clientform = this.fb.group({
      id: [this.idClient],
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^[9]\d{8}$/)]],
    });

    this.getClientDataById(this.idClient);
  }

  getClientDataById(id: string) {
    this.clientService.getClientById(id).subscribe({
      next: (data: any) => {
        this.clientform.patchValue(data.data);
      },
      error: (error) => {
        this.alertService.error(undefined, error.error.message);
        this.router.navigate(['/clientes']);
      }
    });
  }

  clientUpdate() {
    if (this.clientform.invalid) {
      this.alertService.error(undefined, 'Formulario invalido, por favor llene los campos requeridos');
      return;
    }

    this.clientData = this.clientform.value;
    this.clientService.updateClient(this.clientData).subscribe({
      next: (resp: any) => {
        this.alertService.success(resp.message);
        this.clientform.reset();
      },
      complete: () => {
        this.router.navigate(['/clientes']);
      },
      error: (err: any) => {
        this.alertService.error(undefined, 'Hubo un problema al actualizar la categoría, por favor intente de nuevo');
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
    return this.clientform.get('name') as FormGroup;
  }

  get lastname() {
    return this.clientform.get('lastname') as FormGroup;
  }

  get email() {
    return this.clientform.get('email') as FormGroup;
  }

  get phone() {
    return this.clientform.get('phone') as FormGroup;
  }
}
