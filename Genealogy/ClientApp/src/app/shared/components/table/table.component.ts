import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Table } from '@models';

@Component({
  selector: 'lancet-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() data: Table.Data;
  @Input() selectedId: string;
  @Input() showRemoved: boolean = true;
  @Input() showActionButtons: boolean = false;
  @Input() startIndex: number = 0;

  @Output() change: EventEmitter<string> = new EventEmitter();
  @Output() remove: EventEmitter<string> = new EventEmitter();
  @Output() restore: EventEmitter<string> = new EventEmitter();

  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log('TABLE', this.data)
  }

  onRemove(value: string) {
    event.stopPropagation();
    this.remove.emit(value);
  }

  onRestore(value: string) {
    this.restore.emit(value);
  }

  onSelect(value: string) {
    event.stopPropagation();
    this.change.emit(value);
  }

  onToggleRemoved() {
    this.showRemoved = !this.showRemoved;
  }
}
