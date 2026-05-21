import { Injectable } from '@angular/core';
import { Child } from '@core/models';

export interface Mission {
  id: string;
  title: string;
  icon: string;
  reward: number;
  progress: number;
  total: number;
  claimed: boolean;
}

export interface JourneyWorld {
  id: string;
  name: string;
  route: string;
  icon: string;
  color: string;
  completed: number;
  total: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'hat' | 'pet' | 'accessory' | 'background' | 'theme';
  icon: string;
  unlocked: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class GamificationService {
  getMissions(child: Child | null): Mission[] {
    const progress = child?.learningProgress;
    return [
      {
        id: 'letters-3',
        title: 'Learn 3 alphabets',
        icon: 'ABC',
        reward: 40,
        progress: Math.min(progress?.alphabets.completed ?? 0, 3),
        total: 3,
        claimed: (progress?.alphabets.completed ?? 0) >= 3,
      },
      {
        id: 'puzzle-1',
        title: 'Complete 1 puzzle',
        icon: 'Puzzle',
        reward: 60,
        progress: Math.min(progress?.puzzles.completed ?? 0, 1),
        total: 1,
        claimed: (progress?.puzzles.completed ?? 0) >= 1,
      },
      {
        id: 'story-1',
        title: 'Listen to a story',
        icon: 'Book',
        reward: 50,
        progress: Math.min(progress?.stories.completed ?? 0, 1),
        total: 1,
        claimed: (progress?.stories.completed ?? 0) >= 1,
      },
    ];
  }

  getWorlds(child: Child | null): JourneyWorld[] {
    const p = child?.learningProgress;
    return [
      this.world('alphabet', 'Alphabet Island', '/alphabet', 'Aa', 'from-sky-300 to-cyan-400', p?.alphabets.completed ?? 0, 26),
      this.world('numbers', 'Number Mountain', '/numbers', '123', 'from-amber-300 to-orange-400', p?.numbers.completed ?? 0, 10),
      this.world('animals', 'Animal Jungle', '/animals', 'Wild', 'from-emerald-300 to-lime-400', p?.animals.completed ?? 0, 20),
      this.world('puzzles', 'Puzzle Forest', '/puzzle', 'Logic', 'from-teal-300 to-green-500', p?.puzzles.completed ?? 0, 15),
      this.world('stories', 'Story Castle', '/stories', 'Once', 'from-rose-300 to-fuchsia-400', p?.stories.completed ?? 0, 10),
    ];
  }

  getInventory(child: Child | null): InventoryItem[] {
    const level = child?.level ?? 1;
    return [
      { id: 'cap', name: 'Star Cap', type: 'hat', icon: 'Cap', unlocked: level >= 2 },
      { id: 'crown', name: 'Tiny Crown', type: 'hat', icon: 'Crown', unlocked: level >= 8 },
      { id: 'spark', name: 'Spark Wand', type: 'accessory', icon: 'Wand', unlocked: level >= 5 },
      { id: 'buddy', name: 'Learning Buddy', type: 'pet', icon: 'Buddy', unlocked: level >= 10 },
      { id: 'space', name: 'Space Room', type: 'background', icon: 'Stars', unlocked: level >= 12 },
      { id: 'rainbow', name: 'Rainbow Theme', type: 'theme', icon: 'Theme', unlocked: level >= 4 },
    ];
  }

  getRecommendations(child: Child | null): string[] {
    if (!child) return ['Choose a learner to start today.'];
    const progress = child.learningProgress;
    const weakest = Object.entries(progress).sort((a, b) => {
      const aScore = a[1].completed / a[1].total;
      const bScore = b[1].completed / b[1].total;
      return aScore - bScore;
    })[0][0];

    return [
      `Recommended for ${child.name}: ${this.titleCase(weakest)} practice`,
      'Continue where you stopped: Alphabet Island',
      'Trending learning activity: Story Castle read-aloud',
      'Needs more practice: Puzzle Forest checkpoints',
    ];
  }

  getCoins(child: Child | null): number {
    return Math.floor((child?.totalXP ?? 0) * 0.8) + (child?.streak ?? 0) * 25;
  }

  private world(id: string, name: string, route: string, icon: string, color: string, completed: number, total: number): JourneyWorld {
    return { id, name, route, icon, color, completed, total };
  }

  private titleCase(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
