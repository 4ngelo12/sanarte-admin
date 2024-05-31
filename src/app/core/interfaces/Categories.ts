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
}


export class Category {
    id= 0;
    name = '';
    description= '';
    warning? = '';
    image= '';
}