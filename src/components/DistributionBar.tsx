import { observer } from "mobx-react-lite";
import { NamespaceStore } from "../store/store";
import { Card } from "./Card";

type DistributionBarProps = {
  store: NamespaceStore;
};

export const DistributionBar = observer(({ store }: DistributionBarProps) => {
  return (
      <Card className="text-sm p-2">
      <span className="font-bold">Functions</span>
      <div className="font-mono">
        <div>triangular(a,b,c)</div>
        <div>uniform(a,b)</div>
        <div>beta(alpha,beta)</div>
        <div>normal(mu, sigma)</div>
        <div>lognormal(mu, sigma)</div>
      </div>
      </Card>
  );
});