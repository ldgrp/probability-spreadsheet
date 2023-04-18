import { observable, makeObservable } from "mobx";
import { IDistribution, Triangular, Uniform } from "../distributions/distributions";

const N = 10000

export class DistributionStore {
    /**
     * A map of distributions, keyed by their id.
     */
    distributions: Map<string, IDistribution> = observable.map();

    constructor() {
        makeObservable(this, {
            distributions: observable,
        });

        this.distributions.set('triangular', new Triangular('triangular', 'Triangular', N, 0, 1, 0.5));
        this.distributions.set('uniform', new Uniform('uniform', 'Uniform', N, 0, 1));
    }

}
