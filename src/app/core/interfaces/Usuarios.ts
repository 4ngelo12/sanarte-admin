export interface INewUser {
    name:              string;
    email:             string;
    state:             boolean;
    role_id:           number;
}

export interface IUsersResponse {
    message: string;
    status:  number;
    data:    IUsers[];
}

export interface IUsers {
    id:                number;
    name:              string;
    email:             string;
    state:             boolean;
    role_id:           number;
}

export interface IUserUpdate {
    id:                number;
    name:              string;
    email:             string;
    state:             boolean;
}

export class User {
    id = 0;
    name = '';
    email = '';
    state = false;
    role_id = 0;
}