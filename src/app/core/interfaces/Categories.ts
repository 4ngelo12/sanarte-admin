export interface ICategoriesResponse {
    message: string;
    status:  number;
    data:    ICategory[];
}

export interface ICategory {
    id:          number;
    name:        string;
    description: string;
    warning:     null | string;
    image:       string;
    created_at:  Date;
    updated_at:  Date;
}


export class Category {
    id= 0;
    name = '';
    description= '';
    warning? = '';
    image= '';
    created_at = '2024-05-26T01:52:51.000000Z';
    updated_at = '2024-05-26T01:52:51.000000Z';
}