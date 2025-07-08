import { useState, useEffect } from 'react';
import { useHabitTracker } from './hooks/useHabitTracker';
import { HabitItem } from './components/HabitItem';
import { HabitStats } from './components/HabitStats';
import { DataControls } from './components/DataControls';
import { DashboardHeader } from './components/DashboardHeader';

// Função para gerar semana baseada em uma data específica
const getWeekFromDate = (date: Date): Date[] => {
  const weekDays = [];
  const startOfWeek = new Date(date);
  
  // Ajustar para começar no domingo
  const dayOfWeek = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - dayOfWeek;
  startOfWeek.setDate(diff);
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }
  
  return weekDays;
};

function App() {
  const { habits, toggleHabitCompletion, isLoading, refreshData } = useHabitTracker();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Forçar tema cyberpunk
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'cyberpunk');
  }, []);

  const weekDates = getWeekFromDate(selectedDate);
  const today = new Date().toDateString();
  const isCurrentWeek = weekDates.some(date => date.toDateString() === today);

  // Estatísticas do dia atual
  const todayString = new Date().toISOString().split('T')[0];
  const todayCompletedHabits = habits.filter(habit => habit.completedDates[todayString]).length;
  const todayProgress = Math.round((todayCompletedHabits / habits.length) * 100);
  const remainingHabits = habits.length - todayCompletedHabits;

  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const goToCurrentWeek = () => {
    setSelectedDate(new Date());
  };

  // Converter weekDates para strings para compatibilidade
  const weekDaysAsStrings = weekDates.map(date => date.toISOString().split('T')[0]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg loading-cyberpunk"></div>
        <span className="ml-4 text-lg green-text">Carregando hábitos...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-2 py-2 max-w-6xl">
        <DashboardHeader />
        
        {/* Estatísticas do Dia Atual */}
        <div className="cyberpunk-card rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold green-text">Progresso de Hoje</h2>
              <p className="text-sm text-base-content/70">
                {todayCompletedHabits}/{habits.length} hábitos completados
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold green-text">{todayProgress}%</div>
              {remainingHabits > 0 ? (
                <p className="text-sm text-warning">Restam {remainingHabits}</p>
              ) : (
                <p className="text-sm green-text">Tudo completo! 🎉</p>
              )}
            </div>
          </div>
          <div className="mt-3">
            <progress 
              className="progress progress-cyberpunk w-full h-3" 
              value={todayProgress} 
              max="100"
            ></progress>
          </div>
        </div>

        {/* Navegação de Semanas */}
        <div className="cyberpunk-card rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={goToPreviousWeek} 
              className="btn btn-sm btn-cyberpunk"
            >
              ← Anterior
            </button>
            
            <div className="text-center">
              <h2 className="text-lg font-semibold green-text">
                {isCurrentWeek ? 'Semana Atual' : 'Semana Histórica'}
              </h2>
              <p className="text-xs text-base-content/70">
                {weekDates[0].toLocaleDateString('pt-BR')} - {weekDates[6].toLocaleDateString('pt-BR')}
              </p>
            </div>
            
            <button 
              onClick={goToNextWeek} 
              className="btn btn-sm btn-cyberpunk"
            >
              Próxima →
            </button>
          </div>
          
          {!isCurrentWeek && (
            <div className="text-center mt-2">
              <button 
                onClick={goToCurrentWeek} 
                className="btn btn-xs btn-cyberpunk"
              >
                Ir para Semana Atual
              </button>
            </div>
          )}
        </div>

        {/* Lista de Hábitos */}
        <div className="cyberpunk-card rounded-lg p-3 mb-4">
          <h2 className="text-lg font-semibold mb-3 green-text">Hábitos</h2>
          <div className="space-y-2">
            {habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                weekDays={weekDaysAsStrings}
                onToggle={toggleHabitCompletion}
              />
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="cyberpunk-card rounded-lg p-3 mb-4">
          <HabitStats habits={habits} />
        </div>

        {/* Controles de Dados */}
        <div className="cyberpunk-card rounded-lg p-3">
          <DataControls onRefresh={refreshData} />
        </div>
      </div>
    </div>
  );
}

export default App;
