import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { ListDataComponent } from '@app/components/list-data/list-data.component';
import { TableDataComponent } from '@app/components/table-data/table-data.component';
import { IPersonal } from '@app/core/interfaces/Personal';
import { getEntityPropiedades, TableAction } from '@app/core/interfaces/Table-Column';
import { AlertsService } from '@app/core/services/alerts.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { PersonalService } from '@app/core/services/personal.service';
import SpinnerComponent from '@app/shared/spinner/spinner.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [TableDataComponent, ListDataComponent, RouterModule, SpinnerComponent],
  templateUrl: './list.component.html',
  styles: ``,
})
export default class ListComponent implements OnInit {
  personal: IPersonal[] = [];
  columns: string[] = [];
  title: string = 'Personal';
  showFirstChild = true;

  private breakpointObserver = inject(BreakpointObserver);
  private isMobile$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  isMobile = toSignal(this.isMobile$, { initialValue: false });

  constructor(private personalService: PersonalService, private lsService: LocalstorageService, 
    private alertService: AlertsService, private router: Router) {
  }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();

    if (tokenValidate) {
      window.location.reload();
    }

    this.getValues();
  }

  getValues() {
    this.columns = getEntityPropiedades('personal');

    this.personalService.getPersonal().subscribe({
      next: (data: any) => {
        this.personal = data;
      },
    });
  }

  onAction(action: TableAction) {
    if (action.action == 'Editar') {
      this.edit(action.row.id)
    } else if (action.action == 'Eliminar') {
      this.alertService.confirmBox('Estas a punto de eliminar los datos de este personal').then((result) => {
        if (result.isConfirmed) {
          this.alertService.success('Datos eliminados correctamente');
          this.delete(action.row.id);
        }
      });
    }
  }

  edit(id: number) {
    this.router.navigate(['/personal/edit', id]);
  }

  delete(id: number) {
    this.personalService.deletePersonal(id.toString()).subscribe({
      next: (data: any) => {
        this.showFirstChild = false;
        setTimeout(() => {this.getValues(), this.showFirstChild = true}, 0);
      },
      error: (error) => {
        this.alertService.error(undefined, 'Hubo un problema al eliminar la categoría, por favor intente de nuevo');
      }
    })
  }

}
