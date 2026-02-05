import { useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useTimer, formatTime, TimerStatus } from '../../hooks/useTimer';

const READY_HOLD_TIME = 300; // ms to hold spacebar before ready

interface TimerProps {
  onSolveComplete?: (time: number) => void;
}

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  user-select: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const TimeDisplay = styled.div<{ $status: TimerStatus }>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.timer};
  font-weight: 700;
  color: ${({ theme, $status }) => {
    switch ($status) {
      case 'ready':
        return theme.colors.timerReady;
      case 'running':
        return theme.colors.timerRunning;
      default:
        return theme.colors.text;
    }
  }};
  transition: color 0.15s ease;
  letter-spacing: -0.02em;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.timerMobile};
  }
`;

const Instructions = styled.p<{ $visible: boolean }>`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  text-align: center;
`;

export function Timer({ onSolveComplete }: TimerProps) {
  const { time, status, startTimer, stopTimer, resetTimer, setReady } = useTimer();
  const holdTimeoutRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);

  const handleStart = useCallback(() => {
    if (status === 'ready') {
      startTimer();
    }
  }, [status, startTimer]);

  const handleStop = useCallback(() => {
    if (status === 'running') {
      stopTimer();
    }
  }, [status, stopTimer]);

  const handleHoldStart = useCallback(() => {
    if (status === 'running') {
      handleStop();
      return;
    }

    if (status === 'stopped') {
      resetTimer();
    }

    isHoldingRef.current = true;

    // Start a timeout to set ready state
    holdTimeoutRef.current = window.setTimeout(() => {
      if (isHoldingRef.current) {
        setReady(true);
      }
    }, READY_HOLD_TIME);
  }, [status, handleStop, resetTimer, setReady]);

  const handleHoldEnd = useCallback(() => {
    isHoldingRef.current = false;

    if (holdTimeoutRef.current !== null) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    if (status === 'ready') {
      handleStart();
    } else {
      setReady(false);
    }
  }, [status, handleStart, setReady]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        handleHoldStart();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleHoldEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleHoldStart, handleHoldEnd]);

  // Trigger callback when solve completes
  useEffect(() => {
    if (status === 'stopped' && time > 0 && onSolveComplete) {
      onSolveComplete(time);
    }
  }, [status, time, onSolveComplete]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current !== null) {
        clearTimeout(holdTimeoutRef.current);
      }
    };
  }, []);

  const getInstructions = () => {
    switch (status) {
      case 'idle':
        return 'Hold SPACE to get ready, release to start';
      case 'ready':
        return 'Release to start!';
      case 'running':
        return 'Press SPACE to stop';
      case 'stopped':
        return 'Hold SPACE for new solve';
      default:
        return '';
    }
  };

  return (
    <TimerContainer
      onMouseDown={handleHoldStart}
      onMouseUp={handleHoldEnd}
      onMouseLeave={() => {
        if (isHoldingRef.current) {
          handleHoldEnd();
        }
      }}
      onTouchStart={handleHoldStart}
      onTouchEnd={handleHoldEnd}
    >
      <TimeDisplay $status={status}>{formatTime(time)}</TimeDisplay>
      <Instructions $visible={status !== 'running'}>
        {getInstructions()}
      </Instructions>
    </TimerContainer>
  );
}
