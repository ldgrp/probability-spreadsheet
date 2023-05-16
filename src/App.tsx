import { NamespaceStore } from "./store/store";
import { observer } from "mobx-react-lite";
import { SheetCard } from "./components/SheetCard";
import { Viewer } from "./components/Viewer";
import { DistributionBar } from "./components/DistributionBar";

type AppProps = {
  store: NamespaceStore;
};

const App = observer(({ store }: AppProps) => {
  return (
    <div className="flex flex-col p-6 gap-4">
      <Viewer activeCellStore={store.activeCellStore}/>
      <SheetCard store={store}/>
      <DistributionBar store={store}/>
    <footer className="">
      <a className="border-dotted hover:underline text-blue-500 border" href="https://ldgrp.me/ideas/probability-spreadsheet">Idea Page</a>
    </footer>
    </div>
  );
})



export default App;
