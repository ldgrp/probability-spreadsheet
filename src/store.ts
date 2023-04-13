import { computed, makeObservable, observable } from "mobx";

const CELL_ID_REGEX = /[A-Z]+[0-9]+/;
const CELL_ID_REGEX_GLOBAL = /[A-Z]+[0-9]+/g;

export function getCellId(row: number, column: number): string {
  return `${String.fromCharCode("A".charCodeAt(0) + column)}${row + 1}`;
}

// A namespace is a collection of cells
// Cells can reference other cells in the same namespace
export class NamespaceStore {
  cells: Map<string, CellStore> = observable.map();
  rowCount: number;
  columnCount: number;

  constructor(rowCount: number, columnCount: number) {
    makeObservable(this, {
      cells: observable,
    });
    this.columnCount = columnCount;
    this.rowCount = rowCount;
    for (let row = 0; row < rowCount; row++) {
      for (let column = 0; column < columnCount; column++) {
        const id = getCellId(row, column);
        this.cells.set(id, new CellStore(this, id));
      }
    }
  }

  getCell(id: string): CellStore | undefined {
    return this.cells.get(id);
  }

  evaluateCell(id: string): string {
    const cell = this.getCell(id);
    if (cell === undefined) {
      return "";
    }
    return cell.value;
  }
}

// A cell is a formula that can be evaluated
export class CellStore {
  formula: string = "";
  namespace: NamespaceStore;
  id: string;

  constructor(namespace: NamespaceStore, id: string) {
    this.namespace = namespace;
    this.id = id;

    makeObservable(this, {
      formula: observable,
      value: computed,
    });
  }

  get value() {
    console.log("Evaluating", this.id, this.formula);
    if (this.formula === "") {
      return '' ;
    }

    if (this.formula.startsWith("=")) {
      // Find all cell references
      const matches = this.formula.matchAll(CELL_ID_REGEX_GLOBAL);

      // Evaluate all cell references
      const values = [];
      for (const match of matches) {
        try {
            values.push(this.namespace.evaluateCell(match[0]));
        } catch (e) {
            if (e instanceof Error && e.message.includes('Cycle'))
                return 'Error: Cycle detected';
            return "Error";
        }
      }

      for (const value of values) {
        if (isNaN(Number(value)) || value === "" || value === undefined) {
            return "Error";
        }
    }

      // Replace all cell references with their values
      let formula = this.formula.slice(1);
      for (const value of values) {
        formula = formula.replace(CELL_ID_REGEX, value);
      }

      // Praise be to eval!
      return eval(formula);
    }

    return this.formula;
  }
}
