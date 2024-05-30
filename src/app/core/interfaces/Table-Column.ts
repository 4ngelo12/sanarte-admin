import { Category } from "./Categories";
import { Service } from "./Services";

export interface TableAction<T = any> {
    action: string; // 'edit' | 'delete' 
    row?: T; // Fila de la tabla
}

export const getEntityPropiedades = (entity: string): Array<any> => {
    let results: any = [];
    let classResponse: any;

    switch (entity) {
        case 'category':
            classResponse = new Category(); break;
        case 'service':
            classResponse = new Service(); break;

    }

    if (classResponse) {
        results = Object.keys(classResponse);
    }
    return results
}