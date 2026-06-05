import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Child, LearningProgress, Alphabet, Puzzle, Achievement, ParentAnalytics, DailyStats } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private childrenSubject = new BehaviorSubject<Child[]>(this.getDummyChildren());
  private currentChildSubject = new BehaviorSubject<Child | null>(null);
  private analyticsSubject = new BehaviorSubject<ParentAnalytics | null>(null);

  children$ = this.childrenSubject.asObservable();
  currentChild$ = this.currentChildSubject.asObservable();
  analytics$ = this.analyticsSubject.asObservable();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    const children = this.getDummyChildren();
    this.childrenSubject.next(children);
    if (children.length > 0) {
      this.setCurrentChild(children[0]);
    }
  }

  setCurrentChild(child: Child): void {
    this.currentChildSubject.next(child);
    this.loadAnalytics(child.id);
  }

  getCurrentChild(): Child | null {
    return this.currentChildSubject.value;
  }

  addChild(child: Child): void {
    const children = [...this.childrenSubject.value, child];
    this.childrenSubject.next(children);
  }

  updateChildProgress(childId: string, category: keyof LearningProgress, increment: number): void {
    const children = this.childrenSubject.value;
    const child = children.find(c => c.id === childId);
    if (child) {
      child.totalXP += increment;
      child.level = Math.floor(child.totalXP / 100) + 1;
      const progress = child.learningProgress[category];
      if (progress.completed < progress.total) {
        progress.completed += 1;
      }
      this.childrenSubject.next([...children]);
      this.currentChildSubject.next({ ...child });
      this.loadAnalytics(child.id);
    }
  }

  private loadAnalytics(childId: string): void {
    const analytics = this.getDummyAnalytics(childId);
    this.analyticsSubject.next(analytics);
  }

  private getDummyChildren(): Child[] {
    return [
      {
        id: '1',
        name: 'Emma',
        age: 5,
        avatar: '👧',
        totalXP: 1250,
        streak: 7,
        level: 12,
        learningProgress: {
          alphabets: { completed: 15, total: 26 },
          numbers: { completed: 8, total: 10 },
          animals: { completed: 12, total: 20 },
          puzzles: { completed: 5, total: 15 },
          stories: { completed: 3, total: 10 },
        },
        createdDate: new Date('2024-01-15'),
      },
      {
        id: '2',
        name: 'Liam',
        age: 7,
        avatar: '👦',
        totalXP: 2100,
        streak: 14,
        level: 21,
        learningProgress: {
          alphabets: { completed: 26, total: 26 },
          numbers: { completed: 10, total: 10 },
          animals: { completed: 18, total: 20 },
          puzzles: { completed: 10, total: 15 },
          stories: { completed: 8, total: 10 },
        },
        createdDate: new Date('2023-11-01'),
      },
      {
        id: '3',
        name: 'Sophia',
        age: 4,
        avatar: '👧',
        totalXP: 850,
        streak: 3,
        level: 8,
        learningProgress: {
          alphabets: { completed: 10, total: 26 },
          numbers: { completed: 5, total: 10 },
          animals: { completed: 7, total: 20 },
          puzzles: { completed: 2, total: 15 },
          stories: { completed: 1, total: 10 },
        },
        createdDate: new Date('2024-03-10'),
      },
    ];
  }

  private getDummyAnalytics(childId: string): ParentAnalytics {
    const weeklyStats: DailyStats[] = [
      {
        date: '2024-05-05',
        learningTime: 25,
        xpEarned: 150,
        sessionsCompleted: 3,
        areasLearned: ['Alphabets', 'Numbers'],
      },
      {
        date: '2024-05-06',
        learningTime: 20,
        xpEarned: 120,
        sessionsCompleted: 2,
        areasLearned: ['Animals'],
      },
      {
        date: '2024-05-07',
        learningTime: 30,
        xpEarned: 180,
        sessionsCompleted: 4,
        areasLearned: ['Puzzles', 'Stories'],
      },
      {
        date: '2024-05-08',
        learningTime: 15,
        xpEarned: 90,
        sessionsCompleted: 2,
        areasLearned: ['Numbers'],
      },
      {
        date: '2024-05-09',
        learningTime: 28,
        xpEarned: 170,
        sessionsCompleted: 3,
        areasLearned: ['Alphabets', 'Animals'],
      },
      {
        date: '2024-05-10',
        learningTime: 35,
        xpEarned: 200,
        sessionsCompleted: 5,
        areasLearned: ['Puzzles', 'Stories', 'Numbers'],
      },
      {
        date: '2024-05-11',
        learningTime: 22,
        xpEarned: 130,
        sessionsCompleted: 2,
        areasLearned: ['Alphabets'],
      },
    ];

    return {
      childId,
      totalLearningTime: 175,
      lastSessionDate: new Date('2024-05-11'),
      weeklyActiveDay: 6,
      averageSessionDuration: 25,
      subjectsProgress: {
        'Alphabets': 75,
        'Numbers': 85,
        'Animals': 60,
        'Puzzles': 40,
        'Stories': 35,
      },
      weeklyStats,
    };
  }

  getAlphabets(): Alphabet[] {
    return [
      {
        id: '1',
        letter: 'A',
        pronunciation: 'A For Apple',
        exampleWord: 'Apple',
        exampleImage: '🍎',
        soundUrl: 'assets/sounds/a.mp3',
      },
      {
        id: '2',
        letter: 'B',
        pronunciation: 'B For Ball',
        exampleWord: 'Ball',
        exampleImage: '⚽',
        soundUrl: 'assets/sounds/b.mp3',
      },
      {
        id: '3',
        letter: 'C',
        pronunciation: 'C For Cat',
        exampleWord: 'Cat',
        exampleImage: '🐱',
        soundUrl: 'assets/sounds/c.mp3',
      },
      {
        id: '4',
        letter: 'D',
        pronunciation: 'D For Dog',
        exampleWord: 'Dog',
        exampleImage: '🐕',
        soundUrl: 'assets/sounds/d.mp3',
      },
      {
        id: '5',
        letter: 'E',
        pronunciation: 'E For Elephant',
        exampleWord: 'Elephant',
        exampleImage: '🐘',
        soundUrl: 'assets/sounds/e.mp3',
      },
    ];
  }

  getPuzzles(): Puzzle[] {
    return [
      {
        id: '1',
        title: 'Castle Puzzle',
        description: 'Complete the magic castle',
        pieces: 6,
        difficulty: 'easy',
        image: '🏰',
        timeLimit: 110,
        maxStars: 3,
        completed: true,
        earnedStars: 3,
      },
      {
        id: '2',
        title: 'Rainbow Puzzle',
        description: 'Build the colorful rainbow',
        pieces: 8,
        difficulty: 'easy',
        image: '🌈',
        timeLimit: 180,
        maxStars: 3,
        completed: true,
        earnedStars: 2,
      },
      {
        id: '3',
        title: 'Jungle Adventure',
        description: 'Discover jungle animals',
        pieces: 12,
        difficulty: 'medium',
        image: '🌴',
        timeLimit: 300,
        maxStars: 3,
        completed: false,
        earnedStars: 0,
      },
    ];
  }

  getAchievements(): Achievement[] {
    return [
      {
        id: '1',
        name: 'Alphabet Master',
        description: 'Complete all alphabets',
        icon: '🔤',
        isLocked: false,
        progress: 100,
        unlockedDate: new Date('2024-04-15'),
      },
      {
        id: '2',
        name: 'Number Wizard',
        description: 'Learn all numbers',
        icon: '🔢',
        isLocked: false,
        progress: 100,
        unlockedDate: new Date('2024-04-20'),
      },
      {
        id: '3',
        name: 'Puzzle Champion',
        description: 'Solve 10 puzzles',
        icon: '🧩',
        isLocked: true,
        progress: 50,
      },
      {
        id: '4',
        name: 'Speed Demon',
        description: 'Complete puzzle in 60 seconds',
        icon: '⚡',
        isLocked: true,
        progress: 0,
      },
      {
        id: '5',
        name: '7 Day Streak',
        description: 'Learn 7 days in a row',
        icon: '🔥',
        isLocked: false,
        progress: 100,
        unlockedDate: new Date('2024-05-10'),
      },
    ];
  }
}
