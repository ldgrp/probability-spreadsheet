import { observer } from "mobx-react-lite";
import { NamespaceStore } from "../store/store";
import { Cell } from "./Cell";
import { getCellId } from "../utils/cells";

const CELL_HEADER = "cell-header";

type TableProps = {
  store: NamespaceStore;
};

export const Sheet = observer(({ store }: TableProps) => {
  return (
    <div role="table" className="overflow-auto h-full w-full">
      <div role="row" className="row">
        <div className="cell columnheader rowheader" role="columnheader">
          <span className={CELL_HEADER}>&nbsp;</span>
        </div>
        {Array.from({ length: store.columnCount }).map((_, i) => (
          <div className="cell columnheader" role="columnheader" key={i}>
            <span className={CELL_HEADER}>{String.fromCharCode("A".charCodeAt(0) + i)}</span>
          </div>
        ))}
      </div>
      {Array.from({ length: store.rowCount }).map((_, i) => (
        <div className="row" key={i}>
          <div role="rowheader" className="cell rowheader">
            <span className={CELL_HEADER}>{i + 1}</span>
          </div>
          {Array.from({ length: store.columnCount }).map((_, j) => (
            <Cell
              store={store.getCell(getCellId(i, j))!}
              activeCellStore={store.activeCellStore}
              key={j}
            />
          ))}
        </div>
      ))}
    </div>
  );
});
