import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IClient } from '@app/core/interfaces/Clients';
import { INewReservation } from '@app/core/interfaces/Reservations';
import { IService } from '@app/core/interfaces/Services';
import { AlertsService } from '@app/core/services/alerts.service';
import { ClientService } from '@app/core/services/client.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { ReservationService } from '@app/core/services/reservation.service';
import { ServiceService } from '@app/core/services/service.service';
import { UsersService } from '@app/core/services/users.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './create.component.html',
  styles: ``
})
export default class CreateComponent implements OnInit {
  reservationForm!: FormGroup;
  reservationData: INewReservation = {} as INewReservation;
  clientsData!: IClient[];
  servicesData!: IService[];

  constructor(private reservationService: ReservationService, private clientService: ClientService,
    private userService: UsersService, private serviceService: ServiceService, private lsService: LocalstorageService,
    private alertService: AlertsService, private fb: FormBuilder) { }

  async ngOnInit(): Promise<void> {
    const tokenValidate = this.lsService.validateToken();
    if (tokenValidate) {
      window.location.reload();
    }

    this.reservationForm = this.fb.group({
      date_reservation: ['', [Validators.required,
      Validators.pattern(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/)]],
      time_reservation: ['', [Validators.required,
      Validators.pattern(/^([0-1]{1}\d{1}:[0-5]{1}\d{1})$|^([2]{1}[0-3]{1}:[0-5]{1}\d{1})$/)]],
      service_id: ['', [Validators.required]],
      client_id: ['', [Validators.required]],
    });

    await this.getServices();
    await this.getClients();
  }

  async getClients(): Promise<void> {
    this.clientService.getClients().subscribe({
      next: (data: any) => {
        this.clientsData = data.data;
      },
      error: (error) => {
        this.alertService.error(undefined, error.error.message);
      }
    });
  }

  async getServices(): Promise<void> {
    this.serviceService.getServices().subscribe({
      next: (data: any) => {
        this.servicesData = data;
      },
      error: (error) => {
        this.alertService.error(undefined, error.error.message);
      }
    });
  }

  reservationSubmit(): void {
    if (this.reservationForm.invalid) {
      return;
    }

    const user = this.lsService.getUserInfo();

    if (user?.sub !== undefined) {
      this.userService.getUserId(user?.sub.toString());
    } else {
      this.alertService.error(undefined, 'No se pudo obtener el usuario');
      return;
    }

    if (this.reservationForm.value.date_reservation <= new Date().toISOString().split('T')[0]) {
      this.alertService.error(undefined, 'La fecha de la reserva no puede ser menor ni igual a la fecha actual');
      return;
    }

    this.reservationData = this.reservationForm.value;
    this.reservationData.user_id = parseInt(user?.sub);

    this.reservationService.newReservation(this.reservationData).subscribe({
      next: (data: any) => {
        this.alertService.success(data.message);
        this.reservationForm.reset();
      },
      error: (error) => {
        this.alertService.error(undefined, error.error.message);
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
}
