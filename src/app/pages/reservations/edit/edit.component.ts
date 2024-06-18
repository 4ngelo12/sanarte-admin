import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IClient } from '@app/core/interfaces/Clients';
import { IReservation } from '@app/core/interfaces/Reservations';
import { IService } from '@app/core/interfaces/Services';
import { IStatus } from '@app/core/interfaces/Status';
import { ClientService } from '@app/core/services/client.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { ReservationService } from '@app/core/services/reservation.service';
import { ServiceService } from '@app/core/services/service.service';
import { StatusService } from '@app/core/services/status.service';
import SpinnerComponent from '@app/shared/spinner/spinner.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, SpinnerComponent, CommonModule],
  templateUrl: './edit.component.html',
  styles: ``
})
export default class EditComponent {
  reservationForm!: FormGroup;
  isFormInitialized: boolean = false;
  reservationData: IReservation = {} as IReservation;
  clientsData!: IClient[];
  servicesData!: IService[];
  statusData!: IStatus[];
  reservationId: string = this.router.url.split('/')[3];

  constructor(private reservationService: ReservationService, private clientService: ClientService,
    private statusService: StatusService,
    private serviceService: ServiceService, private lsService: LocalstorageService,
    private router: Router, private fb: FormBuilder) { }

  async ngOnInit(): Promise<void> {
    const tokenValidate = this.lsService.validateToken();
    if (tokenValidate) {
      window.location.reload();
    }

    await this.getClients();
    await this.getStatus();
    await this.getServices();
    
    await this.initializeForm();
  }

  async initializeForm(): Promise<void> {
    this.reservationForm = this.fb.group({
      id: [this.reservationId],
      date_reservation: ['',
        [Validators.required,
        Validators.pattern(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/)]],
      time_reservation: ['',
        [Validators.required,
        Validators.pattern(/^([0-1]{1}\d{1}:[0-5]{1}\d{1})$|^([2]{1}[0-3]{1}:[0-5]{1}\d{1})$/)]],
      service_id: [{ value: '', disabled: true }],
      client_id: [{ value: '', disabled: true }],
      status_id: ['', [Validators.required]]
    });

    await this.getReservationDataById(this.reservationId);    
  }

  async getReservationDataById(id: string) {
    this.reservationService.getReservationById(id).subscribe({
      next: (data: any) => {
        this.reservationForm.patchValue(data.data);
        if (data.data.status_id === 3) {
          console.log('No se puede editar una reserva cancelada');
        }
        this.isFormInitialized = true;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  async getClients() {
    this.clientService.getClients().subscribe({
      next: (data: any) => {
        this.clientsData = data.data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  async getServices() {
    this.serviceService.getServices().subscribe({
      next: (data: any) => {
        this.servicesData = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  async getStatus() {
    this.statusService.getStatus().subscribe({
      next: (data: any) => {
        this.statusData = data.data;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  reservationUpdate(): void {
    if (this.reservationForm.invalid) {
      return;
    }

    if (this.reservationForm.value.date_reservation <= new Date().toISOString().split('T')[0]) {
      console.log('La fecha de la reserva no puede ser menor ni la fecha actual');
      return;
    }

    this.reservationData = this.reservationForm.value;
    this.reservationService.updateReservation(this.reservationData).subscribe({
      next: (resp: any) => {
        console.log(resp);
      },
      complete: () => {
        this.router.navigate(['/reservas']);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  // Validaciones del formulario

  get date_reservation() {
    return this.reservationForm.get('date_reservation') as FormGroup;
  }

  get time_reservation() {
    return this.reservationForm.get('time_reservation') as FormGroup;
  }

  get service_id() {
    return this.reservationForm.get('service_id') as FormGroup;
  }

  get client_id() {
    return this.reservationForm.get('client_id') as FormGroup;
  }

  get status_id() {
    return this.reservationForm.get('status_id') as FormGroup;
  }
}
