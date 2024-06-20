import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { ListDataComponent } from '@app/components/list-data/list-data.component';
import { TableDataComponent } from '@app/components/table-data/table-data.component';
import { TableAction, getEntityPropiedades } from '@app/core/interfaces/Table-Column';
import { IUsers } from '@app/core/interfaces/Usuarios';
import { AlertsService } from '@app/core/services/alerts.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { UsersService } from '@app/core/services/users.service';
import SpinnerComponent from '@app/shared/spinner/spinner.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [TableDataComponent, ListDataComponent, RouterModule, SpinnerComponent],
  templateUrl: './list.component.html',
  styles: ``
})
export default class ListComponent implements OnInit {
  users!: IUsers[];
  columns!: string[];
  title: string = 'Usuarios';
  showFirstChild = true;

  private breakpointObserver = inject(BreakpointObserver);
  private isMobile$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  isMobile = toSignal(this.isMobile$, { initialValue: false });

  constructor(private userService: UsersService, private lsService: LocalstorageService,
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
    this.columns = getEntityPropiedades('user');
    const id = this.lsService.getUserInfo()?.sub ?? '';
  
    this.userService.getUsers(id).subscribe({
      next: (data: any) => {
        this.users = data;
      }
    });
  }

  onAction(action: TableAction) {
    if (action.action == 'Editar') {
      this.edit(action.row.id)
    } else if (action.action == 'Eliminar') {
      this.alertService.confirmBox('Estas a punto de desactivar este usuario').then((result) => {
        if (result.isConfirmed) {
          this.alertService.success('Servicio desactivado');
          this.delete(action.row.id);
        }
      });
    }
  }

  edit(id: number) {
    this.router.navigate(['/usuarios/edit', id]);
  }

  delete(id: number) {
    this.userService.deleteUser(id.toString()).subscribe({
      next: () => {
        this.alertService.success('Usuario eliminado');
        this.getValues();
      },
      error: (error) => {
        this.alertService.error(undefined, error.error.message);
      }
    });
  }	
}
