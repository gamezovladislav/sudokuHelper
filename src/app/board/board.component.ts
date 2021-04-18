import {Component, Input, OnInit, Query} from '@angular/core';
import {TableStruct} from '../tableStruct/table-struct';
import {HelperService} from '../helper/helper.service';
import {TypeCell} from '../helper/type-cell.enum';
import {scanForRouteEntryPoints} from '@angular/compiler-cli/src/ngtsc/routing/src/lazy';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  public tableStruct: TableStruct;
  private _table: number[][];
  public rowSeq;
  type: TypeCell[][];
  selectedNumber: number;
  private _snapshots: number[][][] = [];
  private currentSnapshot: number;

  ngOnInit() {

  }

  @Input()
  set table(value: number[][]) {
    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < value[0].length; j++) {
        value[i][j] = value[i][j] | -1;
      }
    }
    this._table = Object.assign({}, value);
    this.currentSnapshot = 0;
    this._snapshots[this.currentSnapshot] = Object.assign({}, this._table);
    this.tableStruct = new TableStruct(this._table);
    this.rowSeq = Array.from({length: value.length}, (v, k) => k);
    this.type = this.tableStruct.getTableByColor(0);
  }

  get table(): number[][] {
    return this._table;
  }

  selectNumber() {
    this.type = HelperService.calculateFor(this._table, this.selectedNumber);
  }

  toColor(elementType: TypeCell): string {
    let color: string;
    switch (elementType) {
      case TypeCell.SINGLE:
        color = 'green';
        break;
      case TypeCell.MULTI:
        color = 'yellow';
        break;
      case TypeCell.NONE:
        color = 'default';
        break;
      case TypeCell.ONLY_IT:
        color = 'red';
        break;
      default:
        color = 'default';
    }
    return color;
  }

  hasErrors() {
    return HelperService.hasErrors(this._table);
  }

  makeSnapshot() {
    this._snapshots[++this.currentSnapshot] = Object.assign({}, this._table);
    console.log(this._snapshots);
  }

  goBack() {
    if (this.currentSnapshot > 0) {
      this._table = Object.assign({}, this._snapshots[--this.currentSnapshot]);
    }
    console.log(this._table);
  }
}
