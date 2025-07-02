import { useState } from 'react';
import type { Habit } from '../types';
import { HabitPriority } from '../types';

type HabitItemProps = {
  habit: Habit;
  weekDays: string[];
  onToggle: (habitId: string, dayIndex: number) => void;
  onRemove: (habitId: string) => void;
  onUpdate?: (habitId: string, updates: Partial<Habit>) => void;
};

export const HabitItem = ({ habit, weekDays, onToggle, onRemove, onUpdate }: HabitItemProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(habit.notes);

  const getDayLabel = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weekDay = weekDays[date.getDay()];
    return `${weekDay} ${day}`;
  };

  const getPriorityLabel = (priority: HabitPriority) => {
    switch (priority) {
      case HabitPriority.HIGH:
        return <span className="badge badge-error">Alta</span>;
      case HabitPriority.MEDIUM:
        return <span className="badge badge-warning">Média</span>;
      case HabitPriority.LOW:
        return <span className="badge badge-info">Baixa</span>;
      default:
        return null;
    }
  };

  const getProgressPercentage = () => {
    const completed = habit.completed.filter(Boolean).length;
    return Math.round((completed / habit.goal) * 100);
  };

  const saveNotes = () => {
    if (onUpdate) {
      onUpdate(habit.id, { notes });
      setShowNotes(false);
    }
  };

  const progressPercentage = getProgressPercentage();
  const isGoalMet = progressPercentage >= 100;

  return (
    <div className="card bg-base-100 shadow-xl mb-4" style={{ borderLeft: `4px solid ${habit.color}` }}>
      <div className="card-body p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 flex items-center justify-center rounded-md"
              style={{ backgroundColor: habit.color, color: 'white' }}
            >
              {habit.icon}
            </div>
            <h3 className="card-title text-lg">{habit.name}</h3>
            {getPriorityLabel(habit.priority)}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              className="btn btn-circle btn-xs btn-ghost" 
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? '▼' : '▶'}
            </button>
            <button 
              className="btn btn-circle btn-xs btn-ghost" 
              onClick={() => onRemove(habit.id)}
            >
              ✕
            </button>
          </div>
        </div>
        
        {showDetails && (
          <div className="mt-2 mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Progresso: {habit.completed.filter(Boolean).length}/{habit.goal} dias</span>
              <span>{progressPercentage}%</span>
            </div>
            <progress 
              className={`progress w-full ${isGoalMet ? 'progress-success' : 'progress-primary'}`} 
              value={progressPercentage > 100 ? 100 : progressPercentage} 
              max="100"
            ></progress>
            
            {habit.streak > 0 && (
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span className="text-warning">🔥 Sequência atual: {habit.streak} dias</span>
              </div>
            )}
            
            {habit.bestStreak > 0 && habit.bestStreak !== habit.streak && (
              <div className="flex items-center gap-1 mt-1 text-sm">
                <span className="text-info">⭐ Melhor sequência: {habit.bestStreak} dias</span>
              </div>
            )}
            
            <div className="mt-2">
              <button 
                className="btn btn-xs btn-outline"
                onClick={() => setShowNotes(!showNotes)}
              >
                {showNotes ? 'Ocultar notas' : (habit.notes ? 'Editar notas' : 'Adicionar notas')}
              </button>
            </div>
            
            {showNotes && (
              <div className="mt-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="textarea textarea-bordered w-full text-sm"
                  rows={3}
                  placeholder="Adicione notas sobre este hábito..."
                ></textarea>
                <div className="flex justify-end mt-1">
                  <button 
                    className="btn btn-xs btn-primary"
                    onClick={saveNotes}
                  >
                    Salvar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-7 gap-1 mt-2">
          {weekDays.map((day, index) => {
            const isToday = new Date(day).toDateString() === new Date().toDateString();
            
            return (
              <div key={index} className="flex flex-col items-center">
                <span className={`text-xs mb-1 ${isToday ? 'font-bold text-primary' : ''}`}>
                  {getDayLabel(day)}
                  {isToday && ' (hoje)'}
                </span>
                <label className="cursor-pointer">
                  <input
                    type="checkbox"
                    checked={habit.completed[index]}
                    onChange={() => onToggle(habit.id, index)}
                    className={`checkbox ${
                      habit.priority === HabitPriority.HIGH ? 'checkbox-error' : 
                      habit.priority === HabitPriority.MEDIUM ? 'checkbox-warning' : 'checkbox-info'
                    }`}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 