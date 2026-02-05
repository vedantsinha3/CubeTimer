import styled from 'styled-components';
import { useSolves } from '../../context/SolvesContext';
import { calculateAllStatistics } from '../../utils/statistics';
import { formatTime } from '../../hooks/useTimer';

const StatsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const StatsTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: 600;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surfaceLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const StatLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const StatValue = styled.span<{ $highlight?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  color: ${({ theme, $highlight }) =>
    $highlight ? theme.colors.timerReady : theme.colors.text};
`;

const SolveCount = styled.div`
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceLight};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

function formatStatTime(ms: number | null): string {
  if (ms === null) return '-';
  return formatTime(ms);
}

export function Statistics() {
  const { solves } = useSolves();
  const stats = calculateAllStatistics(solves);

  return (
    <StatsContainer>
      <StatsTitle>Statistics</StatsTitle>
      <StatsGrid>
        <StatItem>
          <StatLabel>Best</StatLabel>
          <StatValue $highlight>{formatStatTime(stats.best)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Worst</StatLabel>
          <StatValue>{formatStatTime(stats.worst)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Ao5</StatLabel>
          <StatValue>{formatStatTime(stats.ao5)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Ao12</StatLabel>
          <StatValue>{formatStatTime(stats.ao12)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Ao50</StatLabel>
          <StatValue>{formatStatTime(stats.ao50)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Ao100</StatLabel>
          <StatValue>{formatStatTime(stats.ao100)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Mean</StatLabel>
          <StatValue>{formatStatTime(stats.mean)}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Solves</StatLabel>
          <StatValue>{stats.count.total}</StatValue>
        </StatItem>
      </StatsGrid>
      {stats.count.dnf > 0 && (
        <SolveCount>
          {stats.count.valid} valid / {stats.count.dnf} DNF
        </SolveCount>
      )}
    </StatsContainer>
  );
}
