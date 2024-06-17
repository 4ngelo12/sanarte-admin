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
    duration:    number[];
    state:       boolean;
    category_id: number;
}

export interface INewService {
    name:        string;
    description: string;
    image:       string;
    price:       string;
    duration:    number[];
    state:       boolean;
    category_id: number;
}


export class Service {
    id = 0;
    name = '';
    description = '';
    image = '';
    price = '';
    duration = 0;
    state = false;
    category_id = 0;
}
