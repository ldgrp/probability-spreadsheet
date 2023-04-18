import { NamespaceStore } from "./store/store";
import { observer } from "mobx-react-lite";
import { SheetCard } from "./components/SheetCard";
import { Viewer } from "./components/Viewer";

type AppProps = {
  store: NamespaceStore;
};

const App = observer(({ store }: AppProps) => {
  return (
    <div className="flex flex-col p-6 gap-4">
      <SheetCard store={store}/>
      <Viewer activeCellStore={store.activeCellStore}/>
    </div>
  );
})



export default App;
