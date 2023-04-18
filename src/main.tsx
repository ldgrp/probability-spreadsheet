import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { NamespaceStore } from "./store/store";
import { runInAction } from "mobx";

const store = new NamespaceStore(10, 6);

runInAction(() => {
  store.cells.get("A2")!.formula = 'Tri Dist'
  store.cells.get("B2")!.formula = '= triangular';

  store.cells.get("A3")!.formula = 'Tri Dist + 1'
  store.cells.get("B3")!.formula = '= B2 + 1';

  store.cells.get("A5")!.formula = 'Uniform Dist'
  store.cells.get("B5")!.formula = '= uniform';

  store.cells.get("A6")!.formula = 'Uniform Dist + 1'
  store.cells.get("B6")!.formula = '= B5 + 1';
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App store={store} />
  </React.StrictMode>
);
