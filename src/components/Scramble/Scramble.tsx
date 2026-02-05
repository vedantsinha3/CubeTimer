import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { generateScramble } from '../../utils/scrambleGenerator';

interface ScrambleProps {
  onScrambleChange?: (scramble: string) => void;
  triggerNew?: number;
}

const ScrambleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const ScrambleLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const ScrambleText = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  line-height: 1.8;
  letter-spacing: 0.08em;
  max-width: 700px;
  word-wrap: break-word;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
`;

const RegenerateButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surfaceLight};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.primary};
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

  useEffect(() => {
    if (triggerNew !== undefined && triggerNew > 0) {
      regenerate();
    }
  }, [triggerNew, regenerate]);

  useEffect(() => {
    onScrambleChange?.(scramble);
  }, []);

  return (
    <ScrambleContainer>
      <ScrambleLabel>Scramble</ScrambleLabel>
      <ScrambleText>{scramble}</ScrambleText>
      <RegenerateButton onClick={regenerate}>New Scramble</RegenerateButton>
    </ScrambleContainer>
  );
}
