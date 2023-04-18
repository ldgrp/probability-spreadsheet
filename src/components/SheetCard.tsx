import { observer } from "mobx-react-lite";
import { NamespaceStore } from "../store/store";
import { Sheet } from "./Sheet";
import { FormulaBar } from "./FormulaBar";

type SheetCardProps = {
    store: NamespaceStore;
}

export const SheetCard = observer(({ store }: SheetCardProps) => {
    return (
    <div className="sheet-container">
        <Sheet store={store}/>
        <FormulaBar store={store.activeCellStore}/>
    </div>
    )
});