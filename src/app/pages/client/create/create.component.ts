import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { INewClient } from '@app/core/interfaces/Clients';
import { ClientService } from '@app/core/services/client.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './create.component.html',
  styles: ``
})
export default class CreateComponent implements OnInit {
  clientform!: FormGroup;
  clientData: INewClient = {} as INewClient;

  constructor(private clientService: ClientService, private lsService: LocalstorageService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();
    if (tokenValidate) {
      window.location.reload();
    }

    this.clientform = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(/^[9]\d{8}$/)]],
    });
  }

  clientSubmit() {
    if (this.clientform.invalid) {
      return;
    }

    this.clientData = this.clientform.value;
    this.clientService.newClient(this.clientData).subscribe({
      next: (resp: any) => {
        this.clientform.reset();
        console.log(resp);
      },
      complete: () => {
        console.log('Client created');
      },
      error: (err: any) => {
        console.log(err);
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
