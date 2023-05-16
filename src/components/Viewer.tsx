import * as Plot from "@observablehq/plot";
import { observer } from "mobx-react-lite";
import { ActiveCellStore } from "../store/ui/ActiveCellStore";
import { CellValue } from "../utils/cells";
import { Fragment, useEffect, useRef } from "react";
import mean from "@stdlib/stats/base/mean"
import mediansorted from "@stdlib/stats/base/mediansorted"
import { Card } from "./Card";

type ViewerProps = {
  activeCellStore: ActiveCellStore;
};

type ViewType = "string" | "number" | "array";

const getViewType = (value: CellValue): ViewType => {
  if (Array.isArray(value)) {
    if (value.length <= 1){
        return "number";
    }
    return "array";
  }
  return "string";
};

export const Viewer = observer(({ activeCellStore }: ViewerProps) => {
  const value = activeCellStore.cell.value;
  const viewtype = getViewType(value);
  return (
    <Card className="items-center justify-center h-48">
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
    <div>
      <span>{value}</span>
    </div>
  );
};

type NumberViewerProps = {
  value: number;
};

const NumberViewer = ({ value }: NumberViewerProps) => {
  return (
    <div className="font-mono">
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
  }

  useEffect(() => {
    const plot = Plot.plot({
      width: 300,
      height: 170,
      marks: [Plot.rectY(value, Plot.binX({ y: "count" })), Plot.ruleY([0])],
    });
    if (ref.current) ref.current.append(plot);
    return () => plot.remove();
  }, [value]);

  return (
    <div className="flex w-full items-start">
      <div ref={ref} />
      <div className="grid grid-cols-[5em_1fr] font-mono text-sm col-gap-2 mx-4 grow">
        {Object.entries(params).map(([key, value]) => (
            <Fragment key={key}>
                <span>{key}</span>
                <span>{key === 'samples' ? value : value?.toPrecision(3)}</span>
            </Fragment>
        ))}
      </div>
    </div>
  );
};
