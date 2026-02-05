import styled from 'styled-components';

interface AboutProps {
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  max-width: 480px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xxl};
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

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TechList = styled.ul`
  list-style: none;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TechItem = styled.li`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  padding: ${({ theme }) => theme.spacing.xs} 0;
  padding-left: ${({ theme }) => theme.spacing.md};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Footer = styled.p`
  color: ${({ theme }) => theme.colors.textDim};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export function About({ onClose }: AboutProps) {
  return (
    <Overlay onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>About Cube Timer</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <Description>
          A minimal web timer for 3×3 Rubik&apos;s cube solving. Track times, use WCA-style
          scrambles, and see rolling averages (ao5, ao12, ao100) with personal best and
          worst feedback. All data stays in your browser.
        </Description>

        <SectionTitle>Features</SectionTitle>
        <TechList>
          <TechItem>Space to start, any key to stop</TechItem>
          <TechItem>20-move WCA-style scrambles</TechItem>
          <TechItem>Statistics: best, worst, ao5, ao12, ao50, ao100, best averages</TechItem>
          <TechItem>Solve history with +2 and DNF</TechItem>
          <TechItem>Personal best celebration and worst-solve messages</TechItem>
          <TechItem>LocalStorage persistence</TechItem>
        </TechList>

        <SectionTitle>Tech</SectionTitle>
        <TechList>
          <TechItem>React 18 + TypeScript</TechItem>
          <TechItem>Vite</TechItem>
          <TechItem>Styled Components</TechItem>
        </TechList>

        <Footer>
          Cube Timer — no account, no server. Built for practice.
        </Footer>
      </Card>
    </Overlay>
  );
}
