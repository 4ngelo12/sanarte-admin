export interface ITopServicesResponse {
    message: string;
    status: number;
    data: ITopServices[];
}

export interface ITopServices {
    service_id: number;
    total_reservations: number;
    service_name: string;
}


export interface ITopDaysReservationResponse {
    message: string;
    status:  number;
    data:    ITtopDaysReservation[];
}

export interface ITtopDaysReservation {
    day:                string;
    total_reservations: number;
}
