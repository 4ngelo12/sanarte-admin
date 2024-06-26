export interface INewCategory {
    name: string;
    description: string;
    warning?: string;
    // image: string;
}

export interface ICategoriesResponse {
    message: string;
    status: number;
    data: ICategory[];
}

export interface ICategory {
    id: number;
    name: string;
    description: string;
    state: boolean;
    warning: null | string;
    // image:       string;
}


export class Category {
    id = 0;
    name = '';
    description = '';
    warning? = '';
    state = false;
    // image= '';
}