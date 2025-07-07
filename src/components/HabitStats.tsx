import type { Habit } from '../types';

type HabitStatsProps = {
  habits: Habit[];
  statistics: {
    totalCompletionRate: number;
    weeklyCompletionRate: number;
    bestHabit: string;
    worstHabit: string;
    longestStreak: number;
  };
  currentWeek: string[];
};

export const HabitStats = ({ habits, statistics, currentWeek }: HabitStatsProps) => {
  const getDailyCompletionRates = () => {
    const dailyRates = [];
    for (let i = 0; i < 7; i++) {
      const date = currentWeek[i];
      const completedForDay = habits.filter(habit => habit.completedDates[date]).length;
      const rate = habits.length > 0 ? Math.round((completedForDay / habits.length) * 100) : 0;
      dailyRates.push(rate);
    }
    return dailyRates;
  };

  const getCategoryCompletionRates = () => {
    const categories = new Map<string, { total: number; completed: number }>();
    
    habits.forEach(habit => {
      if (!categories.has(habit.category)) {
        categories.set(habit.category, { total: 0, completed: 0 });
      }
      
      const categoryStats = categories.get(habit.category)!;
      categoryStats.total += currentWeek.length;
      categoryStats.completed += currentWeek.filter(date => habit.completedDates[date]).length;
    });
    
    const result = Array.from(categories.entries()).map(([category, stats]) => ({
      category,
      rate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    }));
    
    return result;
  };

  const getPriorityCompletionRates = () => {
    const priorities = new Map<string, { total: number; completed: number }>();
    
    habits.forEach(habit => {
      if (!priorities.has(habit.priority)) {
        priorities.set(habit.priority, { total: 0, completed: 0 });
      }
      
      const priorityStats = priorities.get(habit.priority)!;
      priorityStats.total += currentWeek.length;
      priorityStats.completed += currentWeek.filter(date => habit.completedDates[date]).length;
    });
    
    const result = Array.from(priorities.entries()).map(([priority, stats]) => ({
      priority,
      rate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    }));
    
    return result;
  };

  const getTopHabits = () => {
    return habits
      .map(habit => {
        const weekCompletions = currentWeek.filter(date => habit.completedDates[date]).length;
        return {
          name: habit.name,
          rate: (weekCompletions / 7) * 100,
          streak: habit.streak,
          bestStreak: habit.bestStreak
        };
      })
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 3);
  };

  const dailyRates = getDailyCompletionRates();
  const categoryRates = getCategoryCompletionRates();
  const priorityRates = getPriorityCompletionRates();
  const topHabits = getTopHabits();
  
  // Gerar labels dos dias baseados nas datas reais
  const weekDayLabels = currentWeek.map(dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { weekday: 'short' });
  });

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Visão Geral</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Taxa de Conclusão</div>
                <div className="stat-value text-primary">{statistics.totalCompletionRate}%</div>
                <div className="stat-desc">Todos os hábitos</div>
              </div>
            </div>
            
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Hábitos Ativos</div>
                <div className="stat-value text-secondary">{statistics.weeklyCompletionRate}%</div>
                <div className="stat-desc">Esta semana</div>
              </div>
            </div>
            
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Maior Sequência</div>
                <div className="stat-value text-accent">{statistics.longestStreak}</div>
                <div className="stat-desc">Dias consecutivos</div>
              </div>
            </div>
          </div>
          
          <div className="divider">Desempenho Diário</div>
          
          <div className="grid grid-cols-7 gap-1">
            {dailyRates.map((rate, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs mb-1">{weekDayLabels[index]}</div>
                <div 
                  className="radial-progress text-primary" 
                  style={{"--value": rate, "--size": "3rem", "--thickness": "0.5rem"} as React.CSSProperties}
                >
                  <span className="text-xs">{rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Estatísticas Detalhadas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold mb-2">Por Categoria</h3>
              <div className="space-y-2">
                {categoryRates.map((item) => (
                  <div key={item.category} className="flex items-center">
                    <span className="w-24 text-sm">{item.category}</span>
                    <div className="flex-1">
                      <progress 
                        className="progress progress-primary w-full" 
                        value={item.rate} 
                        max="100"
                      ></progress>
                    </div>
                    <span className="w-12 text-right text-sm">{item.rate}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">Por Prioridade</h3>
              <div className="space-y-2">
                {priorityRates.map((item) => (
                  <div key={item.priority} className="flex items-center">
                    <span className="w-24 text-sm">
                      {item.priority === 'HIGH' ? '🔴 Alta' : 
                       item.priority === 'MEDIUM' ? '🟡 Média' : '🔵 Baixa'}
                    </span>
                    <div className="flex-1">
                      <progress 
                        className={`progress w-full ${
                          item.priority === 'HIGH' ? 'progress-error' : 
                          item.priority === 'MEDIUM' ? 'progress-warning' : 'progress-info'
                        }`}
                        value={item.rate} 
                        max="100"
                      ></progress>
                    </div>
                    <span className="w-12 text-right text-sm">{item.rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="divider">Melhores Desempenhos</div>
          
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Hábito</th>
                  <th>Taxa de Conclusão</th>
                  <th>Sequência Atual</th>
                  <th>Melhor Sequência</th>
                </tr>
              </thead>
              <tbody>
                {topHabits.map((habit, index) => (
                  <tr key={index}>
                    <td>{habit.name}</td>
                    <td>{Math.round(habit.rate)}%</td>
                    <td>{habit.streak} dias</td>
                    <td>{habit.bestStreak} dias</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {statistics.bestHabit && (
            <div className="alert alert-success mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Seu melhor hábito é <strong>{statistics.bestHabit}</strong>!</span>
            </div>
          )}
          
          {statistics.worstHabit && (
            <div className="alert alert-warning mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Seu hábito que precisa de mais atenção é <strong>{statistics.worstHabit}</strong>.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 