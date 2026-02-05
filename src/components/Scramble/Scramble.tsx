import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { generateScramble } from '../../utils/scrambleGenerator';

interface ScrambleProps {
  onScrambleChange?: (scramble: string) => void;
  triggerNew?: number; // Increment to trigger new scramble
}

const ScrambleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
`;

const ScrambleText = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  line-height: 1.6;
  letter-spacing: 0.05em;
  max-width: 600px;
  word-wrap: break-word;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
`;

const RegenerateButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surfaceLight};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export function Scramble({ onScrambleChange, triggerNew }: ScrambleProps) {
  const [scramble, setScramble] = useState(() => generateScramble());

  const regenerate = useCallback(() => {
    const newScramble = generateScramble();
    setScramble(newScramble);
    onScrambleChange?.(newScramble);
  }, [onScrambleChange]);

  // Generate new scramble when triggerNew changes
  useEffect(() => {
    if (triggerNew !== undefined && triggerNew > 0) {
      regenerate();
    }
  }, [triggerNew, regenerate]);

  // Notify parent of initial scramble
  useEffect(() => {
    onScrambleChange?.(scramble);
  }, []); // Only on mount

  return (
    <ScrambleContainer>
      <ScrambleText>{scramble}</ScrambleText>
      <RegenerateButton onClick={regenerate}>New Scramble</RegenerateButton>
    </ScrambleContainer>
  );
}
