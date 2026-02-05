import { useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTimer, formatTime } from '../../hooks/useTimer';
import type { TimerStatus } from '../../hooks/useTimer';

const READY_HOLD_TIME = 300;

interface TimerProps {
  onSolveComplete?: (time: number) => void;
  ao5?: number | null;
  ao12?: number | null;
  ao100?: number | null;
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

const AveragesRow = styled.div<{ $visible: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.lg};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const AverageItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const AverageLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textDim};
  text-transform: lowercase;
  margin-bottom: 2px;
`;

const AverageValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
`;

export function Timer({ onSolveComplete, ao5, ao12, ao100 }: TimerProps) {
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
      <AveragesRow $visible={status !== 'running'}>
        <AverageItem>
          <AverageLabel>ao5</AverageLabel>
          <AverageValue>{ao5 != null ? formatTime(ao5) : '—'}</AverageValue>
        </AverageItem>
        <AverageItem>
          <AverageLabel>ao12</AverageLabel>
          <AverageValue>{ao12 != null ? formatTime(ao12) : '—'}</AverageValue>
        </AverageItem>
        <AverageItem>
          <AverageLabel>ao100</AverageLabel>
          <AverageValue>{ao100 != null ? formatTime(ao100) : '—'}</AverageValue>
        </AverageItem>
      </AveragesRow>
      <Instructions $visible={status !== 'running'}>
        {getInstructions()}
      </Instructions>
    </TimerContainer>
  );
}
