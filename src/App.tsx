import { NamespaceStore } from "./store/store";
import { observer } from "mobx-react-lite";
import { SheetCard } from "./components/SheetCard";
import { ViewerCard } from "./components/ViewerCard";
import { FunctionsCard } from "./components/FunctionsCard";
import { CellControls } from "./components/CellControls";

type AppProps = {
  store: NamespaceStore;
};

const App = observer(({ store }: AppProps) => {
  return (
    <div className="flex flex-col p-6 gap-4 max-w-xl mx-auto">
      <ViewerCard activeCellStore={store.activeCellStore}/>
      <CellControls store={store}/>
      <SheetCard store={store}/>
      <FunctionsCard store={store}/>
    <footer className="">
      <a className="border-dotted hover:underline text-blue-500 border" href="https://ldgrp.me/ideas/probability-spreadsheet">Idea Page</a>
    </footer>
    </div>
  );
})



export default App;
