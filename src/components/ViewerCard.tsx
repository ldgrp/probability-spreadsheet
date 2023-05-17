import * as Plot from "@observablehq/plot";
import { observer } from "mobx-react-lite";
import { ActiveCellStore } from "../store/ui/ActiveCellStore";
import { CellValue } from "../utils/cells";
import { Fragment, useEffect, useRef, useState } from "react";
import mean from "@stdlib/stats/base/mean";
import mediansorted from "@stdlib/stats/base/mediansorted";
import { Card } from "./Card";
import { HelpIcon } from "./HelpIcon";

type ViewerProps = {
  activeCellStore: ActiveCellStore;
};

type ViewType = "string" | "number" | "array";

const getViewType = (value: CellValue): ViewType => {
  if (Array.isArray(value)) {
    if (value.length <= 1) {
      return "number";
    }
    return "array";
  }
  return "string";
};

export const ViewerCard = observer(({ activeCellStore }: ViewerProps) => {
  const value = activeCellStore.cell.value;
  const viewtype = getViewType(value);
  return (
    <Card className="h-48 p-1">
      <HelpIcon helpFor="Viewer">
          <div className="p-2 space-y-1">
          <p>Shows a preview of the value of the active cell.</p>
          <p>If the cell contains a probability distribution, it will be shown as a histogram.</p>
          </div>
      </HelpIcon>
      {viewtype === "string" && <StringViewer value={value as string} />}
      {viewtype === "number" && <NumberViewer value={(value as number[])[0]} />}
      {viewtype === "array" && <ArrayViewer value={value as number[]} />}
    </Card>
  );
});

type StringViewerProps = {
  value: string;
};

const StringViewer = ({ value }: StringViewerProps) => {
  return (
    <div className="flex items-center justify-center h-32">
      <span>{value}</span>
    </div>
  );
};

type NumberViewerProps = {
  value: number;
};

const NumberViewer = ({ value }: NumberViewerProps) => {
  return (
    <div className="font-mono flex items-center justify-center h-32">
      <span>{value}</span>
    </div>
  );
};

type ArrayViewerProps = {
  value: number[];
};

const ArrayViewer = ({ value }: ArrayViewerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const sortedValues = value.sort();

  const params = {
    samples: value.length,
    mean: mean(value.length, sortedValues, 1),
    median: mediansorted(value.length, sortedValues, 1),
    max: sortedValues[sortedValues.length - 1],
    min: sortedValues[0],
  };

  useEffect(() => {
    const plot = Plot.plot({
      width: 300,
      height: 160,
      marks: [Plot.rectY(value, Plot.binX({ y: "count" })), Plot.ruleY([0])],
    });
    if (ref.current) ref.current.append(plot);
    return () => plot.remove();
  }, [value]);

  return (
    <div className="flex w-full items-start">
      <div className="mx-4" ref={ref} />
      <div className="grid grid-cols-[5em_1fr] font-mono text-sm col-gap-2 mx-4 grow">
        {Object.entries(params).map(([key, value]) => (
          <Fragment key={key}>
            <span>{key}</span>
            <span>{key === "samples" ? value : value?.toPrecision(3)}</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
};
