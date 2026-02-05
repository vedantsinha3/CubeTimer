import styled from 'styled-components';
import { useSolves } from '../../context/SolvesContext';
import { formatTime } from '../../hooks/useTimer';
import { Solve, Penalty } from '../../types';
import { getEffectiveTime } from '../../utils/statistics';

const HistoryContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  max-height: 400px;
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const HistoryTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

const ClearButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.error};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const SolveList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surfaceLight};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 3px;
  }
`;

const SolveItem = styled.div<{ $isDnf?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surfaceLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  opacity: ${({ $isDnf }) => ($isDnf ? 0.6 : 1)};
`;

const SolveIndex = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  min-width: 30px;
`;

const SolveTime = styled.span<{ $isDnf?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  color: ${({ theme, $isDnf }) =>
    $isDnf ? theme.colors.error : theme.colors.text};
  text-decoration: ${({ $isDnf }) => ($isDnf ? 'line-through' : 'none')};
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing.sm};
`;

const PenaltyBadge = styled.span<{ $type: Penalty }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-left: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme, $type }) =>
    $type === '+2' ? theme.colors.warning : theme.colors.error};
  color: ${({ theme }) => theme.colors.background};
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionButton = styled.button<{ $active?: boolean; $variant?: 'danger' }>`
  padding: 4px 8px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme, $active, $variant }) =>
    $variant === 'danger'
      ? theme.colors.error
      : $active
      ? theme.colors.background
      : theme.colors.textMuted};
  background-color: ${({ theme, $active, $variant }) =>
    $variant === 'danger'
      ? 'transparent'
      : $active
      ? theme.colors.warning
      : theme.colors.surface};
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === 'danger' ? theme.colors.error : theme.colors.surfaceLight};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme, $variant }) =>
      $variant === 'danger' ? theme.colors.error : theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textMuted};
`;

function formatSolveTime(solve: Solve): string {
  const effectiveTime = getEffectiveTime(solve);
  if (effectiveTime === null) {
    return 'DNF';
  }
  return formatTime(effectiveTime);
}

interface HistoryItemProps {
  solve: Solve;
  index: number;
  onDelete: (id: string) => void;
  onPenaltyChange: (id: string, penalty: Penalty) => void;
}

function HistoryItem({
  solve,
  index,
  onDelete,
  onPenaltyChange,
}: HistoryItemProps) {
  const isDnf = solve.penalty === 'dnf';
  const isPlus2 = solve.penalty === '+2';

  const togglePlus2 = () => {
    onPenaltyChange(solve.id, isPlus2 ? 'none' : '+2');
  };

  const toggleDnf = () => {
    onPenaltyChange(solve.id, isDnf ? 'none' : 'dnf');
  };

  return (
    <SolveItem $isDnf={isDnf}>
      <SolveIndex>{index}.</SolveIndex>
      <SolveTime $isDnf={isDnf}>{formatSolveTime(solve)}</SolveTime>
      {solve.penalty !== 'none' && (
        <PenaltyBadge $type={solve.penalty}>
          {solve.penalty === '+2' ? '+2' : 'DNF'}
        </PenaltyBadge>
      )}
      <Actions>
        <ActionButton $active={isPlus2} onClick={togglePlus2}>
          +2
        </ActionButton>
        <ActionButton $active={isDnf} onClick={toggleDnf}>
          DNF
        </ActionButton>
        <ActionButton $variant="danger" onClick={() => onDelete(solve.id)}>
          ×
        </ActionButton>
      </Actions>
    </SolveItem>
  );
}

export function History() {
  const { solves, deleteSolve, updatePenalty, clearAllSolves } = useSolves();

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all solves?')) {
      clearAllSolves();
    }
  };

  return (
    <HistoryContainer>
      <HistoryHeader>
        <HistoryTitle>History</HistoryTitle>
        {solves.length > 0 && (
          <ClearButton onClick={handleClear}>Clear All</ClearButton>
        )}
      </HistoryHeader>
      <SolveList>
        {solves.length === 0 ? (
          <EmptyState>No solves yet. Start timing!</EmptyState>
        ) : (
          solves.map((solve, i) => (
            <HistoryItem
              key={solve.id}
              solve={solve}
              index={solves.length - i}
              onDelete={deleteSolve}
              onPenaltyChange={updatePenalty}
            />
          ))
        )}
      </SolveList>
    </HistoryContainer>
  );
}
