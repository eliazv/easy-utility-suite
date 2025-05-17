
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  FileText, Upload, Download, File, FileImage, 
  FileSpreadsheet, FileCode
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface FileFormat {
  id: string;
  name: string;
  icon: JSX.Element;
  extensions: string[];
  outputs: string[];
}

const fileTypes: Record<string, FileFormat> = {
  document: {
    id: "document",
    name: "Documento",
    icon: <FileText className="h-8 w-8 text-blue-500" />,
    extensions: [".pdf", ".docx", ".txt", ".rtf", ".odt"],
    outputs: ["docx", "pdf", "txt", "rtf", "odt"]
  },
  image: {
    id: "image",
    name: "Immagine",
    icon: <FileImage className="h-8 w-8 text-green-500" />,
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".tiff", ".bmp"],
    outputs: ["jpg", "png", "webp", "gif", "tiff", "bmp"]
  },
  spreadsheet: {
    id: "spreadsheet",
    name: "Foglio di calcolo",
    icon: <FileSpreadsheet className="h-8 w-8 text-orange-500" />,
    extensions: [".xls", ".xlsx", ".csv", ".ods"],
    outputs: ["xlsx", "csv", "ods"]
  },
  code: {
    id: "code",
    name: "Codice",
    icon: <FileCode className="h-8 w-8 text-purple-500" />,
    extensions: [".html", ".xml", ".json", ".yaml", ".md"],
    outputs: ["html", "xml", "json", "yaml", "md"]
  }
};

const PdfToWord = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [convertedData, setConvertedData] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState("docx");
  const [activeTab, setActiveTab] = useState("document");
  const [inputFileType, setInputFileType] = useState("pdf");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Get file extension
      const fileExt = "." + selectedFile.name.split('.').pop()?.toLowerCase();
      
      // Check if file extension is valid for the selected tab
      const validExtensions = fileTypes[activeTab].extensions;
      if (!validExtensions.includes(fileExt)) {
        toast({
          title: "Formato non valido",
          description: `Seleziona un file con uno dei seguenti formati: ${validExtensions.join(', ')}`,
          variant: "destructive",
        });
        return;
      }
      
      // Set input file type without the dot
      setInputFileType(fileExt.substring(1));
      setFile(selectedFile);
      setConverted(false);
      setConvertedData(null);
    }
  };

  const handleConvert = () => {
    if (!file) return;
    
    setConverting(true);
    
    // Lettura del file e simulazione della conversione
    const reader = new FileReader();
    
    reader.onload = (e) => {
      // In una implementazione reale, qui si effettuerebbe la conversione
      // Per ora simuliamo creando un blob di esempio
      
      setTimeout(() => {
        if (!e.target || !e.target.result) {
          toast({
            title: "Errore di conversione",
            description: "Non è stato possibile leggere il file",
            variant: "destructive",
          });
          setConverting(false);
          return;
        }
        
        // Simula il risultato della conversione
        // In un'implementazione reale qui ci sarebbe una conversione vera
        const fileData = e.target.result;
        
        // Creiamo un URL per il download del file convertito
        const blob = new Blob([fileData], { type: getOutputMimeType(outputFormat) });
        const url = URL.createObjectURL(blob);
        
        setConvertedData(url);
        setConverting(false);
        setConverted(true);
        
        toast({
          title: "Conversione completata",
          description: `Il file è stato convertito in formato ${outputFormat}`,
        });
      }, 2000);
    };
    
    reader.onerror = () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la lettura del file",
        variant: "destructive",
      });
      setConverting(false);
    };
    
    // Legge il file come ArrayBuffer (funziona per tutti i tipi di file)
    reader.readAsArrayBuffer(file);
  };

  // Determina il MIME type in base all'estensione del file di output
  const getOutputMimeType = (format: string): string => {
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      txt: "text/plain",
      rtf: "application/rtf",
      odt: "application/vnd.oasis.opendocument.text",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      tiff: "image/tiff",
      bmp: "image/bmp",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      csv: "text/csv",
      ods: "application/vnd.oasis.opendocument.spreadsheet",
      html: "text/html",
      xml: "application/xml",
      json: "application/json",
      yaml: "application/x-yaml",
      md: "text/markdown"
    };
    
    return mimeTypes[format] || "application/octet-stream";
  };

  const handleDownload = () => {
    if (!convertedData || !file) return;
    
    // Crea un link per il download e lo attiva
    const link = document.createElement("a");
    link.href = convertedData;
    
    // Determina il nome del file di output
    const originalName = file.name.split(".")[0];
    link.download = `${originalName}.${outputFormat}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download avviato",
      description: `Il file convertito in formato ${outputFormat} verrà scaricato a breve`,
    });
  };
  
  const getAcceptedFileTypes = () => {
    return fileTypes[activeTab].extensions.join(',');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFile(null);
    setConverted(false);
    setConvertedData(null);
    
    // Set default output format for the selected tab
    if (fileTypes[value]?.outputs.length > 0) {
      setOutputFormat(fileTypes[value].outputs[0]);
    }
  };
  
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return <FileText className="h-10 w-10 text-red-500" />;
    if (fileType.includes("doc")) return <FileText className="h-10 w-10 text-blue-500" />;
    if (fileType.includes("jpg") || fileType.includes("png")) return <FileImage className="h-10 w-10 text-green-500" />;
    if (fileType.includes("xls") || fileType.includes("csv")) return <FileSpreadsheet className="h-10 w-10 text-orange-500" />;
    if (fileType.includes("html") || fileType.includes("json")) return <FileCode className="h-10 w-10 text-purple-500" />;
    return <File className="h-10 w-10 text-gray-500" />;
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Convertitore di file</h1>
        <p className="text-gray-600 mt-2">
          Converti i tuoi file tra diversi formati mantenendo la qualità originale.
          Supporta documenti, immagini, fogli di calcolo e altro.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="document">Documenti</TabsTrigger>
                <TabsTrigger value="image">Immagini</TabsTrigger>
                <TabsTrigger value="spreadsheet">Fogli di calcolo</TabsTrigger>
                <TabsTrigger value="code">Codice</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2">1. Carica il tuo file</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    {getFileIcon(file.name.toLowerCase())}
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setFile(null);
                        setConverted(false);
                        setConvertedData(null);
                      }}
                      className="mt-2"
                    >
                      Cambia file
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-2">
                      Trascina qui il tuo file o
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      Seleziona file
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept={getAcceptedFileTypes()}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Formati supportati: {fileTypes[activeTab].extensions.join(', ')} (max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {file && (
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-2">2. Scegli il formato di output</h2>
                <div className="max-w-xs">
                  <Label htmlFor="output-format">Formato di output</Label>
                  <Select 
                    value={outputFormat} 
                    onValueChange={setOutputFormat}
                  >
                    <SelectTrigger id="output-format" className="mt-1">
                      <SelectValue placeholder="Seleziona formato" />
                    </SelectTrigger>
                    <SelectContent>
                      {fileTypes[activeTab].outputs
                        .filter(format => format !== inputFileType) // Exclude current format
                        .map(format => (
                          <SelectItem key={format} value={format}>
                            {format.toUpperCase()}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
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
                  `Converti in ${outputFormat.toUpperCase()}`
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
                  Scarica file {outputFormat.toUpperCase()}
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
                <span>Seleziona il tipo di file che vuoi convertire</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  2
                </div>
                <span>Carica il tuo file (max 10MB)</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  3
                </div>
                <span>Scegli il formato di output desiderato</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  4
                </div>
                <span>Clicca sul pulsante "Converti"</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  5
                </div>
                <span>Scarica il file convertito</span>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-4">Formati supportati</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-sm flex items-center">
                  <FileText className="h-4 w-4 text-blue-500 mr-1" /> Documenti
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  PDF, DOCX, TXT, RTF, ODT
                </p>
              </div>
              <div>
                <p className="font-medium text-sm flex items-center">
                  <FileImage className="h-4 w-4 text-green-500 mr-1" /> Immagini
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  JPG, PNG, WEBP, GIF, TIFF, BMP
                </p>
              </div>
              <div>
                <p className="font-medium text-sm flex items-center">
                  <FileSpreadsheet className="h-4 w-4 text-orange-500 mr-1" /> Fogli di calcolo
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  XLSX, CSV, ODS
                </p>
              </div>
              <div>
                <p className="font-medium text-sm flex items-center">
                  <FileCode className="h-4 w-4 text-purple-500 mr-1" /> Codice
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  HTML, XML, JSON, YAML, MD
                </p>
              </div>
            </div>
          </div>

          <div className="ad-placeholder h-60">
            Spazio pubblicitario
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PdfToWord;
