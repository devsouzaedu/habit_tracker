import { useState } from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular um pequeno delay para UX
    setTimeout(() => {
      if (password === '2210') {
        onLogin();
      } else {
        setError('Senha incorreta. Tente novamente.');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-2 sm:p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl mx-2 sm:mx-0">
        <div className="card-body">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Seja bem vindo,</h1>
            <h2 className="text-xl sm:text-2xl font-bold text-secondary mt-1">J.M.SOUZA</h2>
            <p className="text-base-content/70 mt-2">Digite sua senha para acessar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Senha</span>
              </label>
              <input
                type="password"
                placeholder="Digite sua senha"
                className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
              {error && (
                <label className="label">
                  <span className="label-text-alt text-error">{error}</span>
                </label>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !password}
            >
              {isLoading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-xs text-base-content/50">
              Seu tracker pessoal de hábitos e Instagram
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 