import type { Habit } from '../types';
import { HabitStatus } from '../types';

interface HabitItemProps {
  habit: Habit;
  weekDays: string[];
  onToggle: (habitId: string, date: string) => void;
}

export const HabitItem = ({ habit, weekDays, onToggle }: HabitItemProps) => {
  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const getStatusStyle = (status: HabitStatus, isToday: boolean) => {
    const baseClasses = `
      w-6 h-6 rounded border-2 transition-all duration-200 flex items-center justify-center cursor-pointer
      ${isToday ? 'ring-2 ring-accent/50' : ''}
    `;

    switch (status) {
      case HabitStatus.COMPLETED:
        return `${baseClasses} bg-green-500 border-green-500 hover:bg-green-600`;
      case HabitStatus.FAILED:
        return `${baseClasses} bg-red-500 border-red-500 hover:bg-red-600`;
      default: // INACTIVE
        return `${baseClasses} border-accent/50 hover:border-accent bg-transparent hover:bg-accent/10`;
    }
  };

  const getStatusIcon = (status: HabitStatus) => {
    switch (status) {
      case HabitStatus.COMPLETED:
        return (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case HabitStatus.FAILED:
        return (
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="cyberpunk-card rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{habit.icon}</span>
          <div>
            <h3 className="font-semibold text-sm green-text">{habit.name}</h3>
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
          const status = habit.completedDates[date] || HabitStatus.INACTIVE;
          const dayDate = new Date(date);
          const isToday = date === new Date(2024, 6, 11).toISOString().split('T')[0]; // 2024-07-11
          
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
                className={getStatusStyle(status, isToday)}
                title={`${dayNames[index]} ${dayDate.getDate()} - ${
                  status === HabitStatus.COMPLETED ? 'Feito' :
                  status === HabitStatus.FAILED ? 'Falha' : 'Clique para marcar'
                }`}
              >
                {getStatusIcon(status)}
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Legenda dos estados */}
      <div className="flex items-center justify-center gap-4 mt-2 text-xs text-base-content/70">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border border-accent/50 rounded"></div>
          <span>Inativo</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Feito</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Falha</span>
        </div>
      </div>
    </div>
  );
}; 