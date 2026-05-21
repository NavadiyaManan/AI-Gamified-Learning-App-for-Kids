# TinyGenius - Angular 19 Educational App

This is a modern, colorful, and gamified educational application for children aged 2-10, built with Angular 19, TailwindCSS, and Angular Material.

## Project Overview

**Framework**: Angular 19 (Standalone Components)
**Styling**: TailwindCSS 3.4 + PostCSS
**UI Library**: Angular Material
**Language**: TypeScript 5.6

## Architecture

### Folder Structure
- `src/app/core/models/` - Data models and interfaces
- `src/app/core/services/` - Application services (DataService)
- `src/app/shared/components/` - Shared components and pipes
- `src/app/features/` - Feature modules:
  - splash/ - Welcome screen
  - profile-selection/ - Child selection
  - dashboard/ - Main home screen
  - alphabet/ - Alphabet learning
  - puzzle/ - Puzzle game
  - rewards/ - Achievement gallery
  - parent-dashboard/ - Parent analytics

### Key Features
1. **7 Main Screens**: Splash, Profile Selection, Dashboard, Alphabet Learning, Puzzle Game, Rewards, Parent Dashboard
2. **Responsive Design**: Mobile-first approach with Tailwind utilities
3. **Animations**: Custom CSS animations (bounce, float, slide-up, scale-up, wiggle, pulse-glow)
4. **Color System**: Bright pastel gradients designed for children
5. **Data Management**: RxJS observables with mock data service

## Setup Instructions

1. Install dependencies: `npm install`
2. Start dev server: `npm start`
3. Build for production: `npm run build`

## Design Guidelines

- Use emoji icons throughout (🔤, 🔢, 🦁, 🧩, 📖, etc.)
- Apply Tailwind classes for styling (no inline CSS)
- Use gradient backgrounds with `bg-gradient-to-*` utilities
- Implement smooth transitions with `transition-all duration-300`
- Keep text child-friendly: large fonts, simple language

## Common Tasks

### Adding a New Screen
1. Create component in `src/app/features/new-feature/`
2. Add route in `app.routes.ts`
3. Import in the routing module
4. Add navigation button if needed

### Updating Colors
Edit `tailwind.config.js` - all colors are defined in the theme.extend.colors section

### Adding Animations
Define keyframes in `tailwind.config.js` and reference with `animate-*` classes

## Dependencies

- `@angular/animations` - Animation utilities
- `@angular/material` - Material Design components
- `tailwindcss` - CSS framework
- `rxjs` - Reactive programming

## Development Notes

- All components are standalone
- Uses TypeScript strict mode
- Implements reactive patterns with Observables
- Responsive breakpoints: Mobile (640px), Tablet (1024px), Desktop
- Mock data provides realistic user profiles and learning data

## Build & Deploy

Development: `npm start` → http://localhost:4200
Production: `npm run build` → dist/tiny-genius/

Can be deployed to Firebase, Netlify, Vercel, or any static hosting service.
