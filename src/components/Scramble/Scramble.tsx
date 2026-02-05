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
  max-width: 600px;
  width: 100%;
`;

const ScrambleText = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  line-height: 2;
  letter-spacing: 0.1em;
  word-spacing: 0.3em;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const RefreshButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textDim};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  letter-spacing: 0.05em;
  text-transform: uppercase;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.surfaceLight};
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
      <ScrambleText>{scramble}</ScrambleText>
      <RefreshButton onClick={regenerate}>New Scramble</RefreshButton>
    </ScrambleContainer>
  );
}
