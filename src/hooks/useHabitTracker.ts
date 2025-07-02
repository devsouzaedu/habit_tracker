import { useState, useEffect } from 'react';
import type { Habit, HabitTrackerState, HabitSettings } from '../types';
import { HabitCategory, HabitPriority } from '../types';

const STORAGE_KEY = 'habit-tracker-state';

const defaultHabits: Habit[] = [
  { 
    id: '1', 
    name: 'Trabalho', 
    category: HabitCategory.WORK, 
    completed: [false, false, false, false, false, false, false],
    priority: HabitPriority.MEDIUM,
    goal: 7,
    color: '#4338ca',
    icon: '💼',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '2', 
    name: 'Leitura', 
    category: HabitCategory.LEITURA, 
    completed: [false, false, false, false, false, false, false],
    priority: HabitPriority.HIGH,
    goal: 5,
    color: '#0891b2',
    icon: '📚',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '3', 
    name: 'Escrita', 
    category: HabitCategory.ESCRITA, 
    completed: [false, false, false, false, false, false, false],
    priority: HabitPriority.MEDIUM,
    goal: 3,
    color: '#4f46e5',
    icon: '✏️',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '4', 
    name: 'Duolingo', 
    category: HabitCategory.DUOLINGO, 
    completed: [false, false, false, false, false, false, false],
    priority: HabitPriority.MEDIUM,
    goal: 7,
    color: '#65a30d',
    icon: '🗣️',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '5', 
    name: 'Academia', 
    category: HabitCategory.GYM, 
    completed: [false, false, false, false, false, false, false],
    priority: HabitPriority.HIGH,
    goal: 4,
    color: '#dc2626',
    icon: '💪',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '6', 
    name: 'Água 2L', 
    category: HabitCategory.AGUA, 
    completed: [false, false, false, false, false, false, false],
    priority: HabitPriority.HIGH,
    goal: 7,
    color: '#0ea5e9',
    icon: '💧',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '7', 
    name: 'Menos Zaza (Max 6)', 
    category: HabitCategory.LESS_ZAZA, 
    completed: [false, false, false, false, false, false, false],
    priority: HabitPriority.LOW,
    goal: 7,
    color: '#6366f1',
    icon: '🚭',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '8', 
    name: 'No PMO', 
    category: HabitCategory.NO_PMO, 
    completed: [false, false, false, false, false, false, false],
    priority: HabitPriority.MEDIUM,
    goal: 7,
    color: '#f97316',
    icon: '🧘',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '9', 
    name: 'No MST', 
    category: HabitCategory.NO_MST, 
    completed: [false, false, false, false, false, false, false],
    priority: HabitPriority.LOW,
    goal: 7,
    color: '#8b5cf6',
    icon: '🛑',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
];

// Função para obter os dias a partir do dia atual
const getCurrentWeek = (): string[] => {
  const currentDate = new Date();
  const weekDays = [];
  
  // Começar do dia atual e ir para frente 7 dias
  for (let i = 0; i < 7; i++) {
    const day = new Date(currentDate);
    day.setDate(currentDate.getDate() + i);
    weekDays.push(day.toISOString().split('T')[0]);
  }

  return weekDays;
};

// Função para calcular a sequência atual de um hábito
const calculateStreak = (completed: boolean[]): number => {
  let streak = 0;
  for (let i = 0; i < completed.length; i++) {
    if (completed[i]) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

export const useHabitTracker = () => {
  const [state, setState] = useState<HabitTrackerState>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
    return {
      habits: defaultHabits,
      currentDate: new Date().toISOString().split('T')[0],
      currentWeek: getCurrentWeek(),
      statistics: {
        totalCompletionRate: 0,
        weeklyCompletionRate: 0,
        bestHabit: '',
        worstHabit: '',
        longestStreak: 0,
      }
    };
  });

  // Salvar o estado no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Verificar se a semana mudou e resetar os hábitos se necessário
  useEffect(() => {
    const currentWeek = getCurrentWeek();
    if (currentWeek[0] !== state.currentWeek[0]) {
      setState(prevState => ({
        ...prevState,
        currentWeek,
        habits: prevState.habits.map(habit => ({
          ...habit,
          completed: [false, false, false, false, false, false, false],
        })),
      }));
    }
  }, [state.currentWeek]);

  // Atualizar estatísticas sempre que os hábitos mudarem
  useEffect(() => {
    updateStatistics();
  }, [state.habits]);

  const updateStatistics = () => {
    const totalChecks = state.habits.reduce(
      (total, habit) => total + habit.completed.filter(Boolean).length, 
      0
    );
    const totalPossible = state.habits.length * 7;
    const totalCompletionRate = totalPossible > 0 ? Math.round((totalChecks / totalPossible) * 100) : 0;

    // Calcular a taxa de conclusão semanal
    const completedThisWeek = state.habits.reduce(
      (total, habit) => total + (habit.completed.some(Boolean) ? 1 : 0),
      0
    );
    const weeklyCompletionRate = state.habits.length > 0 ? Math.round((completedThisWeek / state.habits.length) * 100) : 0;

    // Encontrar o melhor e pior hábito
    let bestHabit = '';
    let worstHabit = '';
    let bestRate = -1;
    let worstRate = 101;
    let longestStreak = 0;

    state.habits.forEach(habit => {
      const completionRate = habit.completed.filter(Boolean).length / 7 * 100;
      if (completionRate > bestRate) {
        bestRate = completionRate;
        bestHabit = habit.name;
      }
      if (completionRate < worstRate && habit.completed.some(Boolean)) {
        worstRate = completionRate;
        worstHabit = habit.name;
      }

      // Atualizar a maior sequência
      if (habit.streak > longestStreak) {
        longestStreak = habit.streak;
      }
    });

    setState(prevState => ({
      ...prevState,
      statistics: {
        totalCompletionRate,
        weeklyCompletionRate,
        bestHabit,
        worstHabit,
        longestStreak,
      }
    }));
  };

  const toggleHabitCompletion = (habitId: string, dayIndex: number) => {
    setState(prevState => ({
      ...prevState,
      habits: prevState.habits.map(habit => {
        if (habit.id === habitId) {
          const newCompleted = [...habit.completed];
          newCompleted[dayIndex] = !newCompleted[dayIndex];
          
          // Atualizar streak
          const streak = calculateStreak(newCompleted);
          const bestStreak = Math.max(habit.bestStreak || 0, streak);
          
          return { 
            ...habit, 
            completed: newCompleted,
            streak,
            bestStreak
          };
        }
        return habit;
      }),
    }));
  };

  const addHabit = (name: string, category: HabitCategory, settings?: HabitSettings) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      category,
      completed: [false, false, false, false, false, false, false],
      priority: settings?.priority || HabitPriority.MEDIUM,
      goal: settings?.goal || 7,
      color: settings?.color || '#3b82f6',
      icon: settings?.icon || '✅',
      notes: settings?.notes || '',
      streak: 0,
      bestStreak: 0
    };

    setState(prevState => ({
      ...prevState,
      habits: [...prevState.habits, newHabit],
    }));
  };

  const removeHabit = (habitId: string) => {
    setState(prevState => ({
      ...prevState,
      habits: prevState.habits.filter(habit => habit.id !== habitId),
    }));
  };

  const updateHabit = (habitId: string, updates: Partial<Habit>) => {
    setState(prevState => ({
      ...prevState,
      habits: prevState.habits.map(habit => 
        habit.id === habitId ? { ...habit, ...updates } : habit
      ),
    }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(state);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `habit_tracker_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (jsonData: string) => {
    try {
      const importedState = JSON.parse(jsonData);
      setState(importedState);
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  };

  return {
    habits: state.habits,
    currentWeek: state.currentWeek,
    statistics: state.statistics,
    toggleHabitCompletion,
    addHabit,
    removeHabit,
    updateHabit,
    exportData,
    importData
  };
}; 