import { NamespaceStore } from "./store/store";
import { observer } from "mobx-react-lite";
import { SheetCard } from "./components/SheetCard";
import { ViewerCard } from "./components/ViewerCard";
import { FunctionsCard } from "./components/FunctionsCard";
import { CellControls } from "./components/CellControls";
import { Link } from "./components/Link";

type AppProps = {
  store: NamespaceStore;
};

const Hero = () => (
  <section>
    <div className="py-8 px-4 mx-auto text-center">
      <h1 className="mb-2 text-3xl font-bold tracking-tight leading-none text-gray-900">
        Probability Spreadsheet
      </h1>
      <p className="text-md font-normal text-gray-500">
        A spreadsheet for uncertainty and estimates
      </p>
    </div>
  </section>
);
const Footer = () => (
  <footer className="flex gap-2">
    <Link
      href="https://github.com/ldgrp/probability-spreadsheet"
      text="GitHub"
    />
    <Link
      href="https://ldgrp.me/ideas/probability-spreadsheet"
      text="What is this?"
    />
  </footer>
);
const App = observer(({ store }: AppProps) => {
  return (
    <div className="flex flex-col p-6 max-w-xl mx-auto gap-4">
      <Hero />
      <section className="flex flex-col gap-6">
        <CellControls store={store} />
        <div className="relative group">
          <div className="-z-10 absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur-md opacity-25 transition ease-in duration-300 group-hover:opacity-50"></div>
          <SheetCard store={store} />
        </div>
        <ViewerCard activeCellStore={store.activeCellStore} />
        <FunctionsCard store={store} />
      </section>
      <Footer />
    </div>
  );
});

export default App;
