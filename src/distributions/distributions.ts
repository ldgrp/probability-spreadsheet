import { beta, lognormal, normal, triangular, uniform } from '@stdlib/random/iter';
import { Iterator as Iter } from '@stdlib/types/iter';
import { computed, makeObservable, observable } from 'mobx';

export interface IDistribution {
    /** 
     * A unique identifier for the distribution. 
     */
    id: string;
    /** 
     * A human-readable name for the distribution.
     */
    name: string;
    /**
     * Get a sample of the distribution.
     */
    samples: number[];
    /**
     * Get the parameters of the distribution.
     */
    parameterNames: string[];
}

abstract class AbstractDistribution implements IDistribution {
    id: string;
    name: string;
    sampleCount: number;

    constructor(id: string, name: string, sampleCount: number) {
        this.id = id;
        this.name = name;
        this.sampleCount = sampleCount;
        makeObservable(this, {
            id: observable,
            name: observable,
            sampleCount: observable,
            samples: computed,
        });
    }

    get samples(): number[] {
        const samples = [];
        for (let i = 0; i < this.sampleCount; i++) {
            samples.push(this.iterator.next().value);
        }
        return samples;
    }

    abstract get parameterNames(): string[];
    abstract iterator: Iter;
}

/**
 * A domain object representing a triangular distribution.
 */
export class Triangular extends AbstractDistribution {
    a: number;
    b: number;
    c: number;

    constructor(id: string, name: string, sampleCount: number, a: number, b: number, c: number) {
        super(id, name, sampleCount);
        this.a = a;
        this.b = b;
        this.c = c;
        makeObservable(this, {
            a: observable,
            b: observable,
            c: observable,
            iterator: computed,
        });
    }

    get iterator(): Iter {
        return triangular(this.a, this.b, this.c);
    }

    get parameterNames(): string[] {
        return ["a", "b", "c"];
    }
}

/**
 * A domain object representing a uniform distribution.
 */
export class Uniform extends AbstractDistribution {
    a: number;
    b: number;

    constructor(id: string, name: string, sampleCount: number, a: number, b: number) {
        super(id, name, sampleCount);
        this.a = a;
        this.b = b;
        makeObservable(this, {
            a: observable,
            b: observable,
            iterator: computed,
        });
    }

    get iterator(): Iter {
        return uniform(this.a, this.b);
    }

    get parameterNames(): string[] {
        return ["a", "b"];
    }
}

/**
 * A domain object representing a beta distribution.
 */
export class Beta extends AbstractDistribution {
    a: number;
    b: number;

    constructor(id: string, name: string, sampleCount: number, a: number, b: number) {
        super(id, name, sampleCount);
        this.a = a;
        this.b = b;
        makeObservable(this, {
            a: observable,
            b: observable,
            iterator: computed,
        });
    }

    get iterator(): Iter {
        return beta(this.a, this.b);
    }

    get parameterNames(): string[] {
        return ["a", "b"];
    }
}

/**
 * A domain object representing a normal distribution.
 */
export class Normal extends AbstractDistribution {
    mean: number;
    std: number;

    constructor(id: string, name: string, sampleCount: number, mean: number, std: number) {
        super(id, name, sampleCount);
        this.mean = mean;
        this.std = std;
        makeObservable(this, {
            mean: observable,
            std: observable,
            iterator: computed,
        });
    }

    get iterator(): Iter {
        return normal(this.mean, this.std);
    }

    get parameterNames(): string[] {
        return ["mean", "std"];
    }
}

/**
 * A domain object representing a log-normal distribution.
 */
export class LogNormal extends AbstractDistribution {
    mean: number;
    std: number;

    constructor(id: string, name: string, sampleCount: number, mean: number, std: number) {
        super(id, name, sampleCount);
        this.mean = mean;
        this.std = std;
        makeObservable(this, {
            mean: observable,
            std: observable,
            iterator: computed,
        });
    }

    get iterator(): Iter {
        return lognormal(this.mean, this.std);
    }

    get parameterNames(): string[] {
        return ["mean", "std"];
    }
}
