export interface INewReservation {
    date_reservation: Date;
    time_reservation: string;
    status_id: number;
    service_id: number;
    service_name: string;
    personal_id: number;
    personal_name: string;
    client_id: number;
    client_name: string;
    user_id: number;
}

export interface INewReservationCart {
    reservations: IReservationCart[];
}

export interface IReservationResponse {
    message: string;
    status: number;
    data: IReservation[];
}

export interface IReservation {
    id: number;
    date_reservation: Date;
    time_reservation: string;
    status_id: number;
    service_id: number;
    personal_id: number;
    client_id: number;
    user_id: number;
}

export interface IReservationCart {
    id: string;
    date_reservation: Date;
    time_reservation: string;
    status_id: number;
    service_id: number;
    personal_id: number;
    client_id: number;
    user_id: number;
    service_name: string;
    personal_name: string;
    client_name: string;
    duration: number;
}

export class Reservation {
    id = 0;
    date_reservation = new Date();
    time_reservation = '';
    status_name = '';
    service_name = '';
    personal_name = '';
    client_name = '';
    user_name = '';
}
