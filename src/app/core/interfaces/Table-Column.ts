import { Category } from "./Categories";
import { Client } from "./Clients";
import { Personal } from "./Personal";
import { Reservation } from "./Reservations";
import { Service } from "./Services";
import { User } from "./Usuarios";

export interface TableAction<T = any> {
    action: string; // 'edit' | 'delete' 
    row?: T; // Fila de la tabla
}

export const getEntityPropiedades = (entity: string): Array<any> => {
    let results: any = [];
    let classResponse: any;

    switch (entity) {
        case 'user':
            classResponse = new User(); break;
        case 'category':
            classResponse = new Category(); break;
        case 'service':
            classResponse = new Service(); break;
        case 'personal':
            classResponse = new Personal(); break;
        case 'client':
            classResponse = new Client(); break;
        case 'reservation':
            classResponse = new Reservation(); break;

    }

    if (classResponse) {
        results = Object.keys(classResponse);
    }
    return results
}