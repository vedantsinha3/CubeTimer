import { useState, useCallback, useRef, useEffect } from 'react';
import type { TimerState } from '../types';

export type TimerStatus = 'idle' | 'ready' | 'running' | 'stopped';

interface UseTimerReturn {
  time: number;
  status: TimerStatus;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  setReady: (ready: boolean) => void;
}

export function useTimer(): UseTimerReturn {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    isReady: false,
    startTime: null,
    elapsedTime: 0,
  });

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Determine the current status
  const status: TimerStatus = state.isRunning
    ? 'running'
    : state.isReady
    ? 'ready'
    : state.elapsedTime > 0
    ? 'stopped'
    : 'idle';

  // Update elapsed time using requestAnimationFrame for smooth updates
  const updateTime = useCallback(() => {
    if (startTimeRef.current !== null) {
      const now = performance.now();
      const elapsed = now - startTimeRef.current;
      setState((prev) => ({ ...prev, elapsedTime: elapsed }));
      animationFrameRef.current = requestAnimationFrame(updateTime);
    }
  }, []);

  const startTimer = useCallback(() => {
    const now = performance.now();
    startTimeRef.current = now;
    setState({
      isRunning: true,
      isReady: false,
      startTime: now,
      elapsedTime: 0,
    });
    animationFrameRef.current = requestAnimationFrame(updateTime);
  }, [updateTime]);

  const stopTimer = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (startTimeRef.current !== null) {
      const finalTime = performance.now() - startTimeRef.current;
      startTimeRef.current = null;
      setState((prev) => ({
        ...prev,
        isRunning: false,
        elapsedTime: finalTime,
      }));
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    startTimeRef.current = null;
    setState({
      isRunning: false,
      isReady: false,
      startTime: null,
      elapsedTime: 0,
    });
  }, []);

  const setReady = useCallback((ready: boolean) => {
    setState((prev) => ({ ...prev, isReady: ready }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    time: state.elapsedTime,
    status,
    startTimer,
    stopTimer,
    resetTimer,
    setReady,
  };
}

// Helper function to format time in MM:SS.ms format
export function formatTime(ms: number): string {
  if (ms === 0) return '0.00';

  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes}:${seconds.toFixed(2).padStart(5, '0')}`;
  }

  return seconds.toFixed(2);
}
