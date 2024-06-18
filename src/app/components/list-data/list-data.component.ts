import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableAction } from '@app/core/interfaces/Table-Column';

@Component({
  selector: 'app-list-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-data.component.html',
  styleUrl: './list-data.component.scss'
})
export class ListDataComponent {
  columns: string[] = [];
  dataSources: any = [];
  showDelete:boolean = true;

  @Input() set columnsValue(value: string[]) {
    this.columns = value
  }

  @Input() set datasourcesValue(value: any) {
    this.dataSources = value
  }

  @Input() set showDeleteValue(value: boolean) {
    this.showDelete = value
  }

  @Output() action: EventEmitter<TableAction> = new EventEmitter();

  onAction(action: string, row: any): void {
    this.action.emit({ action: action, row: row });
  }
}
