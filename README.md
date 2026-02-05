# Cube Timer

A modern, responsive web-based timer for 3x3 Rubik's cube solving with scramble generation, comprehensive statistics, and persistent solve history.

## Features

- **Precise Timer** - Millisecond precision timing with spacebar controls
- **WCA-Style Scrambles** - 20-move scrambles following WCA notation
- **Statistics** - Ao5, Ao12, Ao50, Ao100, best, worst, and mean times
- **Solve History** - Full history with +2 and DNF penalty support
- **Persistent Storage** - Solves saved to browser localStorage
- **Dark Theme** - Easy on the eyes during long sessions
- **Responsive Design** - Works on desktop and mobile

## Usage

### Timer Controls

- **Hold SPACE** for 300ms until timer turns green (ready state)
- **Release SPACE** to start timing
- **Press SPACE** to stop
- Touch/click also works on mobile

### Penalties

- **+2** - Adds 2 seconds to the solve time
- **DNF** - Did Not Finish (excluded from averages)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- React 18 + TypeScript
- Vite
- Styled Components
- LocalStorage for persistence
