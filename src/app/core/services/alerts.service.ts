import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  public error(title:string = "Hubo un problema", text: string):void {
    Swal.fire({
      icon: "error",
      title: title,
      text: text,
    });
  }

  public success(text: string):void {
    Swal.fire({
      icon: "success",
      title: "Proceso exitoso",
      text: text,
    });
  }

  public warning(text: string):void {
    Swal.fire({
      icon: "warning",
      title: "Advertencia",
      text: text,
    });
  }

  public confirmBox(text: string):Promise<any> {
    return Swal.fire({
      title: '¿Estas seguro de realizar esta acción?',
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#5D9A41',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'rgb(204 49 49)',
    });
  }
}
