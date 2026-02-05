import { useState, useRef } from 'react';
import styled from 'styled-components';
import { Timer } from './components/Timer';
import { Scramble } from './components/Scramble';
import { Statistics } from './components/Statistics';
import { History } from './components/History';
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

const MainLayout = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  grid-template-rows: auto 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
  }
`;

const ScrambleSection = styled.div`
  grid-column: 1 / -1;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-column: 1;
  }
`;

const LeftSidebar = styled.aside`
  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    order: 3;
  }
`;

const CenterSection = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 300px;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    order: 1;
    min-height: 250px;
  }
`;

const RightSidebar = styled.aside`
  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    order: 2;
  }
`;

function App() {
  const [scrambleTrigger, setScrambleTrigger] = useState(0);
  const currentScrambleRef = useRef<string>('');
  const { addSolve } = useSolves();

  const handleScrambleChange = (scramble: string) => {
    currentScrambleRef.current = scramble;
  };

  const handleSolveComplete = (time: number) => {
    addSolve(time, currentScrambleRef.current);
    setScrambleTrigger((prev) => prev + 1);
  };

  return (
    <AppContainer>
      <Header>
        <Title>Cube Timer</Title>
      </Header>
      <MainLayout>
        <ScrambleSection>
          <Scramble
            onScrambleChange={handleScrambleChange}
            triggerNew={scrambleTrigger}
          />
        </ScrambleSection>
        <LeftSidebar>
          <Statistics />
        </LeftSidebar>
        <CenterSection>
          <Timer onSolveComplete={handleSolveComplete} />
        </CenterSection>
        <RightSidebar>
          <History />
        </RightSidebar>
      </MainLayout>
    </AppContainer>
  );
}

export default App;
