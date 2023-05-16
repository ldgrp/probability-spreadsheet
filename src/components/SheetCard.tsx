import { observer } from "mobx-react-lite";
import { NamespaceStore } from "../store/store";
import { Sheet } from "./Sheet";
import { FormulaBar } from "./FormulaBar";
import { ActiveCellLabel } from "./ActiveCellLabel";
import { Card } from "./Card";

type SheetCardProps = {
    store: NamespaceStore;
}

export const SheetCard = observer(({ store }: SheetCardProps) => {
    return (
    <Card className="items-center">
        <div className="flex w-full divide-x my-1">
            <ActiveCellLabel store={store.activeCellStore}/>
            <FormulaBar store={store.activeCellStore}/>
        </div>
        <Sheet store={store}/>
    </Card>
    )
});