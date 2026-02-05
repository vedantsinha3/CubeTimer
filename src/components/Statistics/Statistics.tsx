import styled from 'styled-components';
import { useSolves } from '../../context/SolvesContext';
import { calculateAllStatistics } from '../../utils/statistics';
import { formatTime } from '../../hooks/useTimer';

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const StatLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
`;

const StatValue = styled.span<{ $highlight?: boolean; $muted?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  color: ${({ theme, $highlight, $muted }) =>
    $highlight
      ? theme.colors.primary
      : $muted
      ? theme.colors.textDim
      : theme.colors.text};
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textDim};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

function formatStatTime(ms: number | null): string {
  if (ms === null) return '—';
  return formatTime(ms);
}

export function Statistics() {
  const { solves } = useSolves();
  const stats = calculateAllStatistics(solves);

  return (
    <StatsContainer>
      <StatRow>
        <StatLabel>Best</StatLabel>
        <StatValue $highlight>{formatStatTime(stats.best)}</StatValue>
      </StatRow>
      <StatRow>
        <StatLabel>Worst</StatLabel>
        <StatValue $muted>{formatStatTime(stats.worst)}</StatValue>
      </StatRow>
      <StatRow>
        <StatLabel>Mean</StatLabel>
        <StatValue>{formatStatTime(stats.mean)}</StatValue>
      </StatRow>

      <SectionTitle>Current Averages</SectionTitle>
      
      <StatRow>
        <StatLabel>Ao5</StatLabel>
        <StatValue>{formatStatTime(stats.ao5)}</StatValue>
      </StatRow>
      <StatRow>
        <StatLabel>Ao12</StatLabel>
        <StatValue>{formatStatTime(stats.ao12)}</StatValue>
      </StatRow>
      <StatRow>
        <StatLabel>Ao50</StatLabel>
        <StatValue>{formatStatTime(stats.ao50)}</StatValue>
      </StatRow>
      <StatRow>
        <StatLabel>Ao100</StatLabel>
        <StatValue>{formatStatTime(stats.ao100)}</StatValue>
      </StatRow>

      <SectionTitle>Best Averages</SectionTitle>

      <StatRow>
        <StatLabel>Best Ao5</StatLabel>
        <StatValue $highlight>{formatStatTime(stats.bestAo5)}</StatValue>
      </StatRow>
      <StatRow>
        <StatLabel>Best Ao12</StatLabel>
        <StatValue $highlight>{formatStatTime(stats.bestAo12)}</StatValue>
      </StatRow>
      <StatRow>
        <StatLabel>Best Ao100</StatLabel>
        <StatValue $highlight>{formatStatTime(stats.bestAo100)}</StatValue>
      </StatRow>

      <Divider />

      <StatRow>
        <StatLabel>Total Solves</StatLabel>
        <StatValue>{stats.count.total}</StatValue>
      </StatRow>
      {stats.count.dnf > 0 && (
        <StatRow>
          <StatLabel>DNFs</StatLabel>
          <StatValue $muted>{stats.count.dnf}</StatValue>
        </StatRow>
      )}
    </StatsContainer>
  );
}
