import { useState, useRef } from 'react';
import styled from 'styled-components';
import { Timer } from './components/Timer';
import { Scramble } from './components/Scramble';
import { useSolves } from './context/SolvesContext';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceLight};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

function App() {
  const [scrambleTrigger, setScrambleTrigger] = useState(0);
  const currentScrambleRef = useRef<string>('');
  const { addSolve } = useSolves();

  const handleScrambleChange = (scramble: string) => {
    currentScrambleRef.current = scramble;
  };

  const handleSolveComplete = (time: number) => {
    // Save the solve
    addSolve(time, currentScrambleRef.current);
    // Trigger new scramble after solve
    setScrambleTrigger((prev) => prev + 1);
  };

  return (
    <AppContainer>
      <Header>
        <Title>Cube Timer</Title>
      </Header>
      <MainContent>
        <Scramble
          onScrambleChange={handleScrambleChange}
          triggerNew={scrambleTrigger}
        />
        <Timer onSolveComplete={handleSolveComplete} />
      </MainContent>
    </AppContainer>
  );
}

export default App;
