import { ConstraintType, NUMBERS, HITS, SolverResult } from '../types';

/**
 * Filters valid options based on the requirement.
 */
function getValidOptions(requirement: ConstraintType): number[] {
  if (requirement === 'any') {
    return NUMBERS;
  } else if (requirement === 'hit') {
    return HITS;
  } else if (typeof requirement === 'number') {
    if (NUMBERS.includes(requirement)) {
      return [requirement];
    } else {
      console.warn(`Warning: Number ${requirement} is not in the allowed set.`);
      return [];
    }
  }
  return [];
}

/**
 * BFS to find the shortest sequence of numbers that sum up to targetSum.
 */
function bfsFindShortestBody(targetSum: number): number[] | null {
  if (targetSum === 0) {
    return [];
  }

  // Queue stores objects: { currentSum, path }
  // Using an array and index pointer for performance (better than shift() on large arrays, 
  // though for this depth it's negligible, it's good practice).
  const queue: { currentSum: number; path: number[] }[] = [{ currentSum: 0, path: [] }];
  const visited = new Set<number>([0]);
  
  let head = 0;
  const MAX_DEPTH = 50;
  // Heuristic bounds to prevent explosion in search space for unreachable numbers
  const MIN_BOUND = -300; 
  const MAX_BOUND = 400;

  while (head < queue.length) {
    const { currentSum, path } = queue[head++];

    if (path.length > MAX_DEPTH) {
      continue;
    }

    for (const num of NUMBERS) {
      const nextSum = currentSum + num;

      if (nextSum === targetSum) {
        return [...path, num];
      }

      // Optimization: Only add to queue if this sum hasn't been reached before
      // and is within a reasonable range to avoid infinite divergence.
      if (!visited.has(nextSum) && nextSum >= MIN_BOUND && nextSum <= MAX_BOUND) {
        visited.add(nextSum);
        queue.push({ currentSum: nextSum, path: [...path, num] });
      }
    }
  }

  return null;
}

/**
 * Main solver function.
 */
export function solveSequence(
  targetTotal: number,
  reqLast: ConstraintType,
  req2nd: ConstraintType,
  req3rd: ConstraintType
): SolverResult {
  const optsLast = getValidOptions(reqLast);
  const opts2nd = getValidOptions(req2nd);
  const opts3rd = getValidOptions(req3rd);

  let bestSequence: number[] | null = null;
  let minLength = Infinity;

  // Brute force the last 3 positions (Tail)
  for (const n3 of opts3rd) {
    for (const n2 of opts2nd) {
      for (const n1 of optsLast) {
        
        const tail = [n3, n2, n1];
        const tailSum = n3 + n2 + n1;
        const bodyTarget = targetTotal - tailSum;

        // Find shortest body for the remaining sum
        const body = bfsFindShortestBody(bodyTarget);

        if (body !== null) {
          const fullSequence = [...body, ...tail];
          if (fullSequence.length < minLength) {
            minLength = fullSequence.length;
            bestSequence = fullSequence;
          }
        }
      }
    }
  }

  if (bestSequence) {
    // Generate cumulative steps for visualization
    let currentSum = 0;
    const cumulativeSteps = bestSequence.map((val, idx) => {
      currentSum += val;
      return { step: idx + 1, value: val, sum: currentSum };
    });
    // Add start point
    cumulativeSteps.unshift({ step: 0, value: 0, sum: 0 });

    return {
      found: true,
      sequence: bestSequence,
      body: bestSequence.slice(0, bestSequence.length - 3),
      tail: bestSequence.slice(-3),
      totalLength: bestSequence.length,
      cumulativeSteps
    };
  }

  return {
    found: false,
    sequence: [],
    body: [],
    tail: [],
    totalLength: 0,
    cumulativeSteps: []
  };
}
