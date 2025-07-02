import { useState } from 'react';
import { HabitCategory, HabitPriority } from '../types';

type HabitFormProps = {
  onAddHabit: (name: string, category: HabitCategory, settings: {
    priority: HabitPriority;
    goal: number;
    color: string;
    icon: string;
    notes: string;
  }) => void;
};

const ICONS = ['✅', '💪', '📚', '🏃', '💧', '🧠', '🧘', '🚭', '💼', '📝', '🗣️', '🛑', '🍎', '🥦', '🥗', '🏋️', '🧹', '🛌', '⏰'];
const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#f97316', // orange
  '#8b5cf6', // purple
  '#06b6d4', // cyan
];

export const HabitForm = ({ onAddHabit }: HabitFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>(HabitCategory.WORK);
  const [priority, setPriority] = useState<HabitPriority>(HabitPriority.MEDIUM);
  const [goal, setGoal] = useState(7);
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState(ICONS[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddHabit(name.trim(), category, {
        priority,
        goal,
        color,
        icon,
        notes
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setCategory(HabitCategory.WORK);
    setPriority(HabitPriority.MEDIUM);
    setGoal(7);
    setColor(COLORS[0]);
    setIcon(ICONS[0]);
    setNotes('');
    setIsOpen(false);
    setShowAdvanced(false);
  };

  return (
    <div className="mb-6">
      <button 
        className="btn btn-primary w-full mb-2" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Cancelar' : 'Adicionar Novo Hábito'}
      </button>

      {isOpen && (
        <div className="card bg-base-200 p-4">
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Nome do Hábito</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered"
                placeholder="Nome do hábito"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Categoria</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
                className="select select-bordered w-full"
              >
                {Object.values(HabitCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Prioridade</span>
              </label>
              <div className="flex gap-2">
                <label className="label cursor-pointer flex-1">
                  <span className="label-text mr-2">Baixa</span>
                  <input
                    type="radio"
                    name="priority"
                    className="radio radio-info"
                    checked={priority === HabitPriority.LOW}
                    onChange={() => setPriority(HabitPriority.LOW)}
                  />
                </label>
                <label className="label cursor-pointer flex-1">
                  <span className="label-text mr-2">Média</span>
                  <input
                    type="radio"
                    name="priority"
                    className="radio radio-warning"
                    checked={priority === HabitPriority.MEDIUM}
                    onChange={() => setPriority(HabitPriority.MEDIUM)}
                  />
                </label>
                <label className="label cursor-pointer flex-1">
                  <span className="label-text mr-2">Alta</span>
                  <input
                    type="radio"
                    name="priority"
                    className="radio radio-error"
                    checked={priority === HabitPriority.HIGH}
                    onChange={() => setPriority(HabitPriority.HIGH)}
                  />
                </label>
              </div>
            </div>

            <div className="form-control mb-4">
              <button 
                type="button" 
                className="btn btn-outline btn-sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? 'Ocultar opções avançadas' : 'Mostrar opções avançadas'}
              </button>
            </div>

            {showAdvanced && (
              <>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Meta semanal (dias)</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    value={goal}
                    onChange={(e) => setGoal(parseInt(e.target.value))}
                    className="range range-primary"
                    step={1}
                  />
                  <div className="flex justify-between text-xs px-2">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                    <span>6</span>
                    <span>7</span>
                  </div>
                  <div className="text-center mt-2">
                    Meta: {goal} dias por semana
                  </div>
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Cor</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => (
                      <div 
                        key={c} 
                        className={`w-8 h-8 rounded-full cursor-pointer ${color === c ? 'ring-4 ring-offset-2' : ''}`}
                        style={{ backgroundColor: c }}
                        onClick={() => setColor(c)}
                      />
                    ))}
                  </div>
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Ícone</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ICONS.map((i) => (
                      <div 
                        key={i} 
                        className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-md ${icon === i ? 'bg-primary text-primary-content' : 'bg-base-300'}`}
                        onClick={() => setIcon(i)}
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Notas</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="textarea textarea-bordered"
                    placeholder="Notas adicionais sobre este hábito"
                    rows={3}
                  />
                </div>
              </>
            )}

            <div className="flex gap-2 mt-4">
              <button 
                type="button" 
                className="btn btn-outline flex-1"
                onClick={resetForm}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary flex-1">
                Adicionar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}; 