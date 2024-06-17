import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { ListDataComponent } from '@app/components/list-data/list-data.component';
import { TableDataComponent } from '@app/components/table-data/table-data.component';
import { IService } from '@app/core/interfaces/Services';
import { TableAction, getEntityPropiedades } from '@app/core/interfaces/Table-Column';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { ServiceService } from '@app/core/services/service.service';
import SpinnerComponent from '@app/shared/spinner/spinner.component';
import { map } from 'rxjs';

@Component({
  standalone: true,
  imports: [TableDataComponent, ListDataComponent, RouterModule, SpinnerComponent],
  templateUrl: './list.component.html',
  styles: ``,
  providers: [ServiceService]
})
export default class ListComponent {
  services: IService[] = [];
  columns: string[] = [];
  title: string = 'Servicios';
  showTable: boolean = true;

  // Comparar el tamaño de la pantalla
  private breakpointObserver = inject(BreakpointObserver);
  private isMobile$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  isMobile = toSignal(this.isMobile$, { initialValue: false });

  constructor(private servicesService: ServiceService, private lsService: LocalstorageService,
    private router: Router) { }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();
    if (tokenValidate) {
      window.location.reload();
    }

    this.columns = getEntityPropiedades('service');

    this.getValues();
  }
  
  getValues() {
    this.columns = getEntityPropiedades('service');

    this.servicesService.getServices().subscribe({
      next: (data: any) => {
        this.services = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onAction(action: TableAction) {
    if (action.action == 'Editar') {
      this.edit(action.row.id)
    } else if (action.action == 'Eliminar') {
      this.delete(action.row.id)
    }
  }

  edit(id: number) {
    this.router.navigate(['/servicios/edit', id]);
    console.log("editar", id)
  }

  delete(id: number) {
    this.servicesService.deleteService(id.toString()).subscribe({
      next: (data: any) => {
        this.showTable = false;
        setTimeout(() => {this.getValues(), this.showTable = true}, 0);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
}