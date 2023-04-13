import './App.css';
import { useRef } from "react";
import { CellStore, NamespaceStore, getCellId } from "./store";
import { observer } from "mobx-react-lite";
import { action, autorun } from "mobx";

type AppProps = {
  store: NamespaceStore;
};

const App = observer(({ store }: AppProps) => {
  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th> </th>
            {Array.from({ length: store.columnCount }).map((_, i) => (
              <th key={i}>{String.fromCharCode("A".charCodeAt(0) + i)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: store.rowCount }).map((_, i) => (
            <tr key={i}>
              <th>{i + 1}</th>
              {Array.from({ length: store.columnCount }).map((_, j) => (
                <Cell store={store.getCell(getCellId(i, j))!} key={j} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
})

type CellProps = {
  store: CellStore;
};

const Cell = observer(({ store }: CellProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    store.formula = e.target.value;
    e.target.value = store.value;
  };

  const handleOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.value = store.formula;
  };

  autorun(() => {
    if (inputRef.current) {
      inputRef.current.value = store.value;
    }
  });

  return (
    <td>
      <input
        ref={inputRef}
        id={store.id}
        type="text"
        onFocus={handleOnFocus}
        onBlur={action(handleOnBlur)}
        defaultValue={store.value}
      ></input>
    </td>
  );
})

export default App;
