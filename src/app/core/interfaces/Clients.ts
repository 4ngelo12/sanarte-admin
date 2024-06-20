export interface INewClient {
    name: string;
    lastname: string;
    email: string;
    phone: string;
}

export interface IClientsResponse {
    message: string;
    status: number;
    data: IClient[];
}

export interface IClient {
    id: number;
    name: string;
    lastname: string;
    email: string;
    phone: string;
    state: boolean;
}

export class Client {
    id = 0;
    name = '';
    lastname = '';
    email = '';
    phone = '';
    state = false;
}