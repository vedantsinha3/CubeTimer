import type { Solve } from '../types';

/**
 * Get the effective time for a solve (accounting for penalties)
 * Returns null for DNF solves
 */
export function getEffectiveTime(solve: Solve): number | null {
  if (solve.penalty === 'dnf') {
    return null;
  }
  if (solve.penalty === '+2') {
    return solve.time + 2000; // Add 2 seconds
  }
  return solve.time;
}

/**
 * Calculate the average of N solves (WCA style)
 * Drops best and worst times if N >= 5
 * Returns null if not enough valid solves or too many DNFs
 */
export function calculateAverageOfN(solves: Solve[], n: number): number | null {
  if (solves.length < n) {
    return null;
  }

  const recentSolves = solves.slice(0, n);
  const times = recentSolves.map(getEffectiveTime);

  // Count DNFs
  const dnfCount = times.filter((t) => t === null).length;

  // For ao5 and above, allow 1 DNF (it becomes the worst time dropped)
  // For ao3 or smaller, no DNFs allowed
  if (n >= 5) {
    if (dnfCount > 1) return null; // Too many DNFs
  } else {
    if (dnfCount > 0) return null;
  }

  // Get valid times (non-DNF)
  const validTimes = times.filter((t): t is number => t !== null);

  if (n >= 5) {
    // Drop best and worst for ao5+
    if (validTimes.length < n - 1) return null;

    validTimes.sort((a, b) => a - b);

    // If there was a DNF, it's already the "worst" and dropped
    // Otherwise, drop the worst valid time
    const timesToAverage =
      dnfCount === 1
        ? validTimes.slice(1) // Drop only the best (DNF is worst)
        : validTimes.slice(1, -1); // Drop best and worst

    const sum = timesToAverage.reduce((acc, t) => acc + t, 0);
    return sum / timesToAverage.length;
  } else {
    // For small averages, just mean of all times
    const sum = validTimes.reduce((acc, t) => acc + t, 0);
    return sum / validTimes.length;
  }
}

/**
 * Get the best (minimum) average of N over all sliding windows in solve history.
 * Returns null if no valid aoN exists.
 */
export function getBestAverageOfN(solves: Solve[], n: number): number | null {
  if (solves.length < n) return null;

  let best: number | null = null;

  for (let i = 0; i <= solves.length - n; i++) {
    const window = solves.slice(i, i + n);
    const avg = calculateAverageOfN(window, n);
    if (avg !== null && (best === null || avg < best)) {
      best = avg;
    }
  }

  return best;
}

/**
 * Get the best (fastest) solve time
 */
export function getBestTime(solves: Solve[]): number | null {
  const validTimes = solves
    .map(getEffectiveTime)
    .filter((t): t is number => t !== null);

  if (validTimes.length === 0) return null;

  return Math.min(...validTimes);
}

/**
 * Get the worst (slowest) solve time (excluding DNF)
 */
export function getWorstTime(solves: Solve[]): number | null {
  const validTimes = solves
    .map(getEffectiveTime)
    .filter((t): t is number => t !== null);

  if (validTimes.length === 0) return null;

  return Math.max(...validTimes);
}

/**
 * Calculate mean of all valid solves
 */
export function getMean(solves: Solve[]): number | null {
  const validTimes = solves
    .map(getEffectiveTime)
    .filter((t): t is number => t !== null);

  if (validTimes.length === 0) return null;

  const sum = validTimes.reduce((acc, t) => acc + t, 0);
  return sum / validTimes.length;
}

/**
 * Get solve count statistics
 */
export function getSolveCount(solves: Solve[]): {
  total: number;
  valid: number;
  dnf: number;
} {
  const dnfCount = solves.filter((s) => s.penalty === 'dnf').length;
  return {
    total: solves.length,
    valid: solves.length - dnfCount,
    dnf: dnfCount,
  };
}

export interface Statistics {
  best: number | null;
  worst: number | null;
  ao5: number | null;
  ao12: number | null;
  ao50: number | null;
  ao100: number | null;
  mean: number | null;
  count: {
    total: number;
    valid: number;
    dnf: number;
  };
}

/**
 * Calculate all statistics at once
 */
export function calculateAllStatistics(solves: Solve[]): Statistics {
  return {
    best: getBestTime(solves),
    worst: getWorstTime(solves),
    ao5: calculateAverageOfN(solves, 5),
    ao12: calculateAverageOfN(solves, 12),
    ao50: calculateAverageOfN(solves, 50),
    ao100: calculateAverageOfN(solves, 100),
    mean: getMean(solves),
    count: getSolveCount(solves),
  };
}
