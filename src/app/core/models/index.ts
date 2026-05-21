// Child profile model
export interface Child {
    id: string;
    name: string;
    age: number;
    avatar: string;
    totalXP: number;
    streak: number;
    level: number;
    learningProgress: LearningProgress;
    createdDate: Date;
}

// Learning progress tracking
export interface LearningProgress {
    alphabets: { completed: number; total: number };
    numbers: { completed: number; total: number };
    animals: { completed: number; total: number };
    puzzles: { completed: number; total: number };
    stories: { completed: number; total: number };
}

// Learning category
export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    progress: number;
    itemCount: number;
}

// Alphabet learning item
export interface Alphabet {
    id: string;
    letter: string;
    pronunciation: string;
    exampleWord: string;
    exampleImage: string;
    soundUrl: string;
}

// Puzzle model
export interface Puzzle {
    id: string;
    title: string;
    description: string;
    pieces: number;
    difficulty: 'easy' | 'medium' | 'hard';
    image: string;
    timeLimit: number;
    maxStars: number;
    completed: boolean;
    earnedStars: number;
}

// Achievement/Badge model
export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedDate?: Date;
    isLocked: boolean;
    progress: number; // 0-100
}

// Reward model
export interface Reward {
    id: string;
    type: 'badge' | 'trophy' | 'coin';
    name: string;
    description: string;
    icon: string;
    earnedCount: number;
    earnedDate: Date;
}

// Parent analytics
export interface ParentAnalytics {
    childId: string;
    totalLearningTime: number; // minutes
    lastSessionDate: Date;
    weeklyActiveDay: number;
    averageSessionDuration: number; // minutes
    subjectsProgress: {
        [key: string]: number; // percentage
    };
    weeklyStats: DailyStats[];
}

export interface DailyStats {
    date: string;
    learningTime: number;
    xpEarned: number;
    sessionsCompleted: number;
    areasLearned: string[];
}

// User type
export type UserType = 'child' | 'parent';
