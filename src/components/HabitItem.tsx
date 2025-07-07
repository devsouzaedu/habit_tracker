import { useState } from 'react';
import type { Habit } from '../types';
import { HabitPriority } from '../types';

type HabitItemProps = {
  habit: Habit;
  weekDays: string[];
  onToggle: (habitId: string, date: string) => void; // Mudança: usar data ao invés de índice
  onUpdate: (habitId: string, updates: Partial<Habit>) => void;
};

const getDayLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Hoje';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ontem';
  } else {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  }
};

export const HabitItem = ({ habit, weekDays, onToggle, onUpdate }: HabitItemProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(habit.notes || '');

  const saveNotes = () => {
    onUpdate(habit.id, { notes });
    setShowNotes(false);
  };

  // Calcular progresso da semana
  const weekProgress = weekDays.filter(date => habit.completedDates[date]).length;
  const progressPercentage = (weekProgress / habit.goal) * 100;

  // Determinar cor do progresso baseado na prioridade
  const getProgressColor = () => {
    if (habit.priority === HabitPriority.HIGH) return 'progress-error';
    if (habit.priority === HabitPriority.MEDIUM) return 'progress-warning';
    return 'progress-info';
  };

  // Determinar se o hábito está no caminho certo
  const isOnTrack = weekProgress >= habit.goal;
  const needsAttention = weekProgress < habit.goal / 2;

  return (
    <div className="card bg-base-100 shadow-md mb-4 border-l-4" style={{ borderLeftColor: habit.color }}>
      <div className="card-body p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{habit.icon}</span>
            <div>
              <h3 className="font-semibold text-lg">{habit.name}</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className={`badge badge-sm ${
                  habit.priority === HabitPriority.HIGH ? 'badge-error' : 
                  habit.priority === HabitPriority.MEDIUM ? 'badge-warning' : 'badge-info'
                }`}>
                  {habit.priority === HabitPriority.HIGH ? 'Alta' : 
                   habit.priority === HabitPriority.MEDIUM ? 'Média' : 'Baixa'}
                </span>
                <span className="text-base-content/60">Meta: {habit.goal}/7 dias</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm font-medium">
                {weekProgress}/{habit.goal}
                {isOnTrack && <span className="text-success ml-1">✓</span>}
                {needsAttention && <span className="text-warning ml-1">⚠</span>}
              </div>
              <div className="text-xs text-base-content/60">
                Sequência: {habit.streak} dias
              </div>
            </div>
            
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? '▼' : '▶'}
            </button>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mb-3">
          <progress 
            className={`progress ${getProgressColor()} w-full`} 
            value={progressPercentage} 
            max="100"
          ></progress>
          <div className="text-xs text-center text-base-content/60 mt-1">
            {Math.round(progressPercentage)}% da meta
          </div>
        </div>

        {/* Detalhes expandidos */}
        {showDetails && (
          <div className="border-t pt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Detalhes</span>
              <button 
                className="btn btn-ghost btn-xs"
                onClick={() => setShowNotes(!showNotes)}
              >
                {showNotes ? 'Ocultar notas' : 'Adicionar notas'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div>
                <span className="text-base-content/60">Melhor sequência:</span>
                <span className="ml-1 font-medium">{habit.bestStreak} dias</span>
              </div>
              <div>
                <span className="text-base-content/60">Categoria:</span>
                <span className="ml-1 font-medium">{habit.category}</span>
              </div>
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
        
        <div className="grid grid-cols-7 gap-2 mt-3">
          {weekDays.map((date, index) => {
            const isToday = new Date(date).toDateString() === new Date().toDateString();
            const isCompleted = habit.completedDates[date] || false;
            
            return (
              <div key={index} className="flex flex-col items-center justify-center">
                <span className={`text-xs mb-2 text-center ${isToday ? 'font-bold text-primary' : ''}`}>
                  {getDayLabel(date)}
                </span>
                <label className="cursor-pointer flex justify-center">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggle(habit.id, date)}
                    className={`checkbox checkbox-lg ${
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