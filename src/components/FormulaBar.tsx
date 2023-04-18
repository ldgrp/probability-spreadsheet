import { observer } from "mobx-react-lite";
import { ActiveCellStore } from "../store/ui/ActiveCellStore";
import { action } from "mobx";

type FormulaBarProps = {
    store: ActiveCellStore
};

export const FormulaBar = observer(({ store }: FormulaBarProps) => {
    const handleOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        store.cell.isEditing = true;
    }

    const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.relatedTarget?.id !== store.cell.id)
            store.cell.isEditing = false;
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        store.formula = e.target.value;
    }

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.currentTarget.blur();
        } else if (e.key === "Escape") {
            e.currentTarget.blur();
        }
    }

    return (
        <div className="formula-container">
            <input
                className="formula-input"
                type="text"
                onKeyDown={action(handleOnKeyDown)}
                onFocus={action(handleOnFocus)}
                onBlur={action(handleOnBlur)}
                onChange={action(handleOnChange)}
                value={store.formula}
            />
        </div>

    )
});