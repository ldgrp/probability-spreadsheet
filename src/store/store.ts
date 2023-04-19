import { makeAutoObservable, observable } from "mobx";
import { ActiveCellStore } from "./ui/ActiveCellStore";
import { CellValue, getCellId } from "../utils/cells";
import { CellStore } from "./CellStore";

// A namespace is a collection of cells
// Cells can reference other cells in the same namespace
export class NamespaceStore {
  cells: Map<string, CellStore> = observable.map();
  activeCellStore: ActiveCellStore;
  rowCount: number;
  columnCount: number;

  constructor(rowCount: number, columnCount: number) {
    makeAutoObservable(this);
    this.columnCount = columnCount;
    this.rowCount = rowCount;
    for (let row = 0; row < rowCount; row++) {
      for (let column = 0; column < columnCount; column++) {
        const id = getCellId(row, column);
        this.cells.set(id, new CellStore(this, id));
      }
    }
    this.activeCellStore = new ActiveCellStore(this, this.cells.values().next().value);
  }

  getCell(id: string): CellStore | undefined {
    return this.cells.get(id);
  }

  evaluateCell(id: string): CellValue {
    const cell = this.getCell(id);
    if (cell === undefined) {
      throw new Error(`Unknown cell ${id}`);
    }
    return cell.value;
  }
}