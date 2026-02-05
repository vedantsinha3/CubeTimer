import styled from 'styled-components';
import { Timer } from './components/Timer';

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
  const handleSolveComplete = (time: number) => {
    console.log('Solve completed:', time, 'ms');
  };

  return (
    <AppContainer>
      <Header>
        <Title>Cube Timer</Title>
      </Header>
      <MainContent>
        <Timer onSolveComplete={handleSolveComplete} />
      </MainContent>
    </AppContainer>
  );
}

export default App;
