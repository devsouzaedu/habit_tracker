import { useState, useEffect } from 'react';
import { Save, FileText, Trash2 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const NotesTab = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Carregar notas do localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('tracker-notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Erro ao carregar notas:', error);
      }
    }
  }, []);

  // Salvar notas no localStorage
  const saveNotes = (updatedNotes: Note[]) => {
    localStorage.setItem('tracker-notes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const createNewNote = () => {
    setCurrentNote(null);
    setTitle('');
    setContent('');
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!title.trim()) {
      alert('Por favor, adicione um título para a nota');
      return;
    }

    const now = new Date().toISOString();
    
    if (currentNote) {
      // Atualizar nota existente
      const updatedNotes = notes.map(note => 
        note.id === currentNote.id 
          ? { ...note, title, content, updatedAt: now }
          : note
      );
      saveNotes(updatedNotes);
      setCurrentNote({ ...currentNote, title, content, updatedAt: now });
    } else {
      // Criar nova nota
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: now,
        updatedAt: now
      };
      const updatedNotes = [...notes, newNote];
      saveNotes(updatedNotes);
      setCurrentNote(newNote);
    }
    
    setIsEditing(false);
  };

  const deleteNote = (noteId: string) => {
    if (confirm('Tem certeza que deseja excluir esta nota?')) {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      saveNotes(updatedNotes);
      
      if (currentNote?.id === noteId) {
        setCurrentNote(null);
        setTitle('');
        setContent('');
        setIsEditing(false);
      }
    }
  };

  const selectNote = (note: Note) => {
    setCurrentNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(false);
  };

  const editNote = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    } else {
      setTitle('');
      setContent('');
    }
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
      {/* Lista de notas */}
      <div className="cyberpunk-card rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold green-text">Minhas Notas</h3>
          <button
            onClick={createNewNote}
            className="btn btn-sm btn-cyberpunk"
          >
            Nova Nota
          </button>
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notes.length === 0 ? (
            <p className="text-sm text-base-content/70 text-center py-8">
              Nenhuma nota ainda.
              <br />
              Clique em "Nova Nota" para começar!
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  currentNote?.id === note.id
                    ? 'border-primary bg-primary/10'
                    : 'border-base-300 hover:border-base-400'
                }`}
                onClick={() => selectNote(note)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{note.title}</h4>
                    <p className="text-xs text-base-content/70 mt-1">
                      {new Date(note.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="btn btn-ghost btn-xs text-error"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor de notas */}
      <div className="lg:col-span-2 cyberpunk-card rounded-lg p-4">
        {currentNote || isEditing ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 green-text" />
                <span className="text-lg font-semibold green-text">
                  {isEditing ? (currentNote ? 'Editando Nota' : 'Nova Nota') : 'Visualizando Nota'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={saveNote}
                      className="btn btn-sm btn-cyberpunk"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Salvar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="btn btn-sm btn-ghost"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={editNote}
                    className="btn btn-sm btn-cyberpunk"
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="flex-1 flex flex-col space-y-4">
                <input
                  type="text"
                  placeholder="Título da nota..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered w-full"
                />
                <textarea
                  placeholder="Escreva sua nota aqui..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="textarea textarea-bordered flex-1 resize-none"
                  rows={15}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-4">
                <h2 className="text-xl font-bold">{currentNote?.title}</h2>
                <div className="flex-1 p-4 bg-base-200 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {currentNote?.content || 'Nota vazia...'}
                  </pre>
                </div>
                <div className="text-xs text-base-content/70">
                  Criada em: {currentNote && new Date(currentNote.createdAt).toLocaleString('pt-BR')}
                  {currentNote?.updatedAt !== currentNote?.createdAt && (
                    <span className="ml-4">
                      Atualizada em: {new Date(currentNote.updatedAt).toLocaleString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
              <p className="text-lg font-medium mb-2">Selecione uma nota</p>
              <p className="text-sm text-base-content/70">
                Escolha uma nota da lista ou crie uma nova
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 