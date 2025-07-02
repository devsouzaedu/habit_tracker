import { useState } from 'react';
import { Plus, Calendar, Users, MessageSquare } from 'lucide-react';
import type { InstagramData } from '../types';

interface InstagramFormProps {
  onAddEntry: (entry: Omit<InstagramData, 'id'>) => void;
}

export const InstagramForm = ({ onAddEntry }: InstagramFormProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [followers, setFollowers] = useState('');
  const [following, setFollowing] = useState('');
  const [posts, setPosts] = useState('');
  const [notes, setNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!followers) {
      alert('Por favor, insira o número de seguidores');
      return;
    }

    const entry: Omit<InstagramData, 'id'> = {
      date,
      followers: parseInt(followers),
      following: following ? parseInt(following) : undefined,
      posts: posts ? parseInt(posts) : undefined,
      notes: notes.trim() || undefined
    };

    onAddEntry(entry);
    
    // Reset form but keep date
    setFollowers('');
    setFollowing('');
    setPosts('');
    setNotes('');
    setIsExpanded(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Adicionar Dados do Instagram
        </h3>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {isExpanded ? 'Menos opções' : 'Mais opções'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Data
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Seguidores */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Seguidores *
            </label>
            <input
              type="number"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              placeholder="Ex: 79"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              min="0"
            />
          </div>
        </div>

        {/* Campos opcionais */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Seguindo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seguindo
              </label>
              <input
                type="number"
                value={following}
                onChange={(e) => setFollowing(e.target.value)}
                placeholder="Opcional"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>

            {/* Posts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Posts
              </label>
              <input
                type="number"
                value={posts}
                onChange={(e) => setPosts(e.target.value)}
                placeholder="Opcional"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
        )}

        {/* Notas */}
        {isExpanded && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Notas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações sobre este dia (opcional)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        )}

        {/* Botão de submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md 
                     font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Dados
          </button>
        </div>
      </form>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>* Campos obrigatórios</p>
        <p>💡 Dica: Adicione dados regularmente para acompanhar seu crescimento!</p>
      </div>
    </div>
  );
}; 