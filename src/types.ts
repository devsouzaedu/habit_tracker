export type Habit = {
  id: string;
  name: string;
  description?: string;
  completedDates: Record<string, boolean>; // Mudança: armazenar por data específica (YYYY-MM-DD)
  category: HabitCategory;
  priority: HabitPriority;
  goal: number;
  color: string;
  icon: string;
  notes: string;
  streak: number;
  bestStreak: number;
};

export const HabitCategory = {
  WORK: 'WORK',
  LEITURA: 'LEITURA',
  ESCRITA: 'ESCRITA',
  DUOLINGO: 'DUOLINGO',
  GYM: 'GYM',
  AGUA: 'AGUA',
  LESS_ZAZA: 'LESS_ZAZA',
  NO_PMO: 'NO_PMO',
  NO_MST: 'NO_MST',
  ESTUDO: 'ESTUDO',
  CASACARE: 'CASACARE',
  CONTEUDO: 'CONTEUDO',
} as const;

export type HabitCategory = typeof HabitCategory[keyof typeof HabitCategory];

export const HabitPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

export type HabitPriority = typeof HabitPriority[keyof typeof HabitPriority];

export type HabitSettings = {
  priority?: HabitPriority;
  goal?: number;
  color?: string;
  icon?: string;
  notes?: string;
};

export type HabitTrackerState = {
  habits: Habit[];
  currentDate: string;
  currentWeek: string[];
  statistics: {
    totalCompletionRate: number;
    weeklyCompletionRate: number;
    bestHabit: string;
    worstHabit: string;
    longestStreak: number;
  };
};

export interface InstagramData {
  id: string;
  date: string;
  followers: number;
  following?: number;
  posts?: number;
  notes?: string;
}

export interface InstagramStats {
  totalGrowth: number;
  dailyGrowth: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  averageDailyGrowth: number;
  daysTracking: number;
  currentFollowers: number;
  startFollowers: number;
}

export interface DateRange {
  start: Date;
  end: Date;
} 