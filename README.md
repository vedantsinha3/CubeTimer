# Cube Timer

A sleek, minimal web-based timer for 3x3 Rubik's cube solving with scramble generation, comprehensive statistics, and persistent solve history.

**Live demo:** [https://cubetime-kappa.vercel.app/](https://cubetime-kappa.vercel.app/)

## Features

### Core Functionality
- **Precise Timer** - Millisecond precision timing with spacebar controls
- **WCA-Style Scrambles** - 20-move scrambles following WCA notation
- **Comprehensive Statistics** - Ao5, Ao12, Ao50, Ao100, best, worst, and mean times
- **Solve History** - Full history with +2 and DNF penalty support
- **Persistent Storage** - Solves automatically saved to browser localStorage

### Visual Feedback & Celebrations
- **Personal Best Celebration** - Confetti burst, green glow, and "New PB!" badge when you beat your best time
- **Best Average Indicators** - Green glow on ao5 and ao100 when they're your personal best
- **Worst Solve Indicator** - Red glow and funny messages when you hit a new worst time
- **Timer-Focused Design** - Large centered timer with collapsible side panels for stats and history

### UI/UX
- **Sleek Minimal Design** - Pure black/gray theme with subtle green accents
- **Responsive Layout** - Works beautifully on desktop and mobile
- **Collapsible Panels** - Stats and history slide in from the sides when needed
- **Smooth Animations** - Polished transitions and visual feedback

## Usage

### Timer Controls

- **Hold SPACE** for 300ms until timer turns green (ready state)
- **Release SPACE** to start timing
- **Press SPACE** to stop
- Touch/click also works on mobile

### Navigation

- Click **Stats** button in header to view statistics panel
- Click **History** button in header to view solve history panel
- Click outside panels or the × button to close panels

### Penalties

- **+2** - Adds 2 seconds to the solve time (click +2 button on solve)
- **DNF** - Did Not Finish (excluded from averages, click DNF button on solve)

### Statistics

- **Best** - Your fastest solve time
- **Worst** - Your slowest solve time
- **Ao5/Ao12/Ao50/Ao100** - Rolling averages (WCA style, drops best/worst for ao5+)
- **Mean** - Average of all valid solves


## Tech Stack

- **React 18** + **TypeScript** - Modern UI framework with type safety
- **Vite** - Fast build tool and dev server
- **Styled Components** - CSS-in-JS styling
- **LocalStorage** - Browser-based persistence

## Project Structure

```
src/
├── components/
│   ├── Timer/          # Main timer display and controls
│   ├── Scramble/       # Scramble display component
│   ├── Statistics/     # Statistics panel
│   ├── History/        # Solve history list
│   └── Confetti/       # Celebration animation
├── hooks/
│   ├── useTimer.ts     # Timer logic hook
│   └── useLocalStorage.ts
├── utils/
│   ├── scrambleGenerator.ts  # 3x3 scramble algorithm
│   └── statistics.ts         # Statistics calculations
├── context/
│   └── SolvesContext.tsx    # Global solve state management
└── styles/
    ├── theme.ts             # Design tokens
    └── GlobalStyles.ts      # Global CSS
```
