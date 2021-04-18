import {Injectable} from '@angular/core';
import {TypeCell} from './type-cell.enum';

@Injectable({
  providedIn: 'root'
})

export class HelperService {

  constructor() {
  }

  static calculateFor(table: number[][], color: number, option?: boolean): TypeCell[][] {
    const dimension = table.length;

    let coloredTable = HelperService.createTable(dimension);
    coloredTable = HelperService.clearByColumn(coloredTable, table, color);
    coloredTable = HelperService.clearByRow(coloredTable, table, color);
    coloredTable = HelperService.clearBySquare(coloredTable, table, color);
    coloredTable = HelperService.clearNotFree(coloredTable, table);
    coloredTable = HelperService.highlightSingleByRows(coloredTable);
    coloredTable = HelperService.highlightSingleByCols(coloredTable);
    coloredTable = HelperService.highlightSingleBySubMatrix(coloredTable);
    if (!option) {
      coloredTable = HelperService.highlightSingleColoredCells(coloredTable, table, color);
    }
    return coloredTable;
  }

  static hasErrors(table: number[][]) {
    return HelperService.hasErrorsByRows(table)
      || HelperService.hasErrorsByColumn(table)
      || HelperService.hasErrorsBySquares(table);
  }

  private static createTable(dimension: number): TypeCell[][] {
    const table: TypeCell[][] = [];
    for (let i = 0; i < dimension; i++) {
      const row = [];
      for (let j = 0; j < dimension; j++) {
        row.push(TypeCell.MULTI);
      }
      table.push(row);
    }
    return table;
  }

  private static clearByColumn(coloredTable: TypeCell[][], table: number[][], color: number): TypeCell[][] {
    const numbers: Set<number> = new Set();
    for (let col = 0; col < table[0].length; col++) {
      for (let row = 0; row < table.length; row++) {
        numbers.add(table[row][col]);
      }
      if (numbers.has(color)) {
        for (let row = 0; row < table.length; row++) {
          coloredTable[row][col] = TypeCell.NONE;
        }
      }
      numbers.clear();
    }
    return coloredTable;
  }

  private static clearByRow(coloredTable: TypeCell[][], table: number[][], color: number): TypeCell[][] {
    const numbers: Set<number> = new Set();
    for (let row = 0; row < table.length; row++) {
      for (let col = 0; col < table[0].length; col++) {
        numbers.add(table[row][col]);
      }
      if (numbers.has(color)) {
        for (let col = 0; col < table.length; col++) {
          coloredTable[row][col] = TypeCell.NONE;
        }
      }
      numbers.clear();
    }
    return coloredTable;
  }

  private static clearBySquare(coloredTable: TypeCell[][], table: number[][], color: number): TypeCell[][] {
    const dimension = Math.sqrt(table.length);
    const numbers: Set<number> = new Set();
    for (let globalRow = 0; globalRow < dimension; globalRow++) {
      for (let globalCol = 0; globalCol < dimension; globalCol++) {
        for (let row = 0; row < dimension; row++) {
          for (let col = 0; col < dimension; col++) {
            numbers.add(table[globalRow * dimension + row][globalCol * dimension + col]);
          }
        }
        if (numbers.has(color)) {
          for (let row = 0; row < dimension; row++) {
            for (let col = 0; col < dimension; col++) {
              coloredTable[globalRow * dimension + row][globalCol * dimension + col] = TypeCell.NONE;
            }
          }
        }
        numbers.clear();
      }
    }
    return coloredTable;
  }

  private static clearNotFree(coloredTable: TypeCell[][], table: number[][]): TypeCell[][] {
    for (let i = 0; i < table.length; i++) {
      for (let j = 0; j < table[0].length; j++) {
        if (table[i][j] >= 0) {
          coloredTable[i][j] = TypeCell.NONE;
        }
      }
    }
    return coloredTable;
  }

  private static highlightSingleByRows(coloredTable: TypeCell[][]): TypeCell[][] {
    const dimension = coloredTable.length;
    for (let row = 0; row < dimension; row++) {
      let countMultiCells = 0;
      let lastCol = 0;
      for (let col = 0; col < dimension; col++) {
        if (coloredTable[row][col] === TypeCell.MULTI || coloredTable[row][col] === TypeCell.SINGLE) {
          countMultiCells++;
          lastCol = col;
        }
      }
      if (countMultiCells === 1) {
        coloredTable[row][lastCol] = TypeCell.SINGLE;
      }
    }
    return coloredTable;
  }

  private static highlightSingleByCols(coloredTable: TypeCell[][]): TypeCell[][] {
    return this.transpose(this.highlightSingleByRows(this.transpose(coloredTable)));
  }

  private static transpose(matrix: TypeCell[][]): TypeCell[][] {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
  }

  private static highlightSingleBySubMatrix(coloredTable: TypeCell[][]): TypeCell[][] {
    const dimension = Math.sqrt(coloredTable.length);
    for (let globalRow = 0; globalRow < dimension; globalRow++) {
      for (let globalCol = 0; globalCol < dimension; globalCol++) {
        let lastCol = 0;
        let lastRow = 0;
        let countMultiCells = 0;
        for (let row = 0; row < dimension; row++) {
          for (let col = 0; col < dimension; col++) {
            const typeCell = coloredTable[globalRow * dimension + row][globalCol * dimension + col];
            if (typeCell === TypeCell.SINGLE || typeCell === TypeCell.MULTI) {
              countMultiCells++;
              lastRow = row;
              lastCol = col;
            }
          }
        }
        if (countMultiCells === 1) {
          coloredTable[globalRow * dimension + lastRow][globalCol * dimension + lastCol] = TypeCell.SINGLE;
        }
      }
    }
    return coloredTable;
  }

  private static highlightSingleColoredCells(coloredTable:TypeCell[][], table: number[][], color: number) {
    let colors:number[][] = [];
    for (let row = 0; row < table.length; row++) {
      let tmp:number[] = [];
      for (let column = 0; column < table[0].length; column++) {
        tmp.push(0);
      }
      colors.push(tmp);
    }
    for (let clr = 1; clr <= 9; clr++) {
      let calculated = HelperService.calculateFor(table, clr, true);
      for (let row = 0; row < calculated.length; row++) {
        for (let column = 0; column < calculated[0].length; column++) {
          if (calculated[row][column] === TypeCell.SINGLE || calculated[row][column] === TypeCell.MULTI) {
            colors[row][column]++;
          }
        }
      }
    }
    for (let row = 0; row < coloredTable.length; row++) {
      for (let column = 0; column < coloredTable[0].length; column++) {
        if (coloredTable[row][column] === TypeCell.MULTI && colors[row][column] === 1) {
          coloredTable[row][column] = TypeCell.ONLY_IT;
        }
      }
    }
    return coloredTable;
  }

  private static hasErrorsByRows(table: number[][]) {
    let numbers = new Set<number>();
    for (let row = 0; row < table.length; row++) {
      for (let column = 0; column < table[0].length; column++) {
        if (table[row][column] >= 0) {
          if (numbers.has(table[row][column])) {
            return true;
          }
          numbers.add(table[row][column]);
        }
      }
      numbers.clear();
    }
    return false;
  }

  private static hasErrorsByColumn(table: number[][]) {
    return HelperService.hasErrorsByRows(HelperService.transpose(table));
  }

  private static hasErrorsBySquares(table: number[][]) {
    const dimension = Math.sqrt(table.length);
    const numbers = new Set<number>();
    for (let globalRow = 0; globalRow < dimension; globalRow++) {
      for (let globalCol = 0; globalCol < dimension; globalCol++) {
        for (let row = 0; row < dimension; row++) {
          for (let col = 0; col < dimension; col++) {
            let value = table[globalRow * dimension + row][globalCol * dimension + col];
            if (value >= 0 && numbers.has(value)) {
              return true;
            }
            numbers.add(value);
          }
        }
        numbers.clear();
      }
    }
    return false;
  }
}
