
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Download } from "lucide-react";

const PdfToWord = () => {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setConverted(false);
    }
  };

  const handleConvert = () => {
    if (!file) return;
    
    setConverting(true);
    // Simulazione della conversione
    setTimeout(() => {
      setConverting(false);
      setConverted(true);
    }, 2000);
  };

  const handleDownload = () => {
    // In un'implementazione reale, qui si scaricherebbe il file convertito
    alert("In un'implementazione reale, qui scaricheresti il file convertito");
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Convertitore da PDF a Word</h1>
        <p className="text-gray-600 mt-2">
          Converti facilmente i tuoi documenti PDF in file Word (.docx) modificabili.
          Mantieni la formattazione e il layout originale.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2">1. Carica il tuo file PDF</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-10 w-10 text-blue-500" />
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setFile(null)}
                      className="mt-2"
                    >
                      Cambia file
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-2">
                      Trascina qui il tuo file PDF o
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("pdf-upload")?.click()}
                    >
                      Seleziona file
                    </Button>
                    <input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Massimo 10MB per file
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2">2. Converti in Word</h2>
              <Button
                onClick={handleConvert}
                disabled={!file || converting}
                className="w-full py-6"
              >
                {converting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Conversione in corso...
                  </>
                ) : (
                  "Converti in Word"
                )}
              </Button>
            </div>

            {converted && (
              <div>
                <h2 className="text-xl font-medium mb-2">3. Scarica il file</h2>
                <Button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 py-6"
                >
                  <Download className="h-5 w-5" />
                  Scarica documento Word
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-4">Come funziona</h3>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  1
                </div>
                <span>Carica il tuo file PDF (max 10MB)</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  2
                </div>
                <span>Clicca sul pulsante "Converti in Word"</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  3
                </div>
                <span>Scarica il documento Word convertito</span>
              </li>
            </ol>
          </div>

          <div className="ad-placeholder h-80">
            Spazio pubblicitario
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PdfToWord;
