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
    created_at:  Date;
    updated_at:  Date;
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
    created_at = '2024-05-26T01:52:51.000000Z';
    updated_at = '2024-05-26T01:52:51.000000Z';
}
