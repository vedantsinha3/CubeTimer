import { useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTimer, formatTime } from '../../hooks/useTimer';
import type { TimerStatus } from '../../hooks/useTimer';

const READY_HOLD_TIME = 300;

const WORST_MESSAGES = [
  'We don\'t talk about that one',
  'That one\'s going in the vault',
  'Rough one 😅',
  'At least you finished!',
  'Room for improvement!',
  'New worst! (we\'ve all been there)',
  'The cube wins this round',
  
];

interface TimerProps {
  onSolveComplete?: (time: number) => void;
  ao5?: number | null;
  ao12?: number | null;
  ao100?: number | null;
  isPB?: boolean;
  isBestAo5?: boolean;
  isBestAo100?: boolean;
  isWorstSolve?: boolean;
}

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const glowPulse = keyframes`
  0%, 100% { 
    text-shadow: 0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.4);
  }
  50% { 
    text-shadow: 0 0 30px rgba(34, 197, 94, 1), 0 0 60px rgba(34, 197, 94, 0.8), 0 0 90px rgba(34, 197, 94, 0.6);
  }
`;

const glowPulseRed = keyframes`
  0%, 100% { 
    text-shadow: 0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.5), 0 0 60px rgba(239, 68, 68, 0.3);
  }
  50% { 
    text-shadow: 0 0 30px rgba(239, 68, 68, 1), 0 0 60px rgba(239, 68, 68, 0.7), 0 0 90px rgba(239, 68, 68, 0.5);
  }
`;

const slideIn = keyframes`
  0% {
    transform: translateY(-20px) scale(0.8);
    opacity: 0;
  }
  50% {
    transform: translateY(5px) scale(1.05);
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
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

const TimeDisplay = styled.div<{ $status: TimerStatus; $isPB?: boolean; $isWorstSolve?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.timer};
  font-weight: 600;
  color: ${({ theme, $status, $isPB, $isWorstSolve }) => {
    if ($isPB && $status === 'stopped') return theme.colors.timerReady;
    if ($isWorstSolve && !$isPB && $status === 'stopped') return theme.colors.error;
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
  animation: ${({ $status, $isPB, $isWorstSolve }) => 
    $status === 'running' 
      ? pulse 
      : $isPB && $status === 'stopped'
      ? glowPulse
      : $isWorstSolve && !$isPB && $status === 'stopped'
      ? glowPulseRed
      : 'none'
  } 2s ease-in-out infinite;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.timerMobile};
  }
`;

const PBBadge = styled.div<{ $visible: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, #16a34a 100%);
  color: ${({ theme }) => theme.colors.background};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 700;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  animation: ${({ $visible }) => ($visible ? slideIn : 'none')} 0.5s ease-out;
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4);
`;

const WorstBadge = styled.div<{ $visible: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.error} 0%, #b91c1c 100%);
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  animation: ${({ $visible }) => ($visible ? slideIn : 'none')} 0.5s ease-out;
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
  text-align: center;
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

const averageGlow = keyframes`
  0%, 100% { 
    color: #737373;
    text-shadow: none;
  }
  50% { 
    color: #22c55e;
    text-shadow: 0 0 12px rgba(34, 197, 94, 0.8), 0 0 24px rgba(34, 197, 94, 0.4);
  }
`;

const AverageValue = styled.span<{ $isBest?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme, $isBest }) => ($isBest ? theme.colors.primary : theme.colors.textMuted)};
  font-weight: 500;
  animation: ${({ $isBest }) => ($isBest ? averageGlow : 'none')} 2s ease-in-out infinite;
`;

export function Timer({ onSolveComplete, ao5, ao12, ao100, isPB, isBestAo5, isBestAo100, isWorstSolve }: TimerProps) {
  const { time, status, startTimer, stopTimer, resetTimer, setReady } = useTimer();
  const holdTimeoutRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);
  const solveRecordedRef = useRef(false);
  const worstMessageRef = useRef(WORST_MESSAGES[0]);

  useEffect(() => {
    if (isWorstSolve) {
      worstMessageRef.current = WORST_MESSAGES[Math.floor(Math.random() * WORST_MESSAGES.length)];
    }
  }, [isWorstSolve]);

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
      <PBBadge $visible={isPB === true && status === 'stopped'}>
        🏆 New PB!
      </PBBadge>
      <WorstBadge $visible={isWorstSolve === true && status === 'stopped' && !isPB}>
        {worstMessageRef.current}
      </WorstBadge>
      <StatusDot $status={status} />
      <TimeDisplay $status={status} $isPB={isPB} $isWorstSolve={isWorstSolve}>{formatTime(time)}</TimeDisplay>
      <AveragesRow $visible={status !== 'running'}>
        <AverageItem>
          <AverageLabel>ao5</AverageLabel>
          <AverageValue $isBest={isBestAo5}>{ao5 != null ? formatTime(ao5) : '—'}</AverageValue>
        </AverageItem>
        <AverageItem>
          <AverageLabel>ao12</AverageLabel>
          <AverageValue>{ao12 != null ? formatTime(ao12) : '—'}</AverageValue>
        </AverageItem>
        <AverageItem>
          <AverageLabel>ao100</AverageLabel>
          <AverageValue $isBest={isBestAo100}>{ao100 != null ? formatTime(ao100) : '—'}</AverageValue>
        </AverageItem>
      </AveragesRow>
      <Instructions $visible={status !== 'running'}>
        {getInstructions()}
      </Instructions>
    </TimerContainer>
  );
}
