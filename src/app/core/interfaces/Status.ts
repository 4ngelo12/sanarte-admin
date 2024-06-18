export interface IStatusResponse {
    message: string;
    status:  number;
    data:    IStatus[];
}

export interface IStatus {
    id:         number;
    name:       string;
}
