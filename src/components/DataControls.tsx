import { useState, useRef } from 'react';

type DataControlsProps = {
  onExport: () => void;
  onImport: (jsonData: string) => boolean;
};

export const DataControls = ({ onExport, onImport }: DataControlsProps) => {
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title">Backup e Restauração</h2>
        <p className="text-sm">Exporte seus dados para fazer backup ou importar em outro dispositivo.</p>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
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
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
        
        {importError && (
          <div className="alert alert-error mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{importError}</span>
          </div>
        )}
        
        {importSuccess && (
          <div className="alert alert-success mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Dados importados com sucesso!</span>
          </div>
        )}
        
        <div className="divider"></div>
        
        <div className="text-sm">
          <h3 className="font-bold">Dicas:</h3>
          <ul className="list-disc pl-5 mt-2">
            <li>Exporte seus dados regularmente para não perder seu progresso.</li>
            <li>Os dados são salvos automaticamente no armazenamento local do navegador.</li>
            <li>Para usar em outro dispositivo, exporte os dados e importe-os no outro dispositivo.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 