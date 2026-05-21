# TinyGenius - Educational App for Kids 🎓

A modern, colorful, and gamified educational application built with **Angular 19**, **TailwindCSS**, and **Angular Material** designed for children aged 2-10.

## 🎨 Features

### Design & UI
- **Bright Pastel Gradients**: Soft, eye-friendly colors specifically designed for children
- **Cartoon-Style UI**: Playful, rounded corners and floating cards
- **Smooth Animations**: Engaging bounce, float, and scale animations throughout
- **Responsive Design**: Mobile-first approach, works seamlessly on all devices
- **Child-Friendly Typography**: Large, easy-to-read fonts with appropriate spacing

### Learning Screens

1. **Splash Screen** 🚀
   - Animated mascot with welcome message
   - Eye-catching gradient background
   - Call-to-action button to start learning

2. **Child Profile Selection** 👧👦
   - Multiple child avatar cards
   - Quick stats (Level, XP, Streak)
   - Add new child functionality
   - Parent dashboard access

3. **Home Dashboard** 🏠
   - Daily learning streak tracking
   - XP points and level progress
   - Continue learning card
   - 5 Learning categories with progress bars:
     - 🔤 Alphabets
     - 🔢 Numbers
     - 🦁 Animals
     - 🧩 Puzzles
     - 📖 Stories
   - Bottom navigation for easy access

4. **Alphabet Learning Screen** 🔤
   - Large animated alphabet card
   - Example object with emoji
   - Pronunciation guide
   - Voice pronunciation button
   - Previous/Next navigation
   - Progress tracking

5. **Puzzle Game Screen** 🧩
   - Interactive puzzle pieces
   - Timer countdown
   - Stars earned system
   - Success animations
   - Progress indicators

6. **Rewards Screen** 🏆
   - Achievement badges gallery
   - Unlocked and locked achievements
   - Progress indicators for locked items
   - Trophy wall
   - Level progression display
   - Coin and trophy counts

7. **Parent Dashboard** 👨‍👩‍👧‍👦
   - Weekly learning time charts
   - Active days tracking
   - Subject progress breakdown
   - Weak subject identification
   - Performance recommendations
   - Learning analytics and insights
   - Printable report generation

## 🛠 Tech Stack

- **Framework**: Angular 19 (Standalone Components)
- **Styling**: TailwindCSS 3.4 + PostCSS
- **UI Library**: Angular Material
- **Language**: TypeScript 5.6
- **State Management**: RxJS Observables
- **Build Tool**: Angular CLI 19

## 📦 Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   │   └── index.ts (Data models)
│   │   └── services/
│   │       └── data.service.ts (Data management)
│   ├── shared/
│   │   └── components/
│   │       └── filter.pipe.ts (Shared pipes)
│   ├── features/
│   │   ├── splash/
│   │   ├── profile-selection/
│   │   ├── dashboard/
│   │   ├── alphabet/
│   │   ├── puzzle/
│   │   ├── rewards/
│   │   └── parent-dashboard/
│   ├── app.routes.ts (Routing config)
│   └── app.component.ts (Root component)
├── styles.css (Global Tailwind styles)
├── main.ts (Entry point)
└── index.html
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI 19

### Installation

1. **Navigate to project directory**:
   ```bash
   cd "d:/USERDATA/Manan/AI Gamified Learning App for Kids"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```
   or
   ```bash
   ng serve
   ```

4. **Open in browser**:
   ```
   http://localhost:4200
   ```

## 🎮 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Watch mode (rebuild on changes)
npm run watch

# Run tests
npm test

# Run linting
npm run lint
```

## 🎨 Design System

### Color Palette
- **Primary**: `#FF1493` (Hot Pink)
- **Secondary**: `#00CED1` (Turquoise)
- **Pastel Pink**: `#FFB3E6`
- **Pastel Blue**: `#B3D9FF`
- **Pastel Green**: `#B3FFB3`
- **Pastel Yellow**: `#FFFFE0`
- **Pastel Purple**: `#E6B3FF`
- **Pastel Orange**: `#FFD9B3`

### Typography
- **Font Family**: 'Fredoka', 'Quicksand'
- **Headings**: Bold, gradient text
- **Body**: Friendly, rounded appearance

### Animations
- `bounce-slow`: Slow bouncing effect
- `float`: Gentle floating motion
- `slide-up`: Smooth entrance from bottom
- `scale-up`: Pop-in appearance
- `wiggle`: Playful wiggle motion
- `pulse-glow`: Glowing pulse effect

## 📊 Data Models

### Child Profile
```typescript
{
  id: string;
  name: string;
  age: number;
  avatar: string;
  totalXP: number;
  streak: number;
  level: number;
  learningProgress: LearningProgress;
}
```

### Learning Progress
```typescript
{
  alphabets: { completed: number; total: number };
  numbers: { completed: number; total: number };
  animals: { completed: number; total: number };
  puzzles: { completed: number; total: number };
  stories: { completed: number; total: number };
}
```

## 🔧 Customization

### Adding a New Learning Category
1. Update the `LearningProgress` interface in `src/app/core/models/index.ts`
2. Add new component in `src/app/features/`
3. Update routing in `src/app/app.routes.ts`
4. Add route in the dashboard component

### Modifying Color Scheme
Edit `tailwind.config.js` to change the color palette:
```javascript
colors: {
  'custom-color': '#HEXCODE',
  // ...
}
```

### Adding New Animations
Update the `keyframes` section in `tailwind.config.js`:
```javascript
keyframes: {
  'animation-name': {
    // animation frames
  },
}
```

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

## ♿ Accessibility Features

- Large tap targets (minimum 48px)
- High contrast color schemes
- Clear navigation
- Descriptive labels
- Keyboard friendly
- ARIA labels on interactive elements

## 🐛 Sample Data

The application comes with pre-loaded dummy data including:
- 3 child profiles with different progress levels
- 5 alphabets (A-E) with pronunciation guides
- 3 puzzle games with varying difficulty
- 5 achievement badges
- Weekly learning analytics

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This generates an optimized build in the `dist/` directory.

### Deploy to Firebase, Netlify, or Vercel

**Firebase Hosting**:
```bash
npm run build
firebase deploy
```

**Netlify**:
```bash
npm run build
netlify deploy --prod --dir=dist/tiny-genius
```

**Vercel**:
```bash
npm run build
vercel --prod
```

## 📚 Learning Resources

- [Angular 19 Documentation](https://angular.io/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Angular Material](https://material.angular.io/)

## 🎯 Future Enhancements

- [ ] Audio pronunciation integration
- [ ] Multiplayer challenges
- [ ] Social sharing features
- [ ] Advanced analytics dashboard
- [ ] Offline mode support
- [ ] Multiple language support
- [ ] Custom content creation for parents
- [ ] Achievement animations
- [ ] More learning games

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**TinyGenius** - Making Learning Fun for Kids! 🌟
