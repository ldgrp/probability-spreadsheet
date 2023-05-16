import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { NamespaceStore } from "./store/store";
import { runInAction } from "mobx";

const store = new NamespaceStore(10, 6);

runInAction(() => {
  store.cells.get("A2")!.formula = 'Tri Dist'
  store.cells.get("B2")!.formula = '= triangular(0, 1, 0.5)';

  store.cells.get("A3")!.formula = 'Tri Dist + 1'
  store.cells.get("B3")!.formula = '= B2 + 1';

  store.cells.get("A5")!.formula = 'Uniform Dist'
  store.cells.get("B5")!.formula = '= uniform(1, 10)';

  store.cells.get("A6")!.formula = 'Uniform Dist + 1'
  store.cells.get("B6")!.formula = '= B5 + 1';

  store.cells.get("D2")!.formula = '2022 HELP Debt'
  store.cells.get("E2")!.formula = '25000'

  store.cells.get("D3")!.formula = 'CPI'
  store.cells.get("E3")!.formula = '= triangular(4,7,5.5)'

  store.cells.get("D4")!.formula = '2023 HELP Debt'
  store.cells.get("E4")!.formula = '= E2 * (1 + E3/100)'
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App store={store} />
  </React.StrictMode>
);
