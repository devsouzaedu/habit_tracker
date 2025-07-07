import { useState, useEffect } from 'react';
import type { Habit, HabitTrackerState } from '../types';
import { HabitCategory, HabitPriority } from '../types';
import { supabase } from '../lib/supabase';

// Lista fixa de hábitos conforme especificado pelo usuário
const defaultHabits: Habit[] = [
  { 
    id: '1', 
    name: 'Gym', 
    category: HabitCategory.GYM, 
    completedDates: {},
    priority: HabitPriority.HIGH,
    goal: 4,
    color: '#dc2626',
    icon: '💪',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '2', 
    name: 'Duolingo', 
    category: HabitCategory.DUOLINGO, 
    completedDates: {},
    priority: HabitPriority.MEDIUM,
    goal: 7,
    color: '#65a30d',
    icon: '🗣️',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '3', 
    name: 'Read', 
    category: HabitCategory.LEITURA, 
    completedDates: {},
    priority: HabitPriority.HIGH,
    goal: 5,
    color: '#0891b2',
    icon: '📚',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '4', 
    name: 'Write', 
    category: HabitCategory.ESCRITA, 
    completedDates: {},
    priority: HabitPriority.MEDIUM,
    goal: 3,
    color: '#4f46e5',
    icon: '✏️',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '5', 
    name: 'Work 8hrs', 
    category: HabitCategory.WORK, 
    completedDates: {},
    priority: HabitPriority.MEDIUM,
    goal: 5,
    color: '#4338ca',
    icon: '💼',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '6', 
    name: 'No PMO', 
    category: HabitCategory.NO_PMO, 
    completedDates: {},
    priority: HabitPriority.MEDIUM,
    goal: 7,
    color: '#f97316',
    icon: '🧘',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '7', 
    name: 'No MST', 
    category: HabitCategory.NO_MST, 
    completedDates: {},
    priority: HabitPriority.LOW,
    goal: 7,
    color: '#8b5cf6',
    icon: '🛑',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '8', 
    name: 'Less Zaza max 8', 
    category: HabitCategory.LESS_ZAZA, 
    completedDates: {},
    priority: HabitPriority.LOW,
    goal: 7,
    color: '#6366f1',
    icon: '🚭',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '9', 
    name: 'Water', 
    category: HabitCategory.AGUA, 
    completedDates: {},
    priority: HabitPriority.HIGH,
    goal: 7,
    color: '#0ea5e9',
    icon: '💧',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '10', 
    name: 'Study', 
    category: HabitCategory.ESTUDO, 
    completedDates: {},
    priority: HabitPriority.HIGH,
    goal: 5,
    color: '#059669',
    icon: '📖',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '11', 
    name: 'Casacare', 
    category: HabitCategory.CASACARE, 
    completedDates: {},
    priority: HabitPriority.MEDIUM,
    goal: 4,
    color: '#7c3aed',
    icon: '🏠',
    notes: '',
    streak: 0,
    bestStreak: 0
  },
  { 
    id: '12', 
    name: 'Relax', 
    category: HabitCategory.CONTEUDO, 
    completedDates: {},
    priority: HabitPriority.MEDIUM,
    goal: 6,
    color: '#ea580c',
    icon: '🧘‍♂️',
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

// Função para calcular a sequência atual de um hábito baseado nas datas completadas
const calculateStreak = (completedDates: Record<string, boolean>): number => {
  const today = new Date();
  let streak = 0;
  
  // Verificar consecutivamente a partir de hoje para trás
  for (let i = 0; i < 365; i++) { // Máximo de 1 ano
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    if (completedDates[dateStr]) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Função para migrar dados antigos (se existirem) para o novo formato
const migrateOldData = (habits: any[]): Habit[] => {
  return habits.map(habit => {
    if (habit.completed && Array.isArray(habit.completed)) {
      // Migrar dados antigos: converter array semanal para datas específicas
      const completedDates: Record<string, boolean> = {};
      const currentWeek = getCurrentWeek();
      
      habit.completed.forEach((completed: boolean, index: number) => {
        if (completed && currentWeek[index]) {
          completedDates[currentWeek[index]] = true;
        }
      });
      
      return {
        ...habit,
        completedDates,
        completed: undefined // Remover campo antigo
      };
    }
    
    return habit;
  });
};

// Função para mesclar hábitos carregados com os hábitos padrão
const mergeWithDefaultHabits = (loadedHabits: any[]): Habit[] => {
  const mergedHabits: Habit[] = [];
  
  // Para cada hábito padrão, verificar se existe nos dados carregados
  defaultHabits.forEach(defaultHabit => {
    const loadedHabit = loadedHabits.find(h => h.name === defaultHabit.name || h.id === defaultHabit.id);
    
    if (loadedHabit) {
      // Se encontrou, mesclar os dados mantendo as datas completadas
      mergedHabits.push({
        ...defaultHabit,
        completedDates: loadedHabit.completedDates || loadedHabit.completed || {},
        streak: loadedHabit.streak || 0,
        bestStreak: loadedHabit.bestStreak || 0,
        notes: loadedHabit.notes || defaultHabit.notes
      });
    } else {
      // Se não encontrou, usar o hábito padrão
      mergedHabits.push(defaultHabit);
    }
  });
  
  return mergedHabits;
};

export const useHabitTracker = () => {
  const [state, setState] = useState<HabitTrackerState>({
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
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const userId = 'jose_dashboard_2025'; // ID fixo para José

  // Carregar dados do Supabase na inicialização
  useEffect(() => {
    loadFromSupabase();
  }, []);

  // Salvar no Supabase sempre que o estado mudar (com debounce)
  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        saveToSupabase();
      }, 1000); // Debounce de 1 segundo

      return () => clearTimeout(timeoutId);
    }
  }, [state, isLoading]);

  const loadFromSupabase = async () => {
    try {
      console.log('🔄 Carregando dados dos hábitos para:', userId);
      const { data, error } = await supabase
        .from('habits_data')
        .select('habit_data')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = row not found
        console.error('❌ Erro ao carregar dados:', error);
        console.log('📝 Usando dados padrão devido ao erro');
        setState(prevState => ({
          ...prevState,
          habits: defaultHabits,
          currentWeek: getCurrentWeek()
        }));
        setIsLoading(false);
        return;
      }

      if (data && data.habit_data && data.habit_data.habits && data.habit_data.habits.length > 0) {
        console.log('✅ Dados dos hábitos carregados:', data.habit_data);
        
        // Verificar se precisa migrar dados antigos
        const loadedHabits = data.habit_data.habits;
        
        // Se os hábitos carregados são diferentes dos padrão, mesclar com os padrão
        const mergedHabits = mergeWithDefaultHabits(loadedHabits);
        const migratedHabits = migrateOldData(mergedHabits);
        
        setState({
          ...data.habit_data,
          habits: migratedHabits,
          currentWeek: getCurrentWeek() // Sempre atualizar a semana atual
        });
      } else {
        console.log('📝 Nenhum dado encontrado ou dados vazios, usando dados padrão');
        setState(prevState => ({
          ...prevState,
          habits: defaultHabits,
          currentWeek: getCurrentWeek()
        }));
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Erro ao conectar com Supabase:', error);
      console.log('📝 Usando dados padrão devido ao erro de conexão');
      setState(prevState => ({
        ...prevState,
        habits: defaultHabits,
        currentWeek: getCurrentWeek()
      }));
      setIsLoading(false);
    }
  };

  const saveToSupabase = async () => {
    try {
      console.log('💾 Salvando dados dos hábitos para:', userId);
      console.log('📊 Estado atual:', state);
      
      // Primeiro, tentar atualizar
      const { error: updateError } = await supabase
        .from('habits_data')
        .update({
          habit_data: state,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      // Se não existir registro, inserir novo
      if (updateError && updateError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('habits_data')
          .insert({
            user_id: userId,
            habit_data: state,
            updated_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error('❌ Erro ao inserir dados:', insertError);
        } else {
          console.log('✅ Dados dos hábitos inseridos com sucesso');
        }
      } else if (updateError) {
        console.error('❌ Erro ao atualizar dados:', updateError);
      } else {
        console.log('✅ Dados dos hábitos atualizados com sucesso');
      }
    } catch (error) {
      console.error('❌ Erro ao conectar com Supabase:', error);
    }
  };

  // Atualizar estatísticas sempre que os hábitos mudarem
  useEffect(() => {
    updateStatistics();
  }, [state.habits]);

  const updateStatistics = () => {
    const currentWeek = getCurrentWeek();
    
    // Calcular estatísticas baseadas nas datas completadas
    let totalChecksThisWeek = 0;
    let totalPossibleThisWeek = 0;
    
    state.habits.forEach(habit => {
      currentWeek.forEach(date => {
        totalPossibleThisWeek++;
        if (habit.completedDates[date]) {
          totalChecksThisWeek++;
        }
      });
      
      // Atualizar streak do hábito
      const streak = calculateStreak(habit.completedDates);
      habit.streak = streak;
      habit.bestStreak = Math.max(habit.bestStreak || 0, streak);
    });

    const totalCompletionRate = totalPossibleThisWeek > 0 ? Math.round((totalChecksThisWeek / totalPossibleThisWeek) * 100) : 0;

    // Calcular a taxa de conclusão semanal (quantos hábitos foram feitos pelo menos uma vez)
    const completedThisWeek = state.habits.reduce(
      (total, habit) => total + (currentWeek.some(date => habit.completedDates[date]) ? 1 : 0),
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
      const weekCompletions = currentWeek.filter(date => habit.completedDates[date]).length;
      const completionRate = (weekCompletions / 7) * 100;
      
      if (completionRate > bestRate) {
        bestRate = completionRate;
        bestHabit = habit.name;
      }
      if (completionRate < worstRate && weekCompletions > 0) {
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

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setState(prevState => ({
      ...prevState,
      habits: prevState.habits.map(habit => {
        if (habit.id === habitId) {
          const newCompletedDates = { ...habit.completedDates };
          
          if (newCompletedDates[date]) {
            delete newCompletedDates[date]; // Remover se já estava marcado
          } else {
            newCompletedDates[date] = true; // Adicionar se não estava marcado
          }
          
          // Recalcular streak
          const streak = calculateStreak(newCompletedDates);
          const bestStreak = Math.max(habit.bestStreak || 0, streak);
          
          return { 
            ...habit, 
            completedDates: newCompletedDates,
            streak,
            bestStreak
          };
        }
        return habit;
      }),
    }));
  };

  // Função para obter status de um hábito em uma data específica
  const isHabitCompletedOnDate = (habitId: string, date: string): boolean => {
    const habit = state.habits.find(h => h.id === habitId);
    return habit ? !!habit.completedDates[date] : false;
  };

  // Função para obter todas as datas em que um hábito foi completado
  const getHabitCompletedDates = (habitId: string): string[] => {
    const habit = state.habits.find(h => h.id === habitId);
    return habit ? Object.keys(habit.completedDates).filter(date => habit.completedDates[date]) : [];
  };

  // Função para resetar dados e usar hábitos padrão
  const resetToDefaultHabits = async () => {
    console.log('🔄 Resetando para hábitos padrão...');
    
    const newState = {
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
    
    setState(newState);
    
    // Salvar os dados padrão no Supabase
    try {
      const { error } = await supabase
        .from('habits_data')
        .upsert({
          user_id: userId,
          habit_data: newState,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('❌ Erro ao resetar dados no Supabase:', error);
      } else {
        console.log('✅ Dados resetados com sucesso no Supabase');
      }
    } catch (error) {
      console.error('❌ Erro ao conectar com Supabase durante reset:', error);
    }
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
      // Migrar dados se necessário
      if (importedState.habits) {
        importedState.habits = migrateOldData(importedState.habits);
      }
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
    isLoading,
    userId,
    toggleHabitCompletion,
    updateHabit,
    exportData,
    importData,
    refreshData: loadFromSupabase,
    isHabitCompletedOnDate,
    getHabitCompletedDates,
    resetToDefaultHabits,
    // Removidas as funções addHabit e removeHabit conforme solicitado
  };
}; 