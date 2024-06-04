import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TableAction } from '@app/core/interfaces/Table-Column';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';


@Component({
  selector: 'app-table-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-data.component.html',
  styleUrl: './table-data.component.scss'
})

export class TableDataComponent {
  columns: string[] = [];
  dataSources: any = [];

  // // Comparar el tamaño de la pantalla
  // private breakpointObserver = inject(BreakpointObserver);
  // private isMobile$ = this.breakpointObserver
  //   .observe(Breakpoints.Handset)
  //   .pipe(map(result => result.matches));
  // isMobile = toSignal(this.isMobile$, { initialValue: false });


  @Input() set columnsValue(value: string[]) {
    this.columns = value
  }

  @Input() set datasourcesValue(value: any) {
    this.dataSources = value
  }

  @Output() action: EventEmitter<TableAction> = new EventEmitter();

  onAction(action: string, row: any): void {
    this.action.emit({ action: action, row: row });
  }
}
