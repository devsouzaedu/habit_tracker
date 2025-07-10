import { FileText, Download, ExternalLink } from 'lucide-react';

export const PDFViewer = () => {
  const pdfUrl = '/standarts_formal_1pagina.pdf';

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'standarts_formal_1pagina.pdf';
    link.click();
  };

  const openInNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="cyberpunk-card rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold green-text">Padrões Formais</h2>
              <p className="text-sm text-base-content/70">
                Documento de referência - 1 página
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="tooltip" data-tip="Baixar PDF">
              <button
                onClick={downloadPDF}
                className="btn btn-ghost btn-sm"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
            
            <div className="tooltip" data-tip="Abrir em nova aba">
              <button
                onClick={openInNewTab}
                className="btn btn-ghost btn-sm"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="cyberpunk-card rounded-lg p-4 flex-1">
        <div className="h-full bg-base-200 rounded-lg overflow-hidden">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title="Padrões Formais - 1 Página"
          />
        </div>
        
        {/* Fallback para caso o PDF não carregue */}
        <div className="mt-4 text-center">
          <p className="text-sm text-base-content/70 mb-2">
            Caso o PDF não apareça acima, você pode:
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={downloadPDF}
              className="btn btn-sm btn-cyberpunk"
            >
              <Download className="w-4 h-4 mr-1" />
              Baixar PDF
            </button>
            <button
              onClick={openInNewTab}
              className="btn btn-sm btn-outline"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Abrir em Nova Aba
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 