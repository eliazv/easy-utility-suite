import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileMinusIcon,
  Upload,
  Download,
  Image,
  RefreshCw,
  ArrowRight,
  Archive,
  Trash,
  X,
  Plus,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import JSZip from "jszip";
import { Slider } from "@/components/ui/slider";

const ComprimiImmagini = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<
    { original: File; compressed: Blob; url: string; savings: number }[]
  >([]);
  const [maxWidth, setMaxWidth] = useState<string>("1920");
  const [maxHeight, setMaxHeight] = useState<string>("1080");
  const [format, setFormat] = useState<string>("original");
  const [quality, setQuality] = useState<number>(80);
  const [aggressiveCompression, setAggressiveCompression] =
    useState<boolean>(false);
  const [maintainRatio, setMaintainRatio] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalSavings, setTotalSavings] = useState<number>(0);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      // Filtra solo le immagini e limita a 50
      const imageFiles = selectedFiles
        .filter((file) => file.type.startsWith("image/"))
        .slice(0, 50);

      // Controlla che ogni file non superi 10MB
      const validFiles = imageFiles.filter((file) => {
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File troppo grande",
            description: `${file.name} supera 10MB ed è stato escluso`,
            variant: "destructive",
            duration: 4000,
          });
          return false;
        }
        return true;
      });

      if (validFiles.length !== selectedFiles.length) {
        toast({
          title: "Alcuni file esclusi",
          description: `${validFiles.length} di ${selectedFiles.length} file sono stati caricati`,
          duration: 4000,
        });
      }

      setFiles(validFiles);
      setCompressedFiles([]);
      setTotalSavings(0);
    }
  };

  // Funzione per aggiungere altri file
  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      // Filtra solo le immagini
      const imageFiles = selectedFiles.filter((file) =>
        file.type.startsWith("image/")
      );

      // Controlla che ogni file non superi 10MB
      const validFiles = imageFiles.filter((file) => {
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File troppo grande",
            description: `${file.name} supera 10MB ed è stato escluso`,
            variant: "destructive",
            duration: 4000,
          });
          return false;
        }
        return true;
      });

      // Combina con i file esistenti evitando duplicati
      const existingNames = files.map((f) => f.name);
      const newFiles = validFiles.filter(
        (file) => !existingNames.includes(file.name)
      );

      if (newFiles.length !== validFiles.length) {
        toast({
          title: "File duplicati",
          description: "Alcuni file erano già stati caricati",
          duration: 3000,
        });
      }

      // Limita il totale a 50 file
      const combinedFiles = [...files, ...newFiles].slice(0, 50);

      if (combinedFiles.length === 50 && files.length + newFiles.length > 50) {
        toast({
          title: "Limite raggiunto",
          description: "Massimo 50 file. Alcuni file non sono stati aggiunti.",
          variant: "destructive",
          duration: 4000,
        });
      }

      setFiles(combinedFiles);
      setCompressedFiles([]);
      setTotalSavings(0);
    }
  };

  // Funzione per rimuovere un singolo file
  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    // Rimuovi anche il file compresso corrispondente se esiste
    const newCompressedFiles = compressedFiles.filter((_, i) => i !== index);
    setCompressedFiles(newCompressedFiles);

    // Ricalcola il risparmio totale
    const newTotalSavings = newCompressedFiles.reduce((acc, file) => {
      const originalFile = newFiles.find((f) => f.name === file.original.name);
      return (
        acc + (originalFile ? originalFile.size - file.compressed.size : 0)
      );
    }, 0);
    setTotalSavings(newTotalSavings);
  };

  // Gestori per il drag and drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);

      // Filtra solo le immagini e limita a 50
      const imageFiles = droppedFiles
        .filter((file) => file.type.startsWith("image/"))
        .slice(0, 50);

      // Controlla che ogni file non superi 10MB
      const validFiles = imageFiles.filter((file) => {
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File troppo grande",
            description: `${file.name} supera 10MB ed è stato escluso`,
            variant: "destructive",
            duration: 4000,
          });
          return false;
        }
        return true;
      });

      if (validFiles.length !== droppedFiles.length) {
        toast({
          title: "Alcuni file esclusi",
          description: `${validFiles.length} di ${droppedFiles.length} file sono stati caricati`,
          duration: 4000,
        });
      }

      if (validFiles.length > 0) {
        setFiles(validFiles);
        setCompressedFiles([]);
        setTotalSavings(0);
      }
    }
  };

  const compressImage = (
    file: File
  ): Promise<{ blob: Blob; url: string; savings: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = document.createElement("img");
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
          const canvas = document.createElement("canvas");
          canvas.width = finalWidth;
          canvas.height = finalHeight;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Impossibile creare il contesto canvas"));
            return;
          }

          // Ottimizzazione del rendering per migliore compressione
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

          // Algoritmo di compressione migliorato
          let outputFormat = file.type;
          let compressionQuality = quality / 100;

          if (format !== "original") {
            outputFormat = `image/${format}`;
          }

          // Algoritmo specifico per formato ottimizzato
          if (outputFormat === "image/png") {
            // Per PNG, usa compressione lossless ma ottimizza le dimensioni
            compressionQuality = 1.0;
          } else if (outputFormat === "image/webp") {
            // WebP ha migliore compressione, può usare qualità leggermente più alta
            compressionQuality = Math.min(1.0, compressionQuality + 0.1);
          } else if (outputFormat === "image/jpeg") {
            // JPEG usa la qualità impostata dall'utente
            compressionQuality = compressionQuality;
          }

          // Applica compressione aggressiva se richiesta
          if (aggressiveCompression) {
            compressionQuality = Math.max(0.3, compressionQuality - 0.2);
          }

          // Funzione di compressione iterativa per immagini piccole
          const tryCompress = (quality: number, attempt: number = 1): void => {
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const originalSize = file.size;
                  const compressedSize = blob.size;

                  // Se l'immagine è ancora troppo grande o non è stata compressa abbastanza
                  const compressionRatio = compressedSize / originalSize;

                  if (
                    compressionRatio > 0.9 &&
                    attempt < 3 &&
                    outputFormat !== "image/png"
                  ) {
                    // Prova compressione più aggressiva
                    const newQuality = Math.max(0.3, quality - 0.15);
                    tryCompress(newQuality, attempt + 1);
                    return;
                  }

                  // Se l'immagine è molto piccola ma non compressa, forza la compressione
                  if (
                    originalSize < 100000 &&
                    compressionRatio > 0.95 &&
                    attempt < 2
                  ) {
                    // Per immagini piccole, usa compressione più aggressiva
                    const newQuality = Math.max(0.4, quality - 0.3);
                    if (outputFormat === "image/jpeg" || format === "jpeg") {
                      tryCompress(newQuality, attempt + 1);
                      return;
                    } else if (
                      format === "original" &&
                      file.type === "image/jpeg"
                    ) {
                      // Forza JPEG per immagini piccole non compresse
                      outputFormat = "image/jpeg";
                      tryCompress(newQuality, attempt + 1);
                      return;
                    }
                  }

                  // Calcola il risparmio di spazio
                  const savings =
                    ((originalSize - compressedSize) / originalSize) * 100;

                  // Crea URL per l'anteprima
                  const url = URL.createObjectURL(blob);

                  resolve({
                    blob,
                    url,
                    savings: Math.max(0, savings),
                  });
                } else {
                  reject(new Error("Compressione fallita"));
                }
              },
              outputFormat,
              quality
            );
          };

          // Avvia la compressione
          tryCompress(compressionQuality);
        };

        img.onerror = () => {
          reject(new Error("Caricamento immagine fallito"));
        };
      };

      reader.onerror = () => {
        reject(new Error("Lettura file fallita"));
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
    const results: {
      original: File;
      compressed: Blob;
      url: string;
      savings: number;
    }[] = [];
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
          savings: result.savings,
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
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `compressed_${filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Funzione per scaricare tutte le immagini come ZIP
  const downloadAllAsZip = async () => {
    if (compressedFiles.length === 0) return;

    try {
      const zip = new JSZip();

      // Aggiungi ogni immagine compressa al ZIP
      for (let i = 0; i < compressedFiles.length; i++) {
        const item = compressedFiles[i];

        // Converti blob in array buffer
        const arrayBuffer = await item.compressed.arrayBuffer();

        // Determina l'estensione del file
        let extension =
          item.original.name.split(".").pop()?.toLowerCase() || "jpg";
        if (format !== "original") {
          extension = format === "jpeg" ? "jpg" : format;
        }

        // Nome del file compresso
        const fileName =
          item.original.name.replace(/\.[^/.]+$/, "") +
          `_compressed.${extension}`;

        // Aggiungi al ZIP
        zip.file(fileName, arrayBuffer);
      }

      // Genera il file ZIP
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // Scarica il file ZIP
      const link = document.createElement("a");
      const url = URL.createObjectURL(zipBlob);
      link.href = url;
      link.download = `immagini_compresse_${new Date()
        .toISOString()
        .slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download ZIP completato",
        description: `${compressedFiles.length} immagini scaricate in un file ZIP`,
        duration: 4000,
      });
    } catch (error) {
      console.error("Errore nella creazione del ZIP:", error);
      toast({
        title: "Errore download ZIP",
        description:
          "Impossibile creare il file ZIP. Prova a scaricare le immagini singolarmente.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const downloadAll = () => {
    if (compressedFiles.length === 0) return;

    if (compressedFiles.length > 1) {
      downloadAllAsZip();
    } else {
      // Per una sola immagine, scarica direttamente
      downloadFile(
        compressedFiles[0].compressed,
        compressedFiles[0].original.name
      );
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Comprimi Immagini Online Gratis - Ottimizza JPEG PNG WEBP</h1>
        <p className="text-gray-600 mt-2">
          Comprimi e ottimizza le tue immagini online mantenendo la qualità
          originale. Riduci dimensioni file JPEG, PNG, WEBP e GIF per web e
          social media. Strumento gratuito di compressione immagini senza
          perdita di qualità, perfetto per velocizzare il tuo sito web e
          risparmiare spazio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            {" "}
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2">
                1. Carica le immagini (fino a 50)
              </h2>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {files.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-4 max-w-full overflow-hidden">
                      {files.slice(0, 12).map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-16 h-16 object-cover border rounded"
                          />
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Rimuovi file"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {files.length > 12 && (
                        <div className="w-16 h-16 border rounded bg-gray-100 flex items-center justify-center text-xs">
                          +{files.length - 12}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {files.length} immagini caricate
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Dimensione totale:{" "}
                      {formatBytes(
                        files.reduce((acc, file) => acc + file.size, 0)
                      )}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFiles([]);
                          setCompressedFiles([]);
                          setTotalSavings(0);
                        }}
                      >
                        <Trash className="h-4 w-4 mr-1" /> Rimuovi tutte
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("add-files")?.click()
                        }
                        disabled={files.length >= 50}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Aggiungi altre
                      </Button>
                    </div>
                    <input
                      id="add-files"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleAddFiles}
                    />
                  </div>
                ) : (
                  <div>
                    <Upload
                      className={`mx-auto h-12 w-12 mb-2 ${
                        isDragActive ? "text-blue-500" : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`mb-2 ${
                        isDragActive
                          ? "text-blue-600 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {isDragActive
                        ? "Rilascia qui le tue immagini"
                        : "Trascina qui le tue immagini o"}
                    </p>
                    {!isDragActive && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        Seleziona file
                      </Button>
                    )}
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Formati supportati: JPG, PNG, WEBP, GIF (max 10MB per
                      file, fino a 50 file)
                    </p>
                  </div>
                )}
              </div>

              {/* Lista dettagliata dei file se ce ne sono molti */}
              {files.length > 12 && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-3">
                    File caricati ({files.length}/50)
                  </h3>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white p-2 rounded border"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`${file.name} preview`}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-medium truncate"
                              title={file.name}
                            >
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatBytes(file.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-4">
                2. Opzioni di compressione
              </h2>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Base</TabsTrigger>
                  <TabsTrigger value="advanced">Avanzate</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="format">Formato di output</Label>
                      <Select value={format} onValueChange={setFormat}>
                        <SelectTrigger id="format" className="mt-1">
                          <SelectValue placeholder="Seleziona formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="original">
                            Mantieni originale
                          </SelectItem>
                          <SelectItem value="jpeg">
                            JPEG (migliore compressione)
                          </SelectItem>
                          <SelectItem value="webp">
                            WEBP (formato moderno)
                          </SelectItem>
                          <SelectItem value="png">
                            PNG (senza perdite)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quality" className="flex justify-between">
                        <span>Qualità: {quality}%</span>
                        <span className="text-sm text-gray-500">
                          {quality >= 90
                            ? "Massima"
                            : quality >= 70
                            ? "Alta"
                            : quality >= 50
                            ? "Media"
                            : "Bassa"}
                        </span>
                      </Label>
                      <Slider
                        id="quality"
                        min={30}
                        max={100}
                        step={5}
                        value={[quality]}
                        onValueChange={(value) => setQuality(value[0])}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>File più piccoli</span>
                        <span>Qualità migliore</span>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="aggressive"
                          checked={aggressiveCompression}
                          onCheckedChange={(checked) =>
                            setAggressiveCompression(checked === true)
                          }
                        />
                        <Label htmlFor="aggressive">
                          Compressione aggressiva (per immagini piccole)
                        </Label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Forza la compressione anche su file già ottimizzati
                      </p>
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
                        min="100"
                        max="4000"
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
                        min="100"
                        max="4000"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="maintain-ratio"
                          checked={maintainRatio}
                          onCheckedChange={(checked) =>
                            setMaintainRatio(checked === true)
                          }
                        />
                        <Label htmlFor="maintain-ratio">
                          Mantieni proporzioni originali
                        </Label>
                      </div>
                    </div>
                    <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-2">
                        Suggerimenti avanzati:
                      </h4>
                      <ul className="text-sm text-blue-600 space-y-1">
                        <li>• JPEG: ideale per foto (70-85% qualità)</li>
                        <li>• WEBP: miglior rapporto qualità/dimensione</li>
                        <li>• PNG: per immagini con trasparenza</li>
                        <li>
                          • Ridurre dimensioni: efficace per grandi risparmi
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2">
                3. Comprimi le immagini
              </h2>
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
                    <FileMinusIcon className="mr-2 h-5 w-5" />
                    Comprimi {files.length > 0 ? files.length : ""} immagini
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
                      <p className="font-medium">
                        Statistiche di compressione:
                      </p>
                      <p className="text-sm text-gray-600">
                        Dimensione originale:{" "}
                        {formatBytes(
                          files.reduce((acc, file) => acc + file.size, 0)
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        Dimensione compressa:{" "}
                        {formatBytes(
                          compressedFiles.reduce(
                            (acc, file) => acc + file.compressed.size,
                            0
                          )
                        )}
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        Risparmio: {formatBytes(totalSavings)} (
                        {(
                          (totalSavings /
                            files.reduce((acc, file) => acc + file.size, 0)) *
                          100
                        ).toFixed(1)}
                        %)
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                      {compressedFiles.length > 1 && (
                        <Button onClick={downloadAllAsZip}>
                          <Archive className="mr-2 h-4 w-4" />
                          Scarica ZIP
                        </Button>
                      )}
                      <Button
                        onClick={downloadAll}
                        variant={
                          compressedFiles.length > 1 ? "outline" : "default"
                        }
                      >
                        <Download className="mr-2 h-5 w-5" />
                        {compressedFiles.length > 1 ? "Singole" : "Scarica"}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {compressedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex-shrink-0 w-full md:w-32">
                        <img
                          src={file.url}
                          alt={`Anteprima di ${file.original.name}`}
                          className="w-full h-auto object-contain max-h-32"
                        />
                      </div>
                      <div className="flex-grow space-y-1">
                        <p
                          className="font-medium truncate"
                          title={file.original.name}
                        >
                          {file.original.name}
                        </p>
                        <div className="flex items-center text-sm">
                          <span className="text-gray-600">
                            {formatBytes(file.original.size)}
                          </span>
                          <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                          <span className="text-gray-600">
                            {formatBytes(file.compressed.size)}
                          </span>
                          <span className="ml-2 text-green-600">
                            (-{file.savings.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement("a");
                            const extension =
                              format !== "original"
                                ? format === "jpeg"
                                  ? "jpg"
                                  : format
                                : file.original.name.split(".").pop();
                            const fileName =
                              file.original.name.replace(/\.[^/.]+$/, "") +
                              `_compressed.${extension}`;
                            link.href = URL.createObjectURL(file.compressed);
                            link.download = fileName;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
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
            <h3 className="font-medium mb-4">
              Come funziona - Compressione Batch
            </h3>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  1
                </div>
                <span>
                  Carica <strong>fino a 50 immagini</strong> con drag & drop o
                  selezione multipla
                </span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  2
                </div>
                <span>
                  Personalizza le opzioni di compressione per il{" "}
                  <strong>batch processing</strong>
                </span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  3
                </div>
                <span>
                  Comprimi tutte le immagini e <strong>scarica come ZIP</strong>{" "}
                  o singolarmente
                </span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  4
                </div>
                <span>
                  Gestisci i file:{" "}
                  <strong>aggiungi, rimuovi o sostituisci</strong> singoli file
                </span>
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
                <span>
                  Per le immagini da pubblicare sul web, una qualità del 70-80%
                  è generalmente sufficiente
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium mt-0.5">
                  •
                </div>
                <span>
                  Il formato WEBP offre una buona compressione mantenendo la
                  qualità visiva
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium mt-0.5">
                  •
                </div>
                <span>
                  Ridurre le dimensioni in pixel è un modo efficace per
                  diminuire il peso del file
                </span>
              </li>
            </ul>
          </div>

          <div className="ad-placeholder h-60 mt-6">Spazio pubblicitario</div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ComprimiImmagini;
