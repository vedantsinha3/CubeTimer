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
  position: relative;
  overflow: hidden;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.background} 0%,
    ${({ theme }) => theme.colors.background}cc 70%,
    transparent 100%
  );
`;

const Logo = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NavButton = styled.button<{ $active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textMuted)};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.surfaceLight : 'transparent'};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceLight};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.lg};
  padding-top: 80px;
`;

const Panel = styled.aside<{ $position: 'left' | 'right'; $open: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  ${({ $position }) => $position}: 0;
  width: 320px;
  max-width: 90vw;
  background-color: ${({ theme }) => theme.colors.surface};
  border-${({ $position }) => ($position === 'left' ? 'right' : 'left')}: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg};
  padding-top: 80px;
  transform: translateX(${({ $position, $open }) =>
    $open ? '0' : $position === 'left' ? '-100%' : '100%'});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 90;
  overflow-y: auto;
`;

const Overlay = styled.div<{ $visible: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
  z-index: 80;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PanelTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 1.25rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceLight};
    color: ${({ theme }) => theme.colors.text};
  }
`;

function App() {
  const [scrambleTrigger, setScrambleTrigger] = useState(0);
  const [statsOpen, setStatsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const currentScrambleRef = useRef<string>('');
  const { addSolve } = useSolves();

  const handleScrambleChange = (scramble: string) => {
    currentScrambleRef.current = scramble;
  };

  const handleSolveComplete = (time: number) => {
    addSolve(time, currentScrambleRef.current);
    setScrambleTrigger((prev) => prev + 1);
  };

  const anyPanelOpen = statsOpen || historyOpen;

  return (
    <AppContainer>
      <Header>
        <Logo>Cube Timer</Logo>
        <HeaderActions>
          <NavButton
            $active={statsOpen}
            onClick={() => setStatsOpen(!statsOpen)}
          >
            Stats
          </NavButton>
          <NavButton
            $active={historyOpen}
            onClick={() => setHistoryOpen(!historyOpen)}
          >
            History
          </NavButton>
        </HeaderActions>
      </Header>

      <Overlay
        $visible={anyPanelOpen}
        onClick={() => {
          setStatsOpen(false);
          setHistoryOpen(false);
        }}
      />

      <Panel $position="left" $open={statsOpen}>
        <PanelHeader>
          <PanelTitle>Statistics</PanelTitle>
          <CloseButton onClick={() => setStatsOpen(false)}>×</CloseButton>
        </PanelHeader>
        <Statistics />
      </Panel>

      <Panel $position="right" $open={historyOpen}>
        <PanelHeader>
          <PanelTitle>History</PanelTitle>
          <CloseButton onClick={() => setHistoryOpen(false)}>×</CloseButton>
        </PanelHeader>
        <History />
      </Panel>

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
