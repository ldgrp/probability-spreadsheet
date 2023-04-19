import { observer } from "mobx-react-lite";
import { NamespaceStore } from "../store/store";

type DistributionBarProps = {
  store: NamespaceStore;
};

export const DistributionBar = observer(({ store }: DistributionBarProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-2 shadow">
      <div className="text-sm">
      <span className="font-bold">Functions</span>
      <div className="font-mono">
        <div>triangular(a,b,c)</div>
        <div>uniform(a,b)</div>
        <div>beta(alpha,beta)</div>
        <div>normal(mu, sigma)</div>
        <div>lognormal(mu, sigma)</div>
      </div>
      </div>
    </div>
  );
});