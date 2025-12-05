export type ConstraintType = 'any' | 'hit' | number;

export interface SolverResult {
  sequence: number[];
  body: number[];
  tail: number[];
  totalLength: number;
  found: boolean;
  cumulativeSteps: { step: number; value: number; sum: number }[];
}

export interface SolverInput {
  target: number;
  reqLast: ConstraintType;
  req2nd: ConstraintType;
  req3rd: ConstraintType;
}

export const NUMBERS = [-3, -6, -9, -15, 2, 7, 13, 16];
export const HITS = [-3, -6, -9];
