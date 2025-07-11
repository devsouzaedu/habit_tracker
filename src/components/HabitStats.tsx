import type { Habit } from '../types';
import { HabitStatus } from '../types';

interface HabitStatsProps {
  habits: Habit[];
}

export const HabitStats = ({ habits }: HabitStatsProps) => {
  // Calcular estatísticas básicas
  const todayString = new Date(2024, 6, 11).toISOString().split('T')[0]; // 2024-07-11
  const todayCompleted = habits.filter(habit => habit.completedDates[todayString] === HabitStatus.COMPLETED).length;
  const todayFailed = habits.filter(habit => habit.completedDates[todayString] === HabitStatus.FAILED).length;
  const todayProgress = Math.round((todayCompleted / habits.length) * 100);

  // Calcular estatísticas da semana atual
  const today = new Date();
  const startOfWeek = new Date(today);
  
  // Ajustar para começar na segunda-feira (padrão brasileiro)
  const dayOfWeek = startOfWeek.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);
  
  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date.toISOString().split('T')[0]);
  }
  
  // Encontrar maior sequência
  const longestStreak = Math.max(...habits.map(habit => habit.streak), 0);

  // Top 5 hábitos por sequência
  const topHabits = [...habits]
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5);

  const medals = ['🥇', '🥈', '🥉', '🏅', '🏅'];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-3 green-text">Estatísticas</h2>
      
      {/* Cards principais */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="stat-cyberpunk rounded-lg p-3 text-center">
          <div className="text-2xl font-bold green-text">{todayProgress}%</div>
          <div className="text-xs text-base-content/70">Hoje</div>
        </div>
        
        <div className="stat-cyberpunk rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-500">{todayCompleted}</div>
          <div className="text-xs text-base-content/70">✅ Feitos</div>
        </div>
        
        <div className="stat-cyberpunk rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-500">{todayFailed}</div>
          <div className="text-xs text-base-content/70">❌ Falhas</div>
        </div>
        
        <div className="stat-cyberpunk rounded-lg p-3 text-center">
          <div className="text-2xl font-bold green-text">{longestStreak}</div>
          <div className="text-xs text-base-content/70">🔥 Sequência</div>
        </div>
        
        <div className="stat-cyberpunk rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-500">{habits.length - todayCompleted - todayFailed}</div>
          <div className="text-xs text-base-content/70">⏳ Pendentes</div>
        </div>
      </div>

      {/* Top 5 Hábitos */}
      <div className="cyberpunk-card rounded-lg p-3">
        <h3 className="font-semibold text-sm mb-2 green-text">🏆 Top Hábitos</h3>
        <div className="space-y-2">
          {topHabits.map((habit, index) => (
            <div key={habit.id} className="flex items-center justify-between p-2 rounded bg-base-200/50">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{medals[index]}</span>
                <span className="text-sm">{habit.icon}</span>
                <span className="text-sm font-medium">{habit.name}</span>
              </div>
              <div className="text-sm green-text font-bold">
                🔥 {habit.streak}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progresso Semanal */}
      <div className="cyberpunk-card rounded-lg p-3">
        <h3 className="font-semibold text-sm mb-2 green-text">📊 Progresso Semanal</h3>
        <div className="space-y-2">
          {habits.slice(0, 6).map(habit => {
            const habitWeekCompleted = weekDates.filter(date => habit.completedDates[date] === HabitStatus.COMPLETED).length;
            const habitWeekFailed = weekDates.filter(date => habit.completedDates[date] === HabitStatus.FAILED).length;
            const habitProgress = Math.round((habitWeekCompleted / habit.goal) * 100);
            
            return (
              <div key={habit.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs flex items-center space-x-1">
                    <span>{habit.icon}</span>
                    <span>{habit.name}</span>
                  </span>
                  <span className="text-xs flex items-center space-x-2">
                    <span className="text-green-500">✅{habitWeekCompleted}</span>
                    <span className="text-red-500">❌{habitWeekFailed}</span>
                    <span className="green-text">{habitWeekCompleted}/{habit.goal}</span>
                  </span>
                </div>
                <progress 
                  className="progress progress-cyberpunk w-full h-2" 
                  value={habitProgress} 
                  max="100"
                ></progress>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 