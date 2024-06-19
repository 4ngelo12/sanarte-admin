export interface IRolesResponse {
    message: string;
    status:  number;
    data:    IRoles[];
}

export interface IRoles {
    id:         number;
    name:       string;
    created_at: Date;
    updated_at: Date;
}
