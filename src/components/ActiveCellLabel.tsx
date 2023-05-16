import { observer } from "mobx-react-lite";
import { ActiveCellStore } from "../store/ui/ActiveCellStore";

type ActiveCellLabelProps = {
    store: ActiveCellStore
};

export const ActiveCellLabel = observer(({ store }: ActiveCellLabelProps) => {

    const type = store.cell.displayValue 
    return (
        <div className="py-1 px-4 w-28 text-sm text-gray-500 capitalize">
            {store.cell.type}
        </div>
    )
});