export interface INewReservation {
    date_reservation: Date;
    time_reservation: string;
    status_id: number;
    service_id: number;
    client_id: number;
    user_id: number;
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
    client_id: number;
    user_id: number;
}

export class Reservation {
    id = 0;
    date_reservation = new Date();
    time_reservation = '';
    status_name = '';
    service_name = '';
    client_name = '';
    user_name = '';
}
