
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Compress, Upload, Download, Image, RefreshCw, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ComprimiImmagini = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<{original: File, compressed: Blob, url: string, savings: number}[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [maxWidth, setMaxWidth] = useState<string>("1920");
  const [maxHeight, setMaxHeight] = useState<string>("1080");
  const [format, setFormat] = useState<string>("original");
  const [maintainRatio, setMaintainRatio] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalSavings, setTotalSavings] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // Filtra solo le immagini
      const imageFiles = selectedFiles.filter(file => 
        file.type.startsWith('image/')
      );
      
      if (imageFiles.length !== selectedFiles.length) {
        toast({
          title: "Attenzione",
          description: "Sono stati scartati alcuni file non supportati. Carica solo immagini.",
          variant: "destructive",
        });
      }
      
      setFiles(imageFiles);
      setCompressedFiles([]);
      setTotalSavings(0);
    }
  };

  const compressImage = (file: File): Promise<{blob: Blob, url: string, savings: number}> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          // Determina le dimensioni finali
          let finalWidth = img.width;
          let finalHeight = img.height;
          
          if (maintainRatio) {
            const maxWidthNum = parseInt(maxWidth, 10);
            const maxHeightNum = parseInt(maxHeight, 10);
            
            if (finalWidth > maxWidthNum) {
              finalHeight = (maxWidthNum / finalWidth) * finalHeight;
              finalWidth = maxWidthNum;
            }
            
            if (finalHeight > maxHeightNum) {
              finalWidth = (maxHeightNum / finalHeight) * finalWidth;
              finalHeight = maxHeightNum;
            }
          } else {
            finalWidth = parseInt(maxWidth, 10);
            finalHeight = parseInt(maxHeight, 10);
          }
          
          // Crea un canvas per il ridimensionamento e la compressione
          const canvas = document.createElement('canvas');
          canvas.width = finalWidth;
          canvas.height = finalHeight;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, finalWidth, finalHeight);
          
          // Determina il formato di output
          let outputFormat = file.type;
          if (format !== 'original') {
            outputFormat = `image/${format}`;
          }
          
          // Comprimi l'immagine
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Calcola il risparmio di spazio
                const originalSize = file.size;
                const compressedSize = blob.size;
                const savings = ((originalSize - compressedSize) / originalSize) * 100;
                
                // Crea URL per l'anteprima
                const url = URL.createObjectURL(blob);
                
                resolve({
                  blob,
                  url,
                  savings
                });
              } else {
                reject(new Error('Compressione fallita'));
              }
            },
            outputFormat,
            quality / 100
          );
        };
        
        img.onerror = () => {
          reject(new Error('Caricamento immagine fallito'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('Lettura file fallita'));
      };
    });
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      toast({
        title: "Nessun file selezionato",
        description: "Carica almeno un'immagine da comprimere",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    const results: {original: File, compressed: Blob, url: string, savings: number}[] = [];
    let totalSaved = 0;
    
    try {
      for (const file of files) {
        // In un'implementazione reale, potremmo usare un Web Worker
        // per evitare di bloccare il thread principale
        const result = await compressImage(file);
        
        const originalSize = file.size;
        const compressedSize = result.blob.size;
        const saved = originalSize - compressedSize;
        
        totalSaved += saved;
        
        results.push({
          original: file,
          compressed: result.blob,
          url: result.url,
          savings: result.savings
        });
      }
      
      setCompressedFiles(results);
      setTotalSavings(totalSaved);
      
      toast({
        title: "Compressione completata",
        description: `${files.length} immagini compresse con successo`,
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la compressione",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `compressed_${filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    if (compressedFiles.length === 0) return;
    
    compressedFiles.forEach(file => {
      downloadFile(file.compressed, file.original.name);
    });
    
    toast({
      title: "Download avviato",
      description: `${compressedFiles.length} file saranno scaricati a breve`,
    });
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Comprimi immagini</h1>
        <p className="text-gray-600 mt-2">
          Riduci le dimensioni delle tue immagini mantenendo una buona qualità.
          Supporta formati JPEG, PNG, WEBP e GIF.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2">1. Carica le immagini</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {files.length > 0 ? (
                  <div className="flex flex-col items-center gap-2">
                    <Image className="h-10 w-10 text-blue-500" />
                    <p className="font-medium">{files.length} file selezionati</p>
                    <p className="text-sm text-gray-500">
                      Dimensione totale: {formatBytes(files.reduce((acc, file) => acc + file.size, 0))}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setFiles([])}
                      className="mt-2"
                    >
                      Cambia file
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-2">
                      Trascina qui le tue immagini o
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
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Formati supportati: JPG, PNG, WEBP, GIF (max 10MB per file)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-medium mb-4">2. Opzioni di compressione</h2>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Base</TabsTrigger>
                  <TabsTrigger value="advanced">Avanzate</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="quality" className="flex justify-between">
                        <span>Qualità: {quality}%</span>
                      </Label>
                      <Slider
                        id="quality"
                        min={1}
                        max={100}
                        step={1}
                        defaultValue={[quality]}
                        onValueChange={(value) => setQuality(value[0])}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Piccolo file</span>
                        <span>Alta qualità</span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="format">Formato di output</Label>
                      <Select value={format} onValueChange={setFormat}>
                        <SelectTrigger id="format" className="mt-1">
                          <SelectValue placeholder="Seleziona formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="original">Originale</SelectItem>
                          <SelectItem value="jpeg">JPEG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="webp">WEBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="advanced" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="max-width">Larghezza massima (px)</Label>
                      <Input
                        id="max-width"
                        type="number"
                        value={maxWidth}
                        onChange={(e) => setMaxWidth(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-height">Altezza massima (px)</Label>
                      <Input
                        id="max-height"
                        type="number"
                        value={maxHeight}
                        onChange={(e) => setMaxHeight(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="maintain-ratio" 
                          checked={maintainRatio} 
                          onCheckedChange={() => setMaintainRatio(!maintainRatio)} 
                        />
                        <Label htmlFor="maintain-ratio">
                          Mantieni proporzioni originali
                        </Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2">3. Comprimi le immagini</h2>
              <Button
                onClick={handleCompress}
                disabled={loading || files.length === 0}
                className="w-full py-6"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Compressione in corso...
                  </>
                ) : (
                  <>
                    <Compress className="mr-2 h-5 w-5" />
                    Comprimi {files.length} immagini
                  </>
                )}
              </Button>
            </div>

            {compressedFiles.length > 0 && (
              <div>
                <h2 className="text-xl font-medium mb-4">4. Risultati</h2>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium">Statistiche di compressione:</p>
                      <p className="text-sm text-gray-600">
                        Dimensione originale: {formatBytes(files.reduce((acc, file) => acc + file.size, 0))}
                      </p>
                      <p className="text-sm text-gray-600">
                        Dimensione compressa: {formatBytes(compressedFiles.reduce((acc, file) => acc + file.compressed.size, 0))}
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        Risparmio: {formatBytes(totalSavings)} ({(totalSavings / files.reduce((acc, file) => acc + file.size, 0) * 100).toFixed(1)}%)
                      </p>
                    </div>
                    <Button
                      onClick={downloadAll}
                      className="mt-4 md:mt-0"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Scarica tutte
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  {compressedFiles.map((file, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 w-full md:w-32">
                        <img 
                          src={file.url}
                          alt={`Anteprima di ${file.original.name}`}
                          className="w-full h-auto object-contain max-h-32"
                        />
                      </div>
                      <div className="flex-grow space-y-1">
                        <p className="font-medium truncate" title={file.original.name}>
                          {file.original.name}
                        </p>
                        <div className="flex items-center text-sm">
                          <span className="text-gray-600">{formatBytes(file.original.size)}</span>
                          <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                          <span className="text-gray-600">{formatBytes(file.compressed.size)}</span>
                          <span className="ml-2 text-green-600">
                            (-{file.savings.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadFile(file.compressed, file.original.name)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Scarica
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
                <span>Carica una o più immagini (max 10MB ciascuna)</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  2
                </div>
                <span>Personalizza le opzioni di compressione</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  3
                </div>
                <span>Clicca su "Comprimi" per elaborare le immagini</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  4
                </div>
                <span>Scarica le immagini compresse</span>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-medium mb-4">Suggerimenti</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2 items-start">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium mt-0.5">
                  •
                </div>
                <span>Per le immagini da pubblicare sul web, una qualità del 70-80% è generalmente sufficiente</span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium mt-0.5">
                  •
                </div>
                <span>Il formato WEBP offre una buona compressione mantenendo la qualità visiva</span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium mt-0.5">
                  •
                </div>
                <span>Ridurre le dimensioni in pixel è un modo efficace per diminuire il peso del file</span>
              </li>
            </ul>
          </div>

          <div className="ad-placeholder h-60 mt-6">
            Spazio pubblicitario
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ComprimiImmagini;
