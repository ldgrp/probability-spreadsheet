import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { NamespaceStore } from "./store/store";

const store = new NamespaceStore(10, 6);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App store={store} />
  </React.StrictMode>
);
