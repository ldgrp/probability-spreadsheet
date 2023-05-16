import { observer } from "mobx-react-lite";
import { NamespaceStore } from "../store/store";
import { action } from "mobx";

type CellControlsProps = {
  store: NamespaceStore;
};

export const CellControls = observer(({ store }: CellControlsProps) => {
  const increaseDecimalPlaces = () => {
    const { displayOptions } = store.activeCellStore.cell;
    if (displayOptions.decimalPlaces === undefined) {
      displayOptions.decimalPlaces = 1;
    } else {
      displayOptions.decimalPlaces += 1;
    }
  };

  const decreaseDecimalPlaces = () => {
    const { displayOptions } = store.activeCellStore.cell;
    if (displayOptions.decimalPlaces === undefined) {
      displayOptions.decimalPlaces = 0;
    } else {
      displayOptions.decimalPlaces = Math.max(0, displayOptions.decimalPlaces - 1);
    }
  };

  return (
    <div className="flex flex-row items-center justify-center gap-4 w-full h-8 bg-blue-50 rounded-full">
      <span
        className="w-6 h-6 text-center rounded-md hover:bg-blue-100 select-none"
        onClick={action(decreaseDecimalPlaces)}
      >-</span>
      <span
        className="w-6 h-6 text-center hover:bg-blue-100 rounded-md select-none"
        onClick={action(increaseDecimalPlaces)}
      >+</span>
    </div>
  );
});
