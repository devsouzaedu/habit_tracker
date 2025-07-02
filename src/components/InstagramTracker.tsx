import { useState } from 'react';
import { Instagram, Download, Upload, Trash, Eye, EyeOff } from 'lucide-react';
import { useInstagramTracker } from '../hooks/useInstagramTracker';
import { InstagramStatsComponent } from './InstagramStats';
import { InstagramChart } from './InstagramChart';
import { InstagramForm } from './InstagramForm';
import { InstagramDataList } from './InstagramDataList';

export const InstagramTracker = () => {
  const {
    data,
    stats,
    addEntry,
    deleteEntry,
    updateEntry,
    exportData,
    importData,
    clearAllData
  } = useInstagramTracker();

  const [showDataList, setShowDataList] = useState(false);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file);
      e.target.value = ''; // Reset input
    }
  };

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja excluir TODOS os dados? Esta ação não pode ser desfeita.')) {
      clearAllData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header da seção */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Instagram className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Instagram Growth Tracker</h2>
            <p className="text-sm opacity-70">
              Acompanhe o crescimento da sua conta
            </p>
          </div>
        </div>
        
        {/* Controles de dados */}
        <div className="flex items-center gap-2">
          <div className="tooltip" data-tip="Exportar dados">
            <button
              onClick={exportData}
              className="btn btn-ghost btn-sm"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
          
          <div className="tooltip" data-tip="Importar dados">
            <label className="btn btn-ghost btn-sm cursor-pointer">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="tooltip" data-tip="Limpar todos os dados">
            <button
              onClick={handleClearData}
              className="btn btn-ghost btn-sm text-error"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <InstagramStatsComponent stats={stats} />

      {/* Formulário para adicionar dados */}
      <InstagramForm onAddEntry={addEntry} />

      {/* Gráfico */}
      <InstagramChart data={data} />

      {/* Toggle para mostrar/ocultar lista de dados */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowDataList(!showDataList)}
          className="btn btn-outline btn-sm gap-2"
        >
          {showDataList ? (
            <>
              <EyeOff className="w-4 h-4" />
              Ocultar Dados Históricos
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Mostrar Dados Históricos ({data.length})
            </>
          )}
        </button>
      </div>

      {/* Lista de dados históricos */}
      {showDataList && (
        <InstagramDataList
          data={data}
          onDeleteEntry={deleteEntry}
          onUpdateEntry={updateEntry}
        />
      )}

      {/* Footer com informações */}
      <div className="text-center text-sm opacity-60 space-y-1">
        <p>💡 Dica: Adicione dados regularmente para ter uma visão precisa do seu crescimento</p>
        <p>📊 Os dados são salvos automaticamente no seu navegador</p>
      </div>
    </div>
  );
}; 