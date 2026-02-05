import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

const fall = keyframes`
  0% {
    transform: translateY(-10vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(720deg);
    opacity: 0;
  }
`;

const ConfettiContainer = styled.div<{ $active: boolean }>`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
`;

const Particle = styled.div<{ $delay: number; $duration: number; $left: number; $color: string; $size: number }>`
  position: absolute;
  top: 0;
  left: ${({ $left }) => $left}%;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size * 0.6}px;
  background-color: ${({ $color }) => $color};
  border-radius: 2px;
  animation: ${fall} ${({ $duration }) => $duration}s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
`;

const COLORS = ['#22c55e', '#4ade80', '#86efac', '#fbbf24', '#f59e0b', '#ffffff'];
const PARTICLE_COUNT = 50;

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 8,
  }));
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<ReturnType<typeof generateParticles>>([]);

  useEffect(() => {
    if (active) {
      setParticles(generateParticles());
      const timer = setTimeout(() => {
        onComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active && particles.length === 0) return null;

  return (
    <ConfettiContainer $active={active}>
      {particles.map((p) => (
        <Particle
          key={p.id}
          $left={p.left}
          $delay={p.delay}
          $duration={p.duration}
          $color={p.color}
          $size={p.size}
        />
      ))}
    </ConfettiContainer>
  );
}
