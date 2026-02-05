// WCA-style 3x3 scramble generator
// Moves: R, L, U, D, F, B with modifiers: (none), ', 2

type Face = 'R' | 'L' | 'U' | 'D' | 'F' | 'B';
type Modifier = '' | "'" | '2';

const FACES: Face[] = ['R', 'L', 'U', 'D', 'F', 'B'];
const MODIFIERS: Modifier[] = ['', "'", '2'];

// Opposite faces - moves on opposite faces can't be consecutive
// (e.g., R L R would be invalid as R and L are on the same axis)
const OPPOSITE_FACES: Record<Face, Face> = {
  R: 'L',
  L: 'R',
  U: 'D',
  D: 'U',
  F: 'B',
  B: 'F',
};

// Faces on the same axis
const AXIS_FACES: Record<Face, Face[]> = {
  R: ['R', 'L'],
  L: ['R', 'L'],
  U: ['U', 'D'],
  D: ['U', 'D'],
  F: ['F', 'B'],
  B: ['F', 'B'],
};

function getRandomFace(exclude: Face[] = []): Face {
  const availableFaces = FACES.filter((f) => !exclude.includes(f));
  return availableFaces[Math.floor(Math.random() * availableFaces.length)];
}

function getRandomModifier(): Modifier {
  return MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];
}

/**
 * Generates a WCA-style scramble for 3x3 cube
 * @param length Number of moves (default 20 for 3x3)
 * @returns Scramble string like "R U' F2 D R' B2 U F' R2 D'..."
 */
export function generateScramble(length: number = 20): string {
  const moves: string[] = [];
  let lastFace: Face | null = null;
  let secondLastFace: Face | null = null;

  for (let i = 0; i < length; i++) {
    // Determine which faces to exclude
    const excludeFaces: Face[] = [];

    // Can't repeat the same face
    if (lastFace) {
      excludeFaces.push(lastFace);
    }

    // If last two moves were on the same axis (e.g., R L),
    // can't do another move on that axis (e.g., R or L)
    if (lastFace && secondLastFace && AXIS_FACES[lastFace].includes(secondLastFace)) {
      excludeFaces.push(...AXIS_FACES[lastFace]);
    }

    const face = getRandomFace(excludeFaces);
    const modifier = getRandomModifier();

    moves.push(`${face}${modifier}`);

    // Update history
    secondLastFace = lastFace;
    lastFace = face;
  }

  return moves.join(' ');
}

/**
 * Parses a scramble string into individual moves
 * @param scramble Scramble string
 * @returns Array of move strings
 */
export function parseScramble(scramble: string): string[] {
  return scramble.split(' ').filter((move) => move.length > 0);
}
