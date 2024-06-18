import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { ListDataComponent } from '@app/components/list-data/list-data.component';
import { TableDataComponent } from '@app/components/table-data/table-data.component';
import { IReservation } from '@app/core/interfaces/Reservations';
import { TableAction, getEntityPropiedades } from '@app/core/interfaces/Table-Column';
import { AlertsService } from '@app/core/services/alerts.service';
import { LocalstorageService } from '@app/core/services/localstorage.service';
import { ReservationService } from '@app/core/services/reservation.service';
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
  reservations: IReservation[] = [];
  columns: string[] = [];
  title: string = 'Reservas';
  showFirstChild = true;

  // Comparar el tamaño de la pantalla
  private breakpointObserver = inject(BreakpointObserver);
  private isMobile$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  isMobile = toSignal(this.isMobile$, { initialValue: false });

  constructor(private reservationSercice: ReservationService, private lsService: LocalstorageService, 
    private router: Router) {
  }

  ngOnInit(): void {
    const tokenValidate = this.lsService.validateToken();

    if (tokenValidate) {
      window.location.reload();
    }

    this.getValues();
  }

  getValues() {
    this.columns = getEntityPropiedades('reservation');

    this.reservationSercice.getReservations().subscribe({
      next: (data: any) => {
        this.reservations = data.data;
      }
    });
  }

  onAction(action: TableAction) {
    if (action.action == 'Editar') {
      this.edit(action.row.id)
    }
  }

  edit(id: number) {
    this.router.navigate(['/reservas/edit', id]);
  }

}
