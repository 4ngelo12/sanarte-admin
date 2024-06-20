export interface INewUser {
    name: string;
    email: string;
    state: boolean;
    role_id: number;
}

export interface IUsersResponse {
    message: string;
    status: number;
    data: IUsers[];
}

export interface IUsers {
    id: number;
    name: string;
    email: string;
    state: boolean;
    role_name: string;
}

export interface IUserUpdate {
    id: number;
    name: string;
    email: string;
    role_id: number;
    state: boolean;
}

export interface Role {
    id: number;
    name: string;
}

export class User {
    id = 0;
    name = '';
    email = '';
    state = false;
    role_name = '';
}