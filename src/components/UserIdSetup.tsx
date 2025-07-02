import { useState } from 'react';

interface UserIdSetupProps {
  onSetUserId: (userId: string) => void;
}

export function UserIdSetup({ onSetUserId }: UserIdSetupProps) {
  const [userId, setUserId] = useState('');
  const [useCustomId, setUseCustomId] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalUserId;
    if (useCustomId && userId.trim()) {
      // Usar ID personalizado
      finalUserId = userId.trim().toLowerCase().replace(/\s+/g, '-');
    } else {
      // Gerar ID automático
      finalUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    onSetUserId(finalUserId);
  };

  const generateRandomId = () => {
    const randomId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setUserId(randomId);
    setUseCustomId(true);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary">🔗 Configuração Inicial</h1>
            <p className="text-base-content/70 mt-2">Configure seu ID para sincronização entre dispositivos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Opção de ID automático */}
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">
                  <div>
                    <div className="font-medium">🎲 Gerar ID Automático</div>
                    <div className="text-sm opacity-70">Recomendado para a maioria dos usuários</div>
                  </div>
                </span>
                <input
                  type="radio"
                  name="id-option"
                  className="radio radio-primary"
                  checked={!useCustomId}
                  onChange={() => setUseCustomId(false)}
                />
              </label>
            </div>

            {/* Opção de ID personalizado */}
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">
                  <div>
                    <div className="font-medium">✏️ Usar ID Personalizado</div>
                    <div className="text-sm opacity-70">Para facilitar o acesso em outros dispositivos</div>
                  </div>
                </span>
                <input
                  type="radio"
                  name="id-option"
                  className="radio radio-primary"
                  checked={useCustomId}
                  onChange={() => setUseCustomId(true)}
                />
              </label>
            </div>

            {/* Campo de ID personalizado */}
            {useCustomId && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Seu ID Personalizado</span>
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="ex: meu-nome-2025"
                    className="input input-bordered flex-1"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    pattern="[a-zA-Z0-9\-_]+"
                    title="Use apenas letras, números, hífens e underscores"
                  />
                  <button
                    type="button"
                    onClick={generateRandomId}
                    className="btn btn-outline"
                    title="Gerar ID aleatório"
                  >
                    🎲
                  </button>
                </div>
                <div className="label">
                  <span className="label-text-alt">
                    Use apenas letras, números, hífens (-) e underscores (_)
                  </span>
                </div>
              </div>
            )}

            {/* Informações importantes */}
            <div className="alert alert-info">
              <div>
                <h4 className="font-semibold">📱 Como funciona:</h4>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Seus dados serão salvos na nuvem (Supabase)</li>
                  <li>• Use o mesmo ID em todos os dispositivos</li>
                  <li>• Sincronização automática entre dispositivos</li>
                  <li>• Você pode mudar o ID depois nas configurações</li>
                </ul>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={useCustomId && !userId.trim()}
            >
              🚀 Começar a usar o Dashboard
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-xs text-base-content/50">
              Seus dados ficam seguros e privados na nuvem
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 