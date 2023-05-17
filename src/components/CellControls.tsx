import { observer } from "mobx-react-lite";
import { NamespaceStore } from "../store/store";
import { action } from "mobx";
import {
  safePolygon,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { useState } from "react";
import { Popover } from "@headlessui/react";

type CellControlsProps = {
  store: NamespaceStore;
};

export const CellControls = observer(({ store }: CellControlsProps) => {
  const decreaseDecimalPlaces = () => {
    const { displayOptions } = store.activeCellStore.cell;
    if (displayOptions.decimalPlaces === undefined) {
      displayOptions.decimalPlaces = 0;
    } else {
      displayOptions.decimalPlaces = Math.max(
        0,
        displayOptions.decimalPlaces - 1
      );
    }
  };

  const increaseDecimalPlaces = () => {
    const { displayOptions } = store.activeCellStore.cell;
    if (displayOptions.decimalPlaces === undefined) {
      displayOptions.decimalPlaces = 1;
    } else {
      displayOptions.decimalPlaces += 1;
    }
  };

  return (
    <div className="flex flex-row items-center justify-center gap-4 w-full h-8 bg-blue-50 rounded-full">
      <ControlButton title="-" description="Decrease decimal places" onClick={action(decreaseDecimalPlaces)}/>
      <ControlButton title="+" description="Increase decimal places" onClick={action(increaseDecimalPlaces)}/>
    </div>
  );
});

type ControlButtonProps = {
  title: string;
  description: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

export const ControlButton = observer(
  ({title, description, onClick}: ControlButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { refs, floatingStyles, context } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
    });

    const hover = useHover(context, {
      handleClose: safePolygon(),
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

    return (
      <Popover>
        <Popover.Button
          ref={refs.setReference}
          className="w-6 h-6 text-center rounded-md hover:bg-blue-100 select-none"
          onClick={onClick}
        >
        {title}
        </Popover.Button>
        {isOpen && (
          <Popover.Panel
            static
            className="z-10"
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <div className="mt-1 text-xs text-gray-100 transition-opacity duration-300 bg-gray-900 border border-gray-200 rounded-md shadow-sm select-none">
              <div className="px-2 py-1">{description}</div>
            </div>
          </Popover.Panel>
        )}
      </Popover>
    );
  }
);
