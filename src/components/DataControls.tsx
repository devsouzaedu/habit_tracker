import { useState, useRef } from 'react';

type DataControlsProps = {
  onExport: () => void;
  onImport: (jsonData: string) => boolean;
  onRefresh: () => Promise<void>;
};

export const DataControls = ({ onExport, onImport, onRefresh }: DataControlsProps) => {
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(false);
    
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string;
        const success = onImport(jsonData);
        
        if (success) {
          setImportSuccess(true);
          setTimeout(() => setImportSuccess(false), 3000);
        } else {
          setImportError('Formato de arquivo inválido. Certifique-se de que é um arquivo JSON válido exportado deste aplicativo.');
        }
      } catch (error) {
        setImportError('Erro ao importar dados. Verifique se o arquivo está correto.');
        console.error('Import error:', error);
      }
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-base-content/70">
        Gerencie seus dados de hábitos com as opções abaixo.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <button 
          className="btn btn-primary flex-1"
          onClick={onExport}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar Dados
        </button>
        
        <button 
          className="btn btn-secondary flex-1"
          onClick={handleImportClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Importar Dados
        </button>
        
        <button 
          className="btn btn-accent flex-1"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <span className="loading loading-spinner loading-sm mr-2"></span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          {isRefreshing ? 'Atualizando...' : 'Atualizar Dados'}
        </button>
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
      </div>
      
      {importError && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{importError}</span>
        </div>
      )}
      
      {importSuccess && (
        <div className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Dados importados com sucesso!</span>
        </div>
      )}
      
      <div className="text-sm space-y-2">
        <h4 className="font-semibold">Dicas:</h4>
        <ul className="list-disc pl-5 space-y-1 text-base-content/70">
          <li>Exporte seus dados regularmente para backup.</li>
          <li>Os dados são sincronizados automaticamente com o Supabase.</li>
          <li>Use "Atualizar Dados" para forçar sincronização com o servidor.</li>
          <li>Para usar em outro dispositivo, exporte e importe os dados.</li>
        </ul>
      </div>
    </div>
  );
}; 