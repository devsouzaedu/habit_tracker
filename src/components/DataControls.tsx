interface DataControlsProps {
  onRefresh: () => Promise<void>;
}

export const DataControls = ({ onRefresh }: DataControlsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold green-text">Configurações</h2>
      
      {/* Sincronização */}
      <div className="cyberpunk-card rounded-lg p-3">
        <h3 className="font-semibold text-sm mb-2 green-text">🔄 Sincronização</h3>
        <p className="text-xs text-base-content/70 mb-3">
          Sincronizar dados com o servidor
        </p>
        <button 
          onClick={onRefresh}
          className="btn btn-sm btn-cyberpunk w-full"
        >
          🔄 Atualizar Dados
        </button>
      </div>

      {/* Informações do Sistema */}
      <div className="cyberpunk-card rounded-lg p-3">
        <h3 className="font-semibold text-sm mb-2 green-text">ℹ️ Informações</h3>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-base-content/70">Versão:</span>
            <span className="green-text">3.0.0 Cyberpunk</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/70">Tema:</span>
            <span className="green-text">Cyberpunk Verde</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/70">Hábitos:</span>
            <span className="green-text">12 fixos</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base-content/70">Storage:</span>
            <span className="green-text">Supabase</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="cyberpunk-card rounded-lg p-3">
        <h3 className="font-semibold text-sm mb-2 green-text">⚡ Status</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 status-online rounded-full"></div>
          <span className="text-xs green-text">Sistema Online</span>
        </div>
      </div>
    </div>
  );
}; 