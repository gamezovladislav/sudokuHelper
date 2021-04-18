import {Component, OnInit} from '@angular/core';

class TableSize {
  constructor(public dimension: number, public text: string) {
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sudokuHelper';
  sizes: TableSize[];
  table: number[][] = null;
  selectedDimension = 0;

  ngOnInit() {
    this.sizes = [];
    for (let size = 1; size <= 9; size++) {
      this.sizes.push(new TableSize(size * size, size + ' * ' + size));
    }
  }

  buildTable() {
    this.table = [];
    for (let row = 0; row < this.selectedDimension; row++) {
      this.table.push(Array.from({length: this.selectedDimension}));
    }
  }
}
