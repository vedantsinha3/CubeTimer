export type Penalty = 'none' | '+2' | 'dnf';

export interface Solve {
  id: string;
  time: number; // milliseconds
  scramble: string;
  timestamp: number; // Unix timestamp
  penalty: Penalty;
}

export interface TimerState {
  isRunning: boolean;
  isReady: boolean;
  startTime: number | null;
  elapsedTime: number;
}
