import {HelperService} from '../helper/helper.service';
import {TypeCell} from '../helper/type-cell.enum';

export class TableStruct {
  private _coloredTable: TypeCell[][][];
  private _dimension: number;

  constructor(public table: number[][]) {
    this._dimension = table.length;
    this._coloredTable = [];
    for (let color = 1; color <= 9; color++) {
      this._coloredTable.push(HelperService.calculateFor(table, color));
    }
  }

  public getTableByColor(color: number): TypeCell[][] {
    return this._coloredTable[color];
  }

  get dimension(): number {
    return this._dimension;
  }
}
