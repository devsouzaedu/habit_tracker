import { useState } from 'react';
import { Trash2, Edit, Calendar, Users, MessageSquare, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { InstagramData } from '../types';

interface InstagramDataListProps {
  data: InstagramData[];
  onDeleteEntry: (id: string) => void;
  onUpdateEntry: (id: string, updates: Partial<InstagramData>) => void;
}

export const InstagramDataList = ({ data, onDeleteEntry, onUpdateEntry }: InstagramDataListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<InstagramData>>({});

  const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const startEdit = (item: InstagramData) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      onUpdateEntry(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      onDeleteEntry(id);
    }
  };

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md border">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Nenhum dado registrado ainda.</p>
          <p className="text-sm mt-2">Adicione seus primeiros dados acima!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Histórico de Dados ({data.length} registros)
        </h3>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedData.map((item) => (
          <div key={item.id} className="p-6">
            {editingId === item.id ? (
              // Modo de edição
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data
                    </label>
                    <input
                      type="date"
                      value={editForm.date || ''}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Seguidores
                    </label>
                    <input
                      type="number"
                      value={editForm.followers || ''}
                      onChange={(e) => setEditForm({ ...editForm, followers: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Seguindo
                    </label>
                    <input
                      type="number"
                      value={editForm.following || ''}
                      onChange={(e) => setEditForm({ ...editForm, following: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notas
                  </label>
                  <textarea
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 
                             border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <X className="w-4 h-4 inline mr-1" />
                    Cancelar
                  </button>
                  <button
                    onClick={saveEdit}
                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    <Save className="w-4 h-4 inline mr-1" />
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              // Modo de visualização
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(item.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                    <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                      <Users className="w-4 h-4 mr-1" />
                      {item.followers.toLocaleString('pt-BR')} seguidores
                    </div>
                    {item.following && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Seguindo: {item.following.toLocaleString('pt-BR')}
                      </div>
                    )}
                    {item.posts && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Posts: {item.posts.toLocaleString('pt-BR')}
                      </div>
                    )}
                  </div>
                  {item.notes && (
                    <div className="flex items-start text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <MessageSquare className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>{item.notes}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 
                             hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 
                             hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 