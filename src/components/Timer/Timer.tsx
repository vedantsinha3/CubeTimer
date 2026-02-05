import { useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTimer, formatTime } from '../../hooks/useTimer';
import type { TimerStatus } from '../../hooks/useTimer';

const READY_HOLD_TIME = 300;

interface TimerProps {
  onSolveComplete?: (time: number) => void;
  ao5?: number | null;
}

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

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
  -webkit-tap-highlight-color: transparent;
`;

const TimeDisplay = styled.div<{ $status: TimerStatus }>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.timer};
  font-weight: 600;
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
  letter-spacing: -0.03em;
  transition: color 0.15s ease;
  animation: ${({ $status }) => ($status === 'running' ? pulse : 'none')} 2s ease-in-out infinite;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.timerMobile};
  }
`;

const Instructions = styled.p<{ $visible: boolean }>`
  color: ${({ theme }) => theme.colors.textDim};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  text-align: center;
  letter-spacing: 0.02em;
`;

const StatusDot = styled.div<{ $status: TimerStatus }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme, $status }) => {
    switch ($status) {
      case 'ready':
        return theme.colors.timerReady;
      case 'running':
        return theme.colors.warning;
      case 'stopped':
        return theme.colors.primary;
      default:
        return theme.colors.textDim;
    }
  }};
  transition: background-color 0.15s ease;
`;

const Ao5Display = styled.div<{ $visible: boolean }>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing.md};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;

  span {
    color: ${({ theme }) => theme.colors.textDim};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin-right: ${({ theme }) => theme.spacing.sm};
  }
`;

export function Timer({ onSolveComplete, ao5 }: TimerProps) {
  const { time, status, startTimer, stopTimer, resetTimer, setReady } = useTimer();
  const holdTimeoutRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);
  const solveRecordedRef = useRef(false);

  const handleStart = useCallback(() => {
    if (status === 'ready') {
      solveRecordedRef.current = false;
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

  useEffect(() => {
    if (status === 'stopped' && time > 0 && onSolveComplete && !solveRecordedRef.current) {
      solveRecordedRef.current = true;
      onSolveComplete(time);
    }
  }, [status, time, onSolveComplete]);

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
        return 'Hold SPACE to ready';
      case 'ready':
        return 'Release to start';
      case 'running':
        return '';
      case 'stopped':
        return 'Hold SPACE for next';
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
      <StatusDot $status={status} />
      <TimeDisplay $status={status}>{formatTime(time)}</TimeDisplay>
      <Ao5Display $visible={status !== 'running' && ao5 !== null && ao5 !== undefined}>
        <span>ao5</span>
        {ao5 !== null && ao5 !== undefined ? formatTime(ao5) : '—'}
      </Ao5Display>
      <Instructions $visible={status !== 'running'}>
        {getInstructions()}
      </Instructions>
    </TimerContainer>
  );
}
