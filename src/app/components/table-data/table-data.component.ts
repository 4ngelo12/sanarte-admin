import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableAction } from '@app/core/interfaces/Table-Column';


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
