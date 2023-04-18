import { makeAutoObservable } from "mobx";
import { evaluate } from "../parse";
import { NamespaceStore } from "./store";
import { CellValue } from "../utils/cells";

const CELL_ID_REGEX_GLOBAL = /[a-zA-Z_][a-zA-Z0-9_]*/g;

/**
 * A cell is a formula that can be evaluated.
 */
export class CellStore {
  formula: string = "";
  namespace: NamespaceStore;
  id: string;
  /**
   * Whether the cell is currently being edited.
   */
  private _isEditing: boolean = false;

  constructor(namespace: NamespaceStore, id: string) {
    this.namespace = namespace;
    this.id = id;

    makeAutoObservable(this);
  }
  
  /**
   * Whether the cell is currently focused.
   * It is the responsibility of this class to keep this value up to date
   * and make sure that only one cell is focused at a time.
   * 
   * See focus() below.
   */
  private _isFocused: boolean = false;

  private set isFocused(value: boolean) {
    this._isFocused = value;
  }

  get isFocused(): boolean {
    return this._isFocused;
  }

  set isEditing(value: boolean) {
    // Update the formula on the falling edge of isEditing
    if (this._isEditing !== value && value === false) {
        this.formula = this.namespace.activeCellStore.formula;
    }

    this._isEditing = value;
  }

  get isEditing(): boolean {
    return this._isEditing;
}

  /**
   * Maintain the invariant that only one cell is focused at a time.
   */
  focus(oldCell?: CellStore) {
    if (oldCell === this) {
        return;
    }
    if (oldCell !== undefined) {
        oldCell.isFocused = false;
    }
    this.isFocused = true;
  }

  /**
   * The logical value of the cell.
   */
  get value(): CellValue {
    if (this.formula === "") {
      return []
    }

    if (this.formula.startsWith("=")) {
      // Find all cell references
      const matches = this.formula.matchAll(CELL_ID_REGEX_GLOBAL);

      // Evaluate all cell references
      const values = new Map<string, number[]>();
      for (const match of matches) {
        try {
            const value = this.namespace.evaluateCell(match[0]);
            if (typeof value === 'string')
                return `Error: Cell ${match[0]} is not a number or array`;
            if (value.length === 0)
              values.set(match[0], [0])
            else
              values.set(match[0], value);
        } catch (e) {
            if (e instanceof Error && e.message.includes('Cycle'))
                return 'Error: Cycle detected';
            return "Error";
        }
      }

      try {
        return evaluate(this.formula.slice(1), values);
      } catch(e) {
        console.error(e)
        return "Syntax error"
      }
    }

    // Attempt to parse as a number
    const value = Number(this.formula);
    if (!isNaN(value)) {
      return [value];
    }
    return this.formula;
  }

  /**
   * The display value of the cell.
   */
  get displayValue(): string | number {
    const value = this.value;
    if (typeof value === 'string')
      return value;
    if (value.length === 0)
      return '';
    const sum = value.reduce((a, b) => a + b, 0);
    return sum/value.length;
  }
}
