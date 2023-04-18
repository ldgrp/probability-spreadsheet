import { makeAutoObservable } from "mobx";
import { CellStore } from "../CellStore";
import { Direction, getNeighborCellId } from "../../utils/cells";
import { NamespaceStore } from "../store";

export class ActiveCellStore {
    private namespace: NamespaceStore;
    private _cell: CellStore;
    formula: string = "";

    constructor(namespace: NamespaceStore, cell: CellStore) {
        this.namespace = namespace;
        makeAutoObservable(this)
        this._cell = cell;
        cell.focus()
    }

    set cell(value: CellStore) {
        value.focus(this._cell);
        this.formula = value.formula;
        this._cell = value;
    }

    get cell(): CellStore {
        return this._cell;
    }

    move(dir: Direction): boolean {
        const id = getNeighborCellId(this.cell.id, dir);
        if (id === undefined) {
            return false;
        }
        const cell = this.namespace.getCell(id);
        if (cell === undefined) {
            return false;
        }
        this.cell = cell;
        return true;
    }

}