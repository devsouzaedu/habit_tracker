import type { Habit } from '../types';

interface HabitItemProps {
  habit: Habit;
  weekDays: string[];
  onToggle: (habitId: string, date: string) => void;
}

export const HabitItem = ({ habit, weekDays, onToggle }: HabitItemProps) => {
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="cyberpunk-card rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{habit.icon}</span>
          <div>
            <h3 className="font-semibold text-sm neon-text">{habit.name}</h3>
            <p className="text-xs text-base-content/60">
              Meta: {habit.goal} dias/semana
            </p>
          </div>
        </div>
        <div className="badge badge-cyberpunk text-xs">
          🔥 {habit.streak}
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((date, index) => {
          const isCompleted = habit.completedDates[date] || false;
          const dayDate = new Date(date);
          const isToday = date === new Date().toISOString().split('T')[0];
          
          return (
            <div key={date} className="text-center">
              <div className="text-xs text-base-content/60 mb-1">
                {dayNames[index]}
              </div>
              <div className="text-xs text-base-content/50 mb-1">
                {dayDate.getDate()}
              </div>
              <button
                onClick={() => onToggle(habit.id, date)}
                className={`
                  w-6 h-6 rounded border-2 transition-all duration-200
                  ${isCompleted 
                    ? 'checkbox-cyberpunk checked bg-accent border-accent neon-glow' 
                    : 'checkbox-cyberpunk border-accent/50 hover:border-accent'
                  }
                  ${isToday ? 'ring-2 ring-accent/50 pulse-neon' : ''}
                `}
              >
                {isCompleted && (
                  <svg className="w-3 h-3 text-black mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 