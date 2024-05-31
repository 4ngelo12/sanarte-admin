export interface IServicesResponse {
    message: string;
    status:  number;
    data:    IService[];
}

export interface IService {
    id:          number;
    name:        string;
    description: string;
    image:       string;
    price:       string;
    duration:    number;
    state:       number;
    category_id: number;
}

export class Service {
    id = 0;
    name = '';
    description = '';
    image = '';
    price = '';
    duration = 0;
    state = 0;
    category_id = 0;
}
