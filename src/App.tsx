import { useState, useEffect } from 'react';
import { useHabitTracker } from './hooks/useHabitTracker';
import { HabitItem } from './components/HabitItem';
import { HabitStats } from './components/HabitStats';
import { ThemeToggle } from './components/ThemeToggle';
import { DataControls } from './components/DataControls';
import { InstagramTracker } from './components/InstagramTracker';

import { LoginScreen } from './components/LoginScreen';
import { DashboardHeader } from './components/DashboardHeader';
import { InspirationalQuote } from './components/InspirationalQuote';

import './App.css';

// Função para gerar semana baseada em uma data específica
const getWeekFromDate = (date: Date): string[] => {
  const weekDays = [];
  const startOfWeek = new Date(date);
  
  // Ajustar para começar na segunda-feira (ou manter como está se preferir domingo)
  const dayOfWeek = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - dayOfWeek;
  startOfWeek.setDate(diff);
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day.toISOString().split('T')[0]);
  }
  
  return weekDays;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Verificar se já está logado neste dispositivo
    return localStorage.getItem('dashboard-authenticated') === 'true';
  });
  
  const { 
    habits, 
    currentWeek, 
    statistics,
    isLoading,
    toggleHabitCompletion, 
    updateHabit,
    exportData,
    importData,
    refreshData
  } = useHabitTracker();

  const [activeTab, setActiveTab] = useState<'habits' | 'stats' | 'instagram' | 'settings'>('habits');
  const [viewDate, setViewDate] = useState(new Date()); // Data para visualização
  const [viewWeek, setViewWeek] = useState<string[]>([]); // Semana sendo visualizada

  // Atualizar semana de visualização quando viewDate muda
  useEffect(() => {
    setViewWeek(getWeekFromDate(viewDate));
  }, [viewDate]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('dashboard-authenticated', 'true');
  };

  // Função para navegar entre semanas
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setViewDate(newDate);
    setViewWeek(getWeekFromDate(newDate));
  };

  // Função para voltar para a semana atual
  const goToCurrentWeek = () => {
    const today = new Date();
    setViewDate(today);
    setViewWeek(getWeekFromDate(today));
  };

  // Verificar se estamos visualizando a semana atual
  const isCurrentWeek = () => {
    const today = new Date().toISOString().split('T')[0];
    return viewWeek.includes(today);
  };

  // Mostrar tela de login se não estiver logado
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
        <span className="ml-4">Carregando seus dados...</span>
      </div>
    );
  }

  // Usar a semana atual ou a semana de visualização dependendo da aba
  const displayWeek = activeTab === 'habits' ? (viewWeek.length > 0 ? viewWeek : currentWeek) : currentWeek;

  return (
    <div className="min-h-screen bg-base-200">
      <DashboardHeader />
      
      <div className="container mx-auto p-4 max-w-4xl">
        <InspirationalQuote />
        
        {/* Navegação por abas */}
        <div className="tabs tabs-boxed mb-6 justify-center">
          <button 
            className={`tab ${activeTab === 'habits' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('habits')}
          >
            📋 Hábitos
          </button>
          <button 
            className={`tab ${activeTab === 'stats' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Estatísticas
          </button>
          <button 
            className={`tab ${activeTab === 'instagram' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('instagram')}
          >
            📸 Instagram
          </button>
          <button 
            className={`tab ${activeTab === 'settings' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Configurações
          </button>
        </div>

        {/* Conteúdo das abas */}
        {activeTab === 'habits' && (
          <div>
            {/* Navegação de semanas */}
            <div className="card bg-base-100 shadow-md mb-6">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigateWeek('prev')}
                  >
                    ← Semana Anterior
                  </button>
                  
                  <div className="text-center">
                    <h3 className="font-semibold">
                      {viewWeek.length > 0 && (
                        <>
                          {new Date(viewWeek[0]).toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: 'short' 
                          })} - {new Date(viewWeek[6]).toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: 'short',
                            year: 'numeric'
                          })}
                        </>
                      )}
                    </h3>
                    {!isCurrentWeek() && (
                      <button 
                        className="btn btn-xs btn-primary mt-1"
                        onClick={goToCurrentWeek}
                      >
                        Ir para Semana Atual
                      </button>
                    )}
                    {isCurrentWeek() && (
                      <span className="badge badge-primary badge-sm mt-1">Semana Atual</span>
                    )}
                  </div>
                  
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigateWeek('next')}
                  >
                    Próxima Semana →
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Seus Hábitos Diários</h2>
              <p className="text-base-content/70 mb-4">
                {isCurrentWeek() 
                  ? "Marque os hábitos conforme você os completa. Os dados são salvos automaticamente."
                  : "Visualizando histórico de hábitos. Use a navegação acima para ver outras semanas."
                }
              </p>
            </div>

            {habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                weekDays={displayWeek}
                onToggle={toggleHabitCompletion}
                onUpdate={updateHabit}
              />
            ))}

            <div className="mt-8 text-center">
              <p className="text-sm text-base-content/60">
                💡 Dica: Use a navegação de semanas para ver seu histórico completo de hábitos!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <HabitStats 
            habits={habits} 
            statistics={statistics}
            currentWeek={currentWeek}
          />
        )}

        {activeTab === 'instagram' && (
          <InstagramTracker />
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Configurações</h2>
            
            <div className="grid gap-6">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Aparência</h3>
                  <ThemeToggle />
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Backup e Restauração</h3>
                  <DataControls 
                    onExport={exportData}
                    onImport={importData}
                    onRefresh={refreshData}
                  />
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Informações</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Versão:</strong> 2.0.0</p>
                    <p><strong>Hábitos fixos:</strong> Sistema não permite adicionar/remover hábitos</p>
                    <p><strong>Persistência:</strong> Dados salvos automaticamente no Supabase</p>
                    <p><strong>Histórico:</strong> Mantém registro completo de todos os dias</p>
                    <p><strong>Navegação:</strong> Use as setas para navegar entre semanas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
