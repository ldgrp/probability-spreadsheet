import { action, reaction } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import { ActiveCellStore } from "../store/ui/ActiveCellStore";
import { CellStore } from "../store/CellStore";
import { arrowKeyToDirection } from "../utils/cells";

// Cell data types
const CELL_INPUT = "cell-input";
const CELL_STRING = "cell-string";
const CELL_NUMBER = "cell-number";
const CELL_ERROR = "cell-error";
// Cell states
const CELL_EDITING = "cell-editing";
const CELL_FOCUSED = "cell-focused";

type CellProps = {
  store: CellStore;
  activeCellStore: ActiveCellStore;
};

function isCellInput(
  element: Element | EventTarget | null
): element is HTMLInputElement {
  return (
    element instanceof HTMLInputElement &&
    element.classList.contains("cell-input")
  );
}

function isNotModifierKey(e: KeyboardEvent): boolean {
  return !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;
}

export const Cell = observer(({ store, activeCellStore }: CellProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget?.classList.contains("formula-input")) {
      return;
    }
    store.isEditing = false;
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (store.isEditing) {
      if (e.key === "Escape") {
        store.isEditing = false;
      } else if (e.key === "Enter") {
        store.isEditing = false;
        const dir = e.shiftKey ? "up" : "down";
        activeCellStore.move(dir)
      }
    } else {
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        e.preventDefault();
        const dir = arrowKeyToDirection(e.key);
        if (dir) {
          activeCellStore.move(dir);
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        store.isEditing = true;
      } else if (e.key === "Tab") {
        e.preventDefault();
        const dir = e.shiftKey ? "left" : "right";
        activeCellStore.move(dir);
      } else if (e.key.length === 1 || e.key === "Spacebar") {
        activeCellStore.formula = "";
        store.isEditing = true;
      } else if (e.key === "Backspace" || e.key === "Delete") {
        store.formula = "";
        activeCellStore.formula = "";
      }
    }
  };

  const handleOnMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
    // Prevent the input from losing focus when clicking on another cell.
    if (e.currentTarget === document.activeElement) {
      return;
    }

    // Check if the active element is a cell input
    if (
      isCellInput(document.activeElement) &&
      isCellInput(e.target) &&
      activeCellStore.cell.isEditing &&
      activeCellStore.formula?.startsWith("=")
    ) {
      // Check if we can insert the id of the cell into the formula
      const { selectionStart, selectionEnd } = document.activeElement;
      if (selectionStart && selectionStart === selectionEnd) {
        const formula = activeCellStore.formula;
        const formulaStart = formula.slice(0, selectionStart);

        // Check if the end of formula start is an operator
        // Otherwise, it doesnt make sense to insert the id of the cell
        const formulaStartNoSpaces = formulaStart.replace(/\s/g, "");
        if (
          formulaStartNoSpaces &&
          !formulaStartNoSpaces.match(/[\+\-\=\*\/]$/)
        )
          return;

        const formulaEnd = formula.slice(selectionStart);
        activeCellStore.formula = `${formulaStart}${e.target.id}${formulaEnd}`;
        e.preventDefault();
      }
    }
  };

  const handleOnDoubleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    store.isEditing = true;
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    activeCellStore.formula = e.target.value;
  };

  const handleOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (activeCellStore.cell !== store) activeCellStore.cell = store;
  };

  const createClassName = (value: string | number) => {
    let className = CELL_INPUT;
    if (store.isFocused)
      className += ` ${CELL_FOCUSED}`
    if (typeof value === "string") {
      if (value.startsWith("Error")) {
        className += ` ${CELL_ERROR}`;
      }
      className += ` ${CELL_STRING}`;
    } else if (typeof value === "number") {
      className += ` ${CELL_NUMBER}`;
    }
    return className;
  };

  useEffect(() => {
    const disposer = reaction(
      () => store.isFocused,
      (isFocused) => {
        if (isFocused && inputRef.current) {
          inputRef.current.focus();
        }
      }
    );
    return () => disposer();
  }, []);

  return (
    <div role="cell" className="cell">
      <input
        autoComplete="off"
        className={
          store.isEditing
            ? `${CELL_INPUT} ${CELL_EDITING}`
            : createClassName(store.displayValue)
        }
        value={store.isEditing ? activeCellStore.formula : store.displayValue}
        id={store.id}
        readOnly={!store.isEditing}
        onBlur={action(handleOnBlur)}
        onKeyDown={action(handleOnKeyDown)}
        onClick={action(handleOnMouseDown)}
        onFocus={action(handleOnFocus)}
        onDoubleClick={action(handleOnDoubleClick)}
        onChange={action(handleOnChange)}
        ref={inputRef}
        type="text"
      />
    </div>
  );
});
