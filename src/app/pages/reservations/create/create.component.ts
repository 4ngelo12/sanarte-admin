import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IClient } from '@app/core/interfaces/Clients';
import { IPersonal } from '@app/core/interfaces/Personal';
import { INewReservation, INewReservationCart, IReservation, IReservationCart } from '@app/core/interfaces/Reservations';
import { IService } from '@app/core/interfaces/Services';
import { AlertsService } from '@app/core/services/alerts.service';
import { ClientService } from '@app/core/services/client.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { PersonalService } from '@app/core/services/personal.service';
import { ReservationService } from '@app/core/services/reservation.service';
import { ServiceService } from '@app/core/services/service.service';
import { UsersService } from '@app/core/services/users.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export default class CreateComponent implements OnInit {
  reservationForm!: FormGroup;
  reservationData: INewReservation = {} as INewReservation;
  clientsData!: IClient[];
  servicesData!: IService[];
  personalData!: IPersonal[];
  reservationCart: IReservationCart[] = [];

  // Time Reservation
  minTime!: string;
  maxTime!: string;

  constructor(private reservationService: ReservationService, private clientService: ClientService,
    private userService: UsersService, private serviceService: ServiceService, private personalService: PersonalService,
    private lsService: LocalstorageService, private alertService: AlertsService, private fb: FormBuilder) { }

  async ngOnInit(): Promise<void> {
    const tokenValidate = this.lsService.validateToken();
    if (tokenValidate) {
      window.location.reload();
    }

    // Inicializar las restricciones de tiempo
    //this.setTimeConstraints();

    this.reservationForm = this.fb.group({
      date_reservation: ['', [Validators.required,
      Validators.pattern(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/)]],
      time_reservation: ['', [Validators.required,
      Validators.pattern(/^([0-1]{1}\d{1}:[0-5]{1}\d{1})$|^([2]{1}[0-3]{1}:[0-5]{1}\d{1})$/), this.timeValidator.bind(this)]],
      service_id: [0, [Validators.required]],
      service_name: [{ value: '', disabled: true }, [Validators.required]],
      personal_id: [{ value: 0, disabled: true }, [Validators.required]],
      personal_name: [{ value: '', disabled: true }, [Validators.required]],
      client_id: [0, [Validators.required]],
    });

    await this.getServices();
    await this.getClientActive();

    this.reservationForm.get('service_id')?.valueChanges.subscribe(selectedValue => {
      this.onOptionChange(selectedValue);
    });

    this.reservationCart = this.lsService.getReservationCart();
  }

  async getClientActive(): Promise<void> {
    this.clientService.getClients().subscribe({
      next: (data: any) => {
        this.clientsData = data;
      },
      error: (error) => {
        this.alertService.error(undefined, error.error.message);
      }
    });
  }

  async getServices(): Promise<void> {
    this.serviceService.getServiceActive().subscribe({
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

    if (this.reservationForm.value.date_reservation < new Date().toISOString().split('T')[0]) {
      this.alertService.error(undefined, 'La fecha de la reserva no puede ser menor ni igual a la fecha actual');
      return;
    }

    this.reservationData = this.reservationForm.value;
    const client = this.clientsData.find(
      client => client.id == this.reservationData.client_id
    );
    const service = this.servicesData.find(
      service => service.id == this.reservationData.service_id
    );
    const personal = this.personalData.find(
      personal => personal.id == this.reservationData.personal_id
    );

    this.reservationData.client_name = client ? `${client.name} ${client.lastname}` : '';
    this.reservationData.service_name = service ? service.name : '';
    this.reservationData.personal_name = personal ? `${personal.name} ${personal.lastname}` : '';
    this.reservationData.user_id = user?.sub;

    const reservationCartData: IReservationCart = {
      id: this.generateRandomCode(10),
      ...this.reservationData,
      duration: Math.max(...(Array.isArray(service?.duration) ? service?.duration : []))
    };

    // Validar la reserva
    const existingReservations = this.lsService.getReservationCart();
    if (!this.isReservationValid(reservationCartData, existingReservations)) {
      this.alertService.error(undefined, 'La reserva no es válida. Existe una reserva previa en el mismo horario');
      return;
    }

    this.lsService.insertReservationCart(reservationCartData);
    this.reservationCart = this.lsService.getReservationCart();

    this.reservationForm.reset();
  }

  saveReservation(): void {
    if (this.reservationCart.length === 0) {
      this.alertService.error(undefined, 'No hay reservas para guardar');
    }

    const newReservationCart: INewReservationCart = { reservations: this.reservationCart };

    this.reservationService.newReservation(newReservationCart).subscribe({
      next: (data: any) => {
        this.alertService.success(data.message);
        this.lsService.deleteReservationCartById('');
        this.reservationCart = this.lsService.getReservationCart();
      },
      complete: () => {
        this.lsService.deleteReservationCartAll();
        this.reservationCart = this.lsService.getReservationCart();
      },
      error: (error) => {
        // Verificar si el error tiene errores de validación
        if (error.error.errors) {
          // Aquí puedes mostrar todos los errores de validación
          const validationErrors = Object.values(error.error.errors).flat();
          this.alertService.error(undefined, validationErrors.join(', '));
        } else {
          // Para otros tipos de errores, solo mostrar el mensaje
          this.alertService.error(undefined, error.error.message);
        }
      }
    });
  }

  // FUnciones para el formulario

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value) {
      this.setTimeConstraints();
      this.reservationForm.controls['time_reservation'].updateValueAndValidity();
    }
  }

  setTimeConstraints(): void {
    const dateReservation = new Date(this.reservationForm.value.date_reservation).getDay();

    if (dateReservation === 6) { // Sábado
      this.minTime = '09:00';
      this.maxTime = '18:00';
    } else if (dateReservation >= 1 && dateReservation <= 5) { // Lunes a Viernes
      this.minTime = '08:00';
      this.maxTime = '19:00';
    } else { // Domingo
      this.minTime = '';
      this.maxTime = '';
    }
  }

  timeValidator(control: any) {
    if (!this.minTime || !this.maxTime) return null;
    const selectedTime = control.value;
    if (!selectedTime) return null;

    const [selectedHour, selectedMinute] = selectedTime.split(':').map(Number);
    const [minHour, minMinute] = this.minTime.split(':').map(Number);
    const [maxHour, maxMinute] = this.maxTime.split(':').map(Number);

    const selectedTotalMinutes = selectedHour * 60 + selectedMinute;
    const minTotalMinutes = minHour * 60 + minMinute;
    const maxTotalMinutes = maxHour * 60 + maxMinute;

    if (selectedTotalMinutes < minTotalMinutes || selectedTotalMinutes > maxTotalMinutes) {
      return { invalidTime: true };
    }

    return null;
  }

  // Carga de Personal
  async onOptionChange(idService: string): Promise<void> {
    this.reservationForm.get('personal_id')?.setValue(0); // Reinicia el segundo select cuando el primero cambia
    if (idService) {
      this.reservationForm.get('personal_id')?.enable(); // Habilita el segundo select
      await this.loadOptionsPersonal(idService);
    } else {
      this.reservationForm.get('personal_id')?.disable(); // Deshabilita el segundo select si no hay valor seleccionado
      this.personalData = [];
    }
  }

  async loadOptionsPersonal(idService: string): Promise<void> {
    this.personalService.getPersonalActiveByServiceId(idService).subscribe({
      next: (data: any) => {
        if (data && data.length > 0) {
          this.personalData = data;
        } else {
          this.personalData = [];
          this.alertService.information('No hay personal disponible para el servicio seleccionado');
          this.reservationForm.get('personal_id')?.setValue(0);
          this.reservationForm.get('personal_id')?.disable();
        }
      },
      error: (error) => {
        console.log(error);
        this.alertService.error(undefined, error);
        this.reservationForm.get('personal_id')?.setValue(0);
        this.reservationForm.get('personal_id')?.disable();
      }
    });
  }


  deleteReservationCart(index: string): void {
    this.lsService.deleteReservationCartById(index);
    this.reservationCart = this.lsService.getReservationCart();
  }

  generateRandomCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  isReservationValid(newReservation: IReservationCart, existingReservations: IReservationCart[]): boolean {
    // Convierte la hora de la reserva en minutos desde medianoche
    const convertTimeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    // Asegúrate de que la fecha sea un objeto Date
    const newReservationDate = new Date(newReservation.date_reservation).toDateString();
    const newReservationStartTime = convertTimeToMinutes(newReservation.time_reservation);

    // Verifica cada reserva existente
    for (const existingReservation of existingReservations) {
      // Asegúrate de que la fecha de la reserva existente también sea un objeto Date
      const existingReservationDate = new Date(existingReservation.date_reservation).toDateString();

      if (newReservationDate === existingReservationDate) {
        // Calcula la hora de finalización de la reserva existente
        const existingReservationStartTime = convertTimeToMinutes(existingReservation.time_reservation);
        const existingReservationEndTime = existingReservationStartTime + existingReservation.duration;

        // Verifica si la nueva reserva comienza después de que la existente haya terminado
        if (newReservationStartTime < existingReservationEndTime) {
          return false; // La nueva reserva comienza antes de que la existente haya terminado
        }
      }
    }

    // Si no se encontraron conflictos, la reserva es válida
    return true;
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

  get personal_id() {
    return this.reservationForm.get('personal_id') as FormGroup;
  }

  get client_id() {
    return this.reservationForm.get('client_id') as FormGroup;
  }
}
