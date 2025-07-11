import { useState, useEffect } from 'react';
import { useHabitTracker } from './hooks/useHabitTracker';
import { HabitItem } from './components/HabitItem';
import { HabitStats } from './components/HabitStats';
import { DataControls } from './components/DataControls';
import { DashboardHeader } from './components/DashboardHeader';
import { InstagramTracker } from './components/InstagramTracker';
import { PDFViewer } from './components/PDFViewer';
import { NotesTab } from './components/NotesTab';
import { Calendar, Instagram, FileText, StickyNote } from 'lucide-react';

// Função para gerar semana baseada em uma data específica (segunda a domingo)
const getWeekFromDate = (date: Date): Date[] => {
  const weekDays = [];
  const startOfWeek = new Date(date);
  
  // Ajustar para começar na segunda-feira (padrão brasileiro)
  const dayOfWeek = startOfWeek.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Se for domingo, volta 6 dias, senão volta (dayOfWeek - 1) dias
  startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }
  
  return weekDays;
};

// Função para obter o nome do dia da semana e data formatada
const getCurrentDateInfo = () => {
  // Forçar data específica: 11/07/2024 (sexta-feira)
  const today = new Date(2024, 6, 11); // Mês 6 = julho (0-indexed)
  const dayNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const dayName = dayNames[today.getDay()];
  const dayNumber = today.getDate().toString().padStart(2, '0');
  
  return { dayName, dayNumber };
};

type TabType = 'habits' | 'instagram' | 'pdf' | 'notes';

function App() {
  const { habits, toggleHabitCompletion, isLoading, refreshData } = useHabitTracker();
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 6, 11)); // Forçar para 11/07/2024
  const [activeTab, setActiveTab] = useState<TabType>('habits');

  // Forçar tema cyberpunk
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'cyberpunk');
  }, []);

  const weekDates = getWeekFromDate(selectedDate);
  const today = new Date(2024, 6, 11).toDateString(); // Usar 11/07/2024 como "hoje"
  const isCurrentWeek = weekDates.some(date => date.toDateString() === today);
  const { dayName, dayNumber } = getCurrentDateInfo();

  // Estatísticas do dia atual
  const todayString = new Date(2024, 6, 11).toISOString().split('T')[0]; // 2024-07-11
  const todayCompletedHabits = habits.filter(habit => habit.completedDates[todayString] === 'completed').length;
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
    setSelectedDate(new Date(2024, 6, 11)); // Ir para 11/07/2024
  };

  // Converter weekDates para strings para compatibilidade
  const weekDaysAsStrings = weekDates.map(date => date.toISOString().split('T')[0]);

  const tabs = [
    { id: 'habits' as TabType, label: 'Hábitos', icon: Calendar },
    { id: 'instagram' as TabType, label: 'Instagram', icon: Instagram },
    { id: 'pdf' as TabType, label: 'Padrões', icon: FileText },
    { id: 'notes' as TabType, label: 'Notas', icon: StickyNote },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg loading-cyberpunk"></div>
        <span className="ml-4 text-lg green-text">Carregando hábitos...</span>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'habits':
        return (
          <div className="space-y-4">
            {/* Estatísticas do Dia Atual */}
            <div className="cyberpunk-card rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold green-text">
                    Hoje é {dayName}, dia {dayNumber}!
                  </h2>
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
            <div className="cyberpunk-card rounded-lg p-3">
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
            <div className="cyberpunk-card rounded-lg p-3">
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
            <div className="cyberpunk-card rounded-lg p-3">
              <HabitStats habits={habits} />
            </div>

            {/* Controles de Dados */}
            <div className="cyberpunk-card rounded-lg p-3">
              <DataControls onRefresh={refreshData} />
            </div>
          </div>
        );
      
      case 'instagram':
        return <InstagramTracker />;
      
      case 'pdf':
        return <PDFViewer />;
      
      case 'notes':
        return <NotesTab />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-2 py-2 max-w-6xl">
        <DashboardHeader />
        
        {/* Sistema de Abas */}
        <div className="cyberpunk-card rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center">
            <div className="tabs tabs-boxed bg-base-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab gap-2 ${
                      activeTab === tab.id 
                        ? 'tab-active bg-primary text-primary-content' 
                        : 'hover:bg-base-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Conteúdo da Aba Ativa */}
        <div className="min-h-96">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
