import { useState } from 'react';
import { useHabitTracker } from './hooks/useHabitTracker';
import { HabitItem } from './components/HabitItem';
import { HabitForm } from './components/HabitForm';
import { HabitStats } from './components/HabitStats';
import { ThemeToggle } from './components/ThemeToggle';
import { DataControls } from './components/DataControls';
import { InstagramTracker } from './components/InstagramTracker';

import { LoginScreen } from './components/LoginScreen';
import { DashboardHeader } from './components/DashboardHeader';
import { InspirationalQuote } from './components/InspirationalQuote';

import { HabitCategory, HabitPriority } from './types';
import './App.css';

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
    addHabit, 
    removeHabit,
    updateHabit,
    exportData,
    importData,
    refreshData
  } = useHabitTracker();

  const [activeTab, setActiveTab] = useState<'habits' | 'stats' | 'instagram' | 'settings'>('habits');

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('dashboard-authenticated', 'true');
  };

  // Mostrar tela de login se não estiver logado
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-base-200 p-1 sm:p-2">
      <div className="container mx-auto max-w-4xl">
        {/* Header com data, hora e clima */}
        <DashboardHeader />

        {/* Frase inspiracional */}
        <InspirationalQuote />

        <header className="navbar bg-base-100 rounded-box mb-2 shadow-lg p-2">
          <div className="flex-1">
            <div>
              <h1 className="text-xl font-bold px-2">Dashboard</h1>
              <div className="px-2 text-xs text-base-content/50 flex items-center gap-2">
                <span>👤 J.M.SOUZA</span>
                {isLoading && <span className="loading loading-spinner loading-xs"></span>}
                <button 
                  onClick={refreshData}
                  className="btn btn-ghost btn-xs"
                  title="Sincronizar dados"
                  disabled={isLoading}
                >
                  🔄
                </button>
              </div>
            </div>
          </div>
          <div className="flex-none">
            <ThemeToggle />
          </div>
        </header>

        <div className="tabs tabs-boxed mb-2 text-sm">
          <a 
            className={`tab ${activeTab === 'habits' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('habits')}
          >
            Hábitos
          </a>
          <a 
            className={`tab ${activeTab === 'stats' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Estatísticas
          </a>
          <a 
            className={`tab ${activeTab === 'instagram' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('instagram')}
          >
            📈 Instagram
          </a>
          <a 
            className={`tab ${activeTab === 'settings' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Configurações
          </a>
        </div>

        {activeTab === 'stats' && (
          <HabitStats habits={habits} statistics={statistics} />
        )}

        {activeTab === 'instagram' && (
                      <div className="bg-base-100 rounded-box p-3">
              <InstagramTracker />
            </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-3">
            <DataControls onExport={exportData} onImport={importData} />
            
            <div className="divider">Informações do Sistema</div>
            
            <div className="bg-base-100 rounded-box p-3 space-y-3">
                              <h3 className="text-base font-semibold">👤 Dashboard do J.M.SOUZA</h3>
              
              <div className="alert alert-success">
                <div>
                  <h4 className="font-semibold">✅ Supabase Ativo</h4>
                  <p className="text-sm">Seus dados são sincronizados automaticamente entre todos os dispositivos.</p>
                </div>
              </div>

              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Status</div>
                  <div className="stat-value text-sm flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Sincronizando
                      </>
                    ) : (
                      <>
                        ✅ Sincronizado
                      </>
                    )}
                  </div>
                  <div className="stat-desc">Dados salvos na nuvem</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Usuário</div>
                  <div className="stat-value text-sm">J.M.SOUZA</div>
                  <div className="stat-desc">Dashboard pessoal</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'habits' && (
          <>
            <HabitForm onAddHabit={addHabit} />

            <div className="divider">Seus Hábitos</div>

            {habits.length === 0 ? (
              <div className="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Você ainda não tem hábitos. Adicione um novo hábito para começar!</span>
              </div>
            ) : (
              <div>
                {Object.values(HabitCategory).map((category) => {
                  const habitsInCategory = habits.filter((h) => h.category === category);
                  if (habitsInCategory.length === 0) return null;
                  
                  return (
                    <div key={category} className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-bold">{category}</h2>
                        <div className="badge badge-neutral">
                          {habitsInCategory.length} {habitsInCategory.length === 1 ? 'hábito' : 'hábitos'}
                        </div>
                      </div>
                      
                      {habitsInCategory
                        .sort((a, b) => {
                          // Ordenar por prioridade (HIGH > MEDIUM > LOW)
                          const priorityOrder = { 
                            [HabitPriority.HIGH]: 0, 
                            [HabitPriority.MEDIUM]: 1, 
                            [HabitPriority.LOW]: 2 
                          };
                          return priorityOrder[a.priority] - priorityOrder[b.priority];
                        })
                        .map((habit) => (
                          <HabitItem
                            key={habit.id}
                            habit={habit}
                            weekDays={currentWeek}
                            onToggle={toggleHabitCompletion}
                            onRemove={removeHabit}
                            onUpdate={updateHabit}
                          />
                        ))
                      }
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        <footer className="footer footer-center p-2 bg-base-100 text-base-content rounded-box mt-4">
          <div>
            <p className="text-sm sm:text-base">© 2025 - Dashboard J.M.SOUZA</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
