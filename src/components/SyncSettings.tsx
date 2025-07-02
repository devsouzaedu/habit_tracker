import { useState, useEffect } from 'react';
import { Cloud, CloudOff, WifiOff, RefreshCw, Settings, Check, X } from 'lucide-react';
import { useSupabaseStorage } from '../hooks/useSupabaseStorage';

export const SyncSettings = () => {
  const [supabaseEnabled, setSupabaseEnabled] = useState(false);
  const [userId, setUserId] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const storage = useSupabaseStorage({
    useSupabase: supabaseEnabled,
    userId: userId || 'anonymous'
  });

  // Carregar configurações salvas
  useEffect(() => {
    const savedSettings = localStorage.getItem('sync-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setSupabaseEnabled(settings.supabaseEnabled || false);
      setUserId(settings.userId || '');
    }
  }, []);

  // Salvar configurações
  const saveSettings = () => {
    const settings = {
      supabaseEnabled,
      userId
    };
    localStorage.setItem('sync-settings', JSON.stringify(settings));
    setShowSettings(false);
  };

  const getSyncStatusIcon = () => {
    if (!supabaseEnabled) return <CloudOff className="w-4 h-4 text-gray-400" />;
    if (!storage.isOnline) return <WifiOff className="w-4 h-4 text-red-500" />;
    
    switch (storage.syncStatus) {
      case 'syncing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Cloud className="w-4 h-4 text-green-500" />;
    }
  };

  const getSyncStatusText = () => {
    if (!supabaseEnabled) return 'Sincronização desabilitada';
    if (!storage.isOnline) return 'Offline';
    
    switch (storage.syncStatus) {
      case 'syncing':
        return 'Sincronizando...';
      case 'error':
        return 'Erro na sincronização';
      default:
        return 'Sincronizado';
    }
  };

  return (
    <div className="space-y-4">
      {/* Status da sincronização */}
      <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg border">
        <div className="flex items-center gap-3">
          {getSyncStatusIcon()}
          <div>
            <p className="font-medium">Status da Sincronização</p>
            <p className="text-sm opacity-70">{getSyncStatusText()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {supabaseEnabled && storage.isOnline && (
            <button
              onClick={storage.forcSync}
              className="btn btn-ghost btn-sm"
              disabled={storage.syncStatus === 'syncing'}
            >
              <RefreshCw className={`w-4 h-4 ${storage.syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            </button>
          )}
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn btn-ghost btn-sm"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Configurações */}
      {showSettings && (
        <div className="p-4 bg-base-200 rounded-lg space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configurações de Sincronização
          </h3>

          {/* Toggle Supabase */}
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Habilitar sincronização na nuvem</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={supabaseEnabled}
                onChange={(e) => setSupabaseEnabled(e.target.checked)}
              />
            </label>
            <div className="label">
              <span className="label-text-alt">
                Sincroniza seus dados com Supabase para acesso de qualquer dispositivo
              </span>
            </div>
          </div>

          {/* User ID */}
          {supabaseEnabled && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">ID do Usuário</span>
              </label>
              <input
                type="text"
                placeholder="Seu ID único (ex: seu-nome-123)"
                className="input input-bordered"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <div className="label">
                <span className="label-text-alt">
                  Use o mesmo ID em todos os dispositivos para sincronizar dados
                </span>
              </div>
            </div>
          )}

          {/* Instruções */}
          {supabaseEnabled && (
            <div className="alert alert-info">
              <div>
                <h4 className="font-semibold">Como configurar:</h4>
                <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                  <li>Crie uma conta gratuita no <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="link">Supabase</a></li>
                  <li>Crie um novo projeto</li>
                  <li>Copie a URL e a chave anônima</li>
                  <li>Crie um arquivo <code>.env</code> com suas credenciais</li>
                  <li>Execute as queries SQL para criar as tabelas</li>
                </ol>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowSettings(false)}
              className="btn btn-ghost btn-sm"
            >
              Cancelar
            </button>
            <button
              onClick={saveSettings}
              className="btn btn-primary btn-sm"
            >
              <Check className="w-4 h-4 mr-1" />
              Salvar
            </button>
          </div>
        </div>
      )}

      {/* Informações adicionais */}
      <div className="text-xs opacity-60 space-y-1">
        <p>🔒 <strong>Privacidade:</strong> Seus dados ficam no seu controle</p>
        <p>💾 <strong>Backup local:</strong> Dados sempre salvos no navegador</p>
        <p>☁️ <strong>Sincronização:</strong> Opcional, apenas se configurada</p>
      </div>
    </div>
  );
}; 