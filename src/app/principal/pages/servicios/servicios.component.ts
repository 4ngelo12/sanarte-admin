import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ListDataComponent } from '@app/components/list-data/list-data.component';
import { TableDataComponent } from '@app/components/table-data/table-data.component';
import { IService } from '@app/core/interfaces/Services';
import { getEntityPropiedades } from '@app/core/interfaces/Table-Column';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { ServiceService } from '@app/core/services/service.service';
import { map } from 'rxjs';

@Component({
  standalone: true,
  imports: [TableDataComponent, ListDataComponent],
  templateUrl: './servicios.component.html',
  styles: ``
})
export default class ServiciosComponent implements OnInit {
  services: IService[] = [];
  columns: string[] = [];
  title: string = 'Servicios';

  // Comparar el tamaño de la pantalla
  private breakpointObserver = inject(BreakpointObserver);
  private isMobile$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  isMobile = toSignal(this.isMobile$, { initialValue: false });

  constructor(private servicesService: ServiceService, private lsService: LocalstorageService) { }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();
    if (tokenValidate) {
      window.location.reload();
    }

    this.columns = getEntityPropiedades('service');

    this.servicesService.getServices().subscribe({
      next: (data: any) => {
        this.services = data.data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
