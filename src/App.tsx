import { useState } from 'react';
import { useHabitTracker } from './hooks/useHabitTracker';
import { HabitItem } from './components/HabitItem';
import { HabitForm } from './components/HabitForm';
import { HabitStats } from './components/HabitStats';
import { ThemeToggle } from './components/ThemeToggle';
import { DataControls } from './components/DataControls';
import { InstagramTracker } from './components/InstagramTracker';
import { SyncSettings } from './components/SyncSettings';
import { HabitCategory, HabitPriority } from './types';
import './App.css';

function App() {
  const { 
    habits, 
    currentWeek, 
    statistics,
    toggleHabitCompletion, 
    addHabit, 
    removeHabit,
    updateHabit,
    exportData,
    importData
  } = useHabitTracker();

  const [activeTab, setActiveTab] = useState<'habits' | 'stats' | 'instagram' | 'settings'>('habits');

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto max-w-6xl">
        <header className="navbar bg-base-100 rounded-box mb-6 shadow-lg">
          <div className="flex-1">
            <h1 className="text-2xl font-bold px-4">Tracker de Hábitos & Instagram</h1>
          </div>
          <div className="flex-none">
            <ThemeToggle />
          </div>
        </header>

        <div className="tabs tabs-boxed mb-6">
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
          <div className="bg-base-100 rounded-box p-6">
            <InstagramTracker />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <DataControls onExport={exportData} onImport={importData} />
            <div className="divider">Sincronização</div>
            <SyncSettings />
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
                    <div key={category} className="mb-6">
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

        <footer className="footer footer-center p-4 bg-base-100 text-base-content rounded-box mt-10">
          <div>
            <p>© 2025 - Tracker de Hábitos & Instagram</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
