import { observer } from "mobx-react-lite";
import { NamespaceStore } from "../store/store";
import { Card } from "./Card";
import { HelpIcon } from "./HelpIcon";

type FunctionsCardProps = {
  store: NamespaceStore;
};

export const FunctionsCard = observer(({ store }: FunctionsCardProps) => {
  return (
      <Card className="text-sm p-1">
      <HelpIcon helpFor="Viewer">
          <div className="p-2 space-y-1">
          <p>A list of all the functions available in the spreadsheet.</p>
          <p>To use a function, type equals followed by the function name and the arguments in parentheses.</p>
          </div>
      </HelpIcon>
      <div className="mx-2 mb-2">
      <span className="font-bold">Functions</span>
      <div className="font-mono">
        <div>triangular(a,b,c)</div>
        <div>uniform(a,b)</div>
        <div>beta(alpha,beta)</div>
        <div>normal(mu, sigma)</div>
        <div>lognormal(mu, sigma)</div>
      </div>
      </div>
      </Card>
  );
});