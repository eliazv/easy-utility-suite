
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PdfToWord = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [outputFormat, setOutputFormat] = useState("docx");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Verifica che il file sia un PDF
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: "Errore",
          description: "Seleziona un file PDF valido",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
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
      
      toast({
        title: "Conversione completata",
        description: `Il PDF è stato convertito in formato ${getFormatName(outputFormat)}`,
      });
    }, 2000);
  };

  const handleDownload = () => {
    // In un'implementazione reale, qui si scaricherebbe il file convertito
    toast({
      title: "Download avviato",
      description: `Il file convertito in formato ${getFormatName(outputFormat)} verrà scaricato a breve`,
    });
  };
  
  const getFormatName = (format: string) => {
    const formats: {[key: string]: string} = {
      "docx": "Word (.docx)",
      "txt": "Testo (.txt)",
      "html": "HTML (.html)",
      "rtf": "Rich Text (.rtf)"
    };
    
    return formats[format] || format;
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Convertitore da PDF a Word e altri formati</h1>
        <p className="text-gray-600 mt-2">
          Converti facilmente i tuoi documenti PDF in file Word (.docx) e altri formati modificabili.
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

            {file && (
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-2">2. Scegli il formato di output</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="relative">
                    <input
                      type="radio"
                      id="format-docx"
                      name="format"
                      className="peer absolute opacity-0"
                      value="docx"
                      checked={outputFormat === "docx"}
                      onChange={(e) => setOutputFormat(e.target.value)}
                    />
                    <label
                      htmlFor="format-docx"
                      className="flex flex-col items-center justify-center p-4 border rounded-lg text-center cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5"
                    >
                      <FileText className="h-8 w-8 mb-2 text-blue-500" />
                      <span className="font-medium">Word</span>
                      <span className="text-xs text-gray-500">(.docx)</span>
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="radio"
                      id="format-txt"
                      name="format"
                      className="peer absolute opacity-0"
                      value="txt"
                      checked={outputFormat === "txt"}
                      onChange={(e) => setOutputFormat(e.target.value)}
                    />
                    <label
                      htmlFor="format-txt"
                      className="flex flex-col items-center justify-center p-4 border rounded-lg text-center cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5"
                    >
                      <FileText className="h-8 w-8 mb-2 text-green-500" />
                      <span className="font-medium">Testo</span>
                      <span className="text-xs text-gray-500">(.txt)</span>
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="radio"
                      id="format-html"
                      name="format"
                      className="peer absolute opacity-0"
                      value="html"
                      checked={outputFormat === "html"}
                      onChange={(e) => setOutputFormat(e.target.value)}
                    />
                    <label
                      htmlFor="format-html"
                      className="flex flex-col items-center justify-center p-4 border rounded-lg text-center cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5"
                    >
                      <FileText className="h-8 w-8 mb-2 text-orange-500" />
                      <span className="font-medium">HTML</span>
                      <span className="text-xs text-gray-500">(.html)</span>
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="radio"
                      id="format-rtf"
                      name="format"
                      className="peer absolute opacity-0"
                      value="rtf"
                      checked={outputFormat === "rtf"}
                      onChange={(e) => setOutputFormat(e.target.value)}
                    />
                    <label
                      htmlFor="format-rtf"
                      className="flex flex-col items-center justify-center p-4 border rounded-lg text-center cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5"
                    >
                      <FileText className="h-8 w-8 mb-2 text-purple-500" />
                      <span className="font-medium">Rich Text</span>
                      <span className="text-xs text-gray-500">(.rtf)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2">3. Converti il file</h2>
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
                  `Converti in ${getFormatName(outputFormat)}`
                )}
              </Button>
            </div>

            {converted && (
              <div>
                <h2 className="text-xl font-medium mb-2">4. Scarica il file</h2>
                <Button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 py-6"
                >
                  <Download className="h-5 w-5" />
                  Scarica documento {getFormatName(outputFormat)}
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
                <span>Scegli il formato di output desiderato</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  3
                </div>
                <span>Clicca sul pulsante "Converti"</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  4
                </div>
                <span>Scarica il documento convertito</span>
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
