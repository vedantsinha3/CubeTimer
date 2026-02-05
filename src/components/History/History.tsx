import styled from 'styled-components';
import { useSolves } from '../../context/SolvesContext';
import { formatTime } from '../../hooks/useTimer';
import type { Solve, Penalty } from '../../types';
import { getEffectiveTime } from '../../utils/statistics';

const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px);
`;

const HistoryActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ClearButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;

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
`;

const SolveItem = styled.div<{ $isDnf?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surfaceLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  opacity: ${({ $isDnf }) => ($isDnf ? 0.5 : 1)};
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const SolveIndex = styled.span`
  color: ${({ theme }) => theme.colors.textDim};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  min-width: 32px;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const SolveTime = styled.span<{ $isDnf?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  color: ${({ theme, $isDnf }) =>
    $isDnf ? theme.colors.textDim : theme.colors.text};
  text-decoration: ${({ $isDnf }) => ($isDnf ? 'line-through' : 'none')};
  flex: 1;
`;

const PenaltyBadge = styled.span<{ $type: Penalty }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-right: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme, $type }) =>
    $type === '+2' ? theme.colors.warning : theme.colors.error};
  color: ${({ theme }) => theme.colors.background};
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s ease;

  ${SolveItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button<{ $active?: boolean; $variant?: 'danger' }>`
  padding: 4px 8px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 500;
  color: ${({ theme, $active, $variant }) =>
    $variant === 'danger'
      ? theme.colors.error
      : $active
      ? theme.colors.background
      : theme.colors.textMuted};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.warning : theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    background-color: ${({ theme, $variant, $active }) =>
      $variant === 'danger'
        ? theme.colors.error
        : $active
        ? theme.colors.warning
        : theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: ${({ theme }) => theme.colors.textDim};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const EmptyIcon = styled.span`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  opacity: 0.5;
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
      <SolveIndex>{index}</SolveIndex>
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
    if (window.confirm('Clear all solves?')) {
      clearAllSolves();
    }
  };

  if (solves.length === 0) {
    return (
      <HistoryContainer>
        <EmptyState>
          <EmptyIcon>⏱️</EmptyIcon>
          No solves yet
        </EmptyState>
      </HistoryContainer>
    );
  }

  return (
    <HistoryContainer>
      <HistoryActions>
        <ClearButton onClick={handleClear}>Clear All</ClearButton>
      </HistoryActions>
      <SolveList>
        {solves.map((solve, i) => (
          <HistoryItem
            key={solve.id}
            solve={solve}
            index={solves.length - i}
            onDelete={deleteSolve}
            onPenaltyChange={updatePenalty}
          />
        ))}
      </SolveList>
    </HistoryContainer>
  );
}
