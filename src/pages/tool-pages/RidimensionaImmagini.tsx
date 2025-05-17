
import { useState, useRef, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Upload, Download, Image, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const RidimensionaImmagini = () => {
  const { toast } = useToast();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [newDimensions, setNewDimensions] = useState({ width: 0, height: 0 });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [imageQuality, setImageQuality] = useState(85);
  const [imageFormat, setImageFormat] = useState("jpeg");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Controlla se il file è un'immagine
      if (!selectedFile.type.startsWith('image/')) {
        toast({
          title: "Errore",
          description: "Seleziona un file immagine valido",
          variant: "destructive",
        });
        return;
      }
      
      setImage(selectedFile);
      setResizedImage(null);
      
      // Crea un URL per l'anteprima dell'immagine
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreview(e.target.result as string);
          
          // Carica l'immagine per ottenere le dimensioni originali
          const img = new Image();
          img.src = e.target.result as string;
          img.onload = () => {
            setDimensions({ width: img.width, height: img.height });
            setNewDimensions({ width: img.width, height: img.height });
          };
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value) || 0;
    
    if (maintainAspectRatio && dimensions.width) {
      const ratio = dimensions.height / dimensions.width;
      const height = Math.round(width * ratio);
      setNewDimensions({ width, height });
    } else {
      setNewDimensions({ ...newDimensions, width });
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value) || 0;
    
    if (maintainAspectRatio && dimensions.height) {
      const ratio = dimensions.width / dimensions.height;
      const width = Math.round(height * ratio);
      setNewDimensions({ width, height });
    } else {
      setNewDimensions({ ...newDimensions, height });
    }
  };

  const resizeImage = () => {
    if (!preview || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Crea un'immagine con l'anteprima
    const img = new Image();
    img.src = preview;
    
    img.onload = () => {
      // Imposta le dimensioni del canvas
      canvas.width = newDimensions.width;
      canvas.height = newDimensions.height;
      
      // Disegna l'immagine ridimensionata sul canvas
      ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height);
      
      // Converti il canvas in un'immagine
      const resized = canvas.toDataURL(`image/${imageFormat}`, imageQuality / 100);
      setResizedImage(resized);
      
      toast({
        title: "Immagine ridimensionata",
        description: `Nuove dimensioni: ${newDimensions.width}x${newDimensions.height}px`,
      });
    };
  };

  const downloadImage = () => {
    if (!resizedImage) return;
    
    const link = document.createElement('a');
    link.download = `resized-image.${imageFormat}`;
    link.href = resizedImage;
    link.click();
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Ridimensiona immagini</h1>
        <p className="text-gray-600 mt-2">
          Ridimensiona facilmente le tue immagini mantenendo la qualità. 
          Supporta formati JPEG, PNG e altri formati comuni.
        </p>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2">1. Carica un'immagine</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {preview ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={preview} 
                      alt="Anteprima" 
                      className="max-w-full max-h-64 mb-4 object-contain"
                    />
                    <p className="text-sm text-gray-500 mb-2">
                      Dimensioni originali: {dimensions.width} x {dimensions.height} px
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setImage(null);
                          setPreview(null);
                          setResizedImage(null);
                        }}
                      >
                        <Trash className="h-4 w-4 mr-1" /> Rimuovi
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        Cambia immagine
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-2">
                      Trascina qui la tua immagine o
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      Seleziona immagine
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      JPG, PNG, GIF, o altri formati di immagine
                    </p>
                  </div>
                )}
              </div>
            </div>

            {preview && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-medium mb-4">2. Imposta nuove dimensioni</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="width">Larghezza (px)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={newDimensions.width}
                        onChange={handleWidthChange}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Altezza (px)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={newDimensions.height}
                        onChange={handleHeightChange}
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="aspect-ratio"
                      checked={maintainAspectRatio}
                      onCheckedChange={setMaintainAspectRatio}
                    />
                    <Label htmlFor="aspect-ratio">Mantieni proporzioni</Label>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-medium mb-4">3. Opzioni avanzate</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="format">Formato immagine</Label>
                      <select
                        id="format"
                        value={imageFormat}
                        onChange={(e) => setImageFormat(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>
                    {imageFormat === "jpeg" && (
                      <div>
                        <Label htmlFor="quality">
                          Qualità: {imageQuality}%
                        </Label>
                        <input
                          id="quality"
                          type="range"
                          min="10"
                          max="100"
                          value={imageQuality}
                          onChange={(e) => setImageQuality(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <Button onClick={resizeImage} className="w-full">
                    Ridimensiona immagine
                  </Button>
                </div>

                {resizedImage && (
                  <div>
                    <h2 className="text-xl font-medium mb-4">4. Risultato</h2>
                    <div className="border rounded-lg p-4 flex flex-col items-center">
                      <img
                        src={resizedImage}
                        alt="Immagine ridimensionata"
                        className="max-w-full max-h-64 mb-4 object-contain"
                      />
                      <p className="text-sm text-gray-500 mb-4">
                        Nuove dimensioni: {newDimensions.width} x {newDimensions.height} px
                      </p>
                      <Button onClick={downloadImage}>
                        <Download className="h-5 w-5 mr-2" /> Scarica immagine
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-4">Caratteristiche</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <Image className="h-3 w-3" />
                </div>
                <span>Mantieni le proporzioni dell'immagine</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <Image className="h-3 w-3" />
                </div>
                <span>Regola la qualità dell'immagine</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <Image className="h-3 w-3" />
                </div>
                <span>Supporto per JPEG, PNG e WebP</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <Image className="h-3 w-3" />
                </div>
                <span>Anteprima in tempo reale</span>
              </li>
            </ul>
          </div>

          <div className="ad-placeholder h-80">
            Spazio pubblicitario
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RidimensionaImmagini;
