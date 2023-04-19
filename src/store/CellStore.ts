import { makeAutoObservable } from "mobx";
import { evaluate } from "../parse";
import { NamespaceStore } from "./store";
import { CellValue } from "../utils/cells";
import {
  Beta,
  Triangular,
  Uniform,
  Normal,
  LogNormal,
} from "../distributions/distributions";

const N = 10000;
const functions = new Map<string, (args: number[]) => number[]>();
functions.set(
  "triangular",
  ([a, b, c]) =>
    new Triangular("triangular", "Triangular", N, a, b, c ?? (a + b) / 2)
      .samples
);
functions.set(
  "uniform",
  ([a, b]) => new Uniform("uniform", "Uniform", N, a, b).samples
);
functions.set("beta", ([a, b]) => new Beta("beta", "Beta", N, a, b).samples);
functions.set(
  "normal",
  ([mean, std]) => new Normal("normal", "Normal", N, mean, std).samples
);
functions.set(
  "lognormal",
  ([mean, std]) => new LogNormal("lognormal", "LogNormal", N, mean, std).samples
);

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
      return [];
    }

    if (this.formula.startsWith("=")) {
      const fn = (identifier: string) => {
        const value = this.namespace.evaluateCell(identifier);
        if (Array.isArray(value)) return value;
        return undefined;
      };

      try {
        return evaluate(this.formula.slice(1), fn, functions);
      } catch (e) {
        if (e instanceof Error) {
          if (e.message.includes("Cycle")) return "Error: Cycle detected";
          return e.message;
        }
        return "Syntax error";
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
    if (typeof value === "string") return value;
    if (value.length === 0) return "";
    const sum = value.reduce((a, b) => a + b, 0);
    return sum / value.length;
  }
}
