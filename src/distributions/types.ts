export type Distribution = TriangularDistribution | UniformDistribution | BetaDistribution | NormalDistribution | LogNormalDistribution;

export type TriangularDistribution = {
    kind: 'Triangular';
    a: number;
    b: number;
    c: number;
}

export type UniformDistribution = {
    kind: 'Uniform';
    a: number;
    b: number;
}

export type BetaDistribution = {
    kind: 'Beta';
    a: number;
    b: number;
}

export type NormalDistribution = {
    kind: 'Normal';
    mean: number;
    std: number;
}

export type LogNormalDistribution = {
    kind: 'LogNormal';
    mean: number;
    std: number;
}

export type DistributionKind = Distribution['kind'];
export const distributionKinds: DistributionKind[] = ['Triangular', 'Uniform', 'Beta', 'Normal', 'LogNormal'];

