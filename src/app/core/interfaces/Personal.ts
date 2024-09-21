export interface IPersonalResponse {
    message: string;
    status: number;
    data: IPersonal[];
}

export interface IPersonal {
    id: number;
    name: string;
    lastname: string;
    phone: string;
    status: number;
    service_id: number;
}

export interface INewPersonal {
    name: string;
    lastname: string;
    phone: string;
    status: number;
    service_id: number;
}

export class Personal {
    id = 0;
    name = '';
    lastname = '';
    phone = '';
    status = 0;
    service_name = '';
}
