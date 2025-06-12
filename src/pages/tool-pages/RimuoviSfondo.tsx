import { useState, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Download,
  Image as ImageIcon,
  Trash,
  RefreshCw,
  Archive,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import JSZip from "jszip";

const RimuoviSfondo = () => {
  const { toast } = useToast();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tolerance, setTolerance] = useState(40);
  // Processing state (unificato per singola e multiple)
  const [images, setImages] = useState<File[]>([]);
  const [processedImages, setProcessedImages] = useState<
    { file: File; processed: string; originalUrl: string }[]
  >([]);
  const [processing, setProcessing] = useState(false);
  const [currentProcessing, setCurrentProcessing] = useState<number>(0);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        setImages(validFiles);
        setProcessedImages([]);
        setImage(validFiles[0] || null);
        setProcessedImage(null);

        // Crea preview per la prima immagine
        if (validFiles[0]) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setPreview(e.target.result as string);
            }
          };
          reader.readAsDataURL(validFiles[0]);
        } else {
          setPreview(null);
        }
      }
    }
  };

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

      setImages(validFiles);
      setProcessedImages([]);
      setImage(validFiles[0] || null);
      setProcessedImage(null);

      // Crea preview per la prima immagine
      if (validFiles[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreview(e.target.result as string);
          }
        };
        reader.readAsDataURL(validFiles[0]);
      } else {
        setPreview(null);
      }
    }
  };
  // Algoritmo di segmentazione del colore migliorato
  const colorDistance = (
    r1: number,
    g1: number,
    b1: number,
    r2: number,
    g2: number,
    b2: number
  ): number => {
    // Usa la formula di distanza Euclidean pesata per una migliore percezione dei colori
    const rmean = (r1 + r2) / 2;
    const deltaR = r1 - r2;
    const deltaG = g1 - g2;
    const deltaB = b1 - b2;

    return Math.sqrt(
      (2 + rmean / 256) * deltaR * deltaR +
        4 * deltaG * deltaG +
        (2 + (255 - rmean) / 256) * deltaB * deltaB
    );
  };
  // Algoritmo di flood fill per identificare regioni connesse (ottimizzato)
  const floodFill = (
    data: Uint8ClampedArray,
    width: number,
    height: number,
    startX: number,
    startY: number,
    tolerance: number
  ): boolean[] => {
    const visited = new Array(width * height).fill(false);
    const queue: { x: number; y: number }[] = [];
    const result = new Array(width * height).fill(false);

    // Controlla i bounds
    if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
      return result;
    }

    const startIndex = (startY * width + startX) * 4;
    const targetR = data[startIndex];
    const targetG = data[startIndex + 1];
    const targetB = data[startIndex + 2];

    queue.push({ x: startX, y: startY });
    let processedPixels = 0;
    const maxPixels = Math.min(width * height, 50000); // Limita per evitare hang

    while (queue.length > 0 && processedPixels < maxPixels) {
      const { x, y } = queue.shift()!;
      const index = y * width + x;

      if (x < 0 || x >= width || y < 0 || y >= height || visited[index])
        continue;

      const pixelIndex = index * 4;
      const distance = colorDistance(
        targetR,
        targetG,
        targetB,
        data[pixelIndex],
        data[pixelIndex + 1],
        data[pixelIndex + 2]
      );

      if (distance > tolerance) continue;

      visited[index] = true;
      result[index] = true;
      processedPixels++;

      // Aggiungi pixel adiacenti alla queue (solo se la queue non è troppo grande)
      if (queue.length < 10000) {
        queue.push({ x: x + 1, y });
        queue.push({ x: x - 1, y });
        queue.push({ x, y: y + 1 });
        queue.push({ x, y: y - 1 });
      }
    }

    return result;
  };

  // Algoritmo di edge detection per identificare i bordi del soggetto
  const detectEdges = (
    data: Uint8ClampedArray,
    width: number,
    height: number
  ): number[] => {
    const edges = new Array(width * height).fill(0);

    // Operatore Sobel per la detection dei bordi
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0,
          gy = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
            const intensity =
              (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) /
              3;

            const kernelIndex = (ky + 1) * 3 + (kx + 1);
            gx += intensity * sobelX[kernelIndex];
            gy += intensity * sobelY[kernelIndex];
          }
        }

        const magnitude = Math.sqrt(gx * gx + gy * gy);
        edges[y * width + x] = magnitude;
      }
    }

    return edges;
  };

  // Analisi della distribuzione dei colori per identificare il colore di sfondo dominante
  const findDominantBackgroundColor = (
    data: Uint8ClampedArray,
    width: number,
    height: number
  ): { r: number; g: number; b: number } => {
    const colorMap = new Map<string, number>();
    const borderPixels: { r: number; g: number; b: number }[] = [];

    // Campiona i pixel del bordo dell'immagine
    for (let x = 0; x < width; x++) {
      // Top border
      const topIndex = x * 4;
      borderPixels.push({
        r: data[topIndex],
        g: data[topIndex + 1],
        b: data[topIndex + 2],
      });

      // Bottom border
      const bottomIndex = ((height - 1) * width + x) * 4;
      borderPixels.push({
        r: data[bottomIndex],
        g: data[bottomIndex + 1],
        b: data[bottomIndex + 2],
      });
    }

    for (let y = 0; y < height; y++) {
      // Left border
      const leftIndex = y * width * 4;
      borderPixels.push({
        r: data[leftIndex],
        g: data[leftIndex + 1],
        b: data[leftIndex + 2],
      });

      // Right border
      const rightIndex = (y * width + width - 1) * 4;
      borderPixels.push({
        r: data[rightIndex],
        g: data[rightIndex + 1],
        b: data[rightIndex + 2],
      });
    }

    // Raggruppa colori simili e trova il più frequente
    borderPixels.forEach((pixel) => {
      const key = `${Math.floor(pixel.r / 10) * 10},${
        Math.floor(pixel.g / 10) * 10
      },${Math.floor(pixel.b / 10) * 10}`;
      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    });

    let maxCount = 0;
    let dominantColor = { r: 255, g: 255, b: 255 };

    colorMap.forEach((count, colorKey) => {
      if (count > maxCount) {
        maxCount = count;
        const [r, g, b] = colorKey.split(",").map(Number);
        dominantColor = { r, g, b };
      }
    });
    return dominantColor;
  };

  // Funzione per processare un'immagine (estratta per riuso)
  const processImageData = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        reject(new Error("Canvas non disponibile"));
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Contesto canvas non disponibile"));
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        try {
          // Limita le dimensioni per evitare problemi di performance
          const maxSize = 1024; // Ridotto per batch processing
          let { width, height } = img;

          if (width > maxSize || height > maxSize) {
            const ratio = Math.min(maxSize / width, maxSize / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;

          // Disegna l'immagine ridimensionata sul canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Ottieni i dati dell'immagine
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;

          // Applica un algoritmo semplificato per il batch processing
          const bgColor = findDominantBackgroundColor(data, width, height);

          // Versione semplificata senza edge detection per velocità
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const colorDist = colorDistance(
              r,
              g,
              b,
              bgColor.r,
              bgColor.g,
              bgColor.b
            );

            if (colorDist < tolerance * 0.8) {
              // Leggermente più conservativo
              data[i + 3] = 0; // Trasparente
            } else if (colorDist < tolerance) {
              // Semi-trasparenza per i bordi
              data[i + 3] = Math.floor(
                255 * (1 - ((tolerance - colorDist) / tolerance) * 0.5)
              );
            }
          }

          // Applica i dati modificati al canvas
          ctx.putImageData(imageData, 0, 0);

          // Converti in PNG con trasparenza
          const processedDataUrl = canvas.toDataURL("image/png", 0.8);
          resolve(processedDataUrl);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("Impossibile caricare l'immagine"));
      };

      img.src = imageUrl;
    });
  };
  // Funzione per processare tutte le immagini
  const processImages = async () => {
    if (images.length === 0) return;

    setProcessing(true);
    setCurrentProcessing(0);
    const processed: { file: File; processed: string; originalUrl: string }[] =
      [];

    for (let i = 0; i < images.length; i++) {
      try {
        setCurrentProcessing(i + 1);

        // Crea URL per l'immagine corrente
        const originalUrl = URL.createObjectURL(images[i]);

        // Processa l'immagine
        const processedUrl = await processImageData(originalUrl);

        processed.push({
          file: images[i],
          processed: processedUrl,
          originalUrl: originalUrl,
        });

        // Se è una singola immagine, aggiorna anche il preview
        if (images.length === 1) {
          setProcessedImage(processedUrl);
        }

        // Pausa breve per non bloccare l'UI
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Errore processando ${images[i].name}:`, error);
        toast({
          title: "Errore nell'elaborazione",
          description: `Impossibile processare ${images[i].name}`,
          variant: "destructive",
          duration: 4000,
        });
      }
    }

    setProcessedImages(processed);
    setProcessing(false);
    setCurrentProcessing(0);

    toast({
      title: "Elaborazione completata",
      description: `${processed.length} di ${images.length} immagini elaborate con successo`,
      duration: 4000,
    });
  }; // Funzione per scaricare tutte le immagini processate
  const downloadAllProcessedImages = async () => {
    if (processedImages.length === 0) return;

    try {
      // Crea un nuovo file ZIP
      const zip = new JSZip();

      // Aggiungi ogni immagine al ZIP
      for (let i = 0; i < processedImages.length; i++) {
        const item = processedImages[i];

        // Converti data URL in blob
        const response = await fetch(item.processed);
        const blob = await response.blob();

        // Nome del file
        const fileName = item.file.name.replace(/\.[^/.]+$/, "") + "_no_bg.png";

        // Aggiungi al ZIP
        zip.file(fileName, blob);
      }

      // Genera il file ZIP
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // Scarica il file ZIP
      const link = document.createElement("a");
      const url = URL.createObjectURL(zipBlob);
      link.href = url;
      link.download = `immagini_senza_sfondo_${new Date()
        .toISOString()
        .slice(0, 10)}.zip`;
      link.click();

      // Pulisci l'URL
      URL.revokeObjectURL(url);

      toast({
        title: "Download ZIP completato",
        description: `${processedImages.length} immagini scaricate in un file ZIP`,
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
  }; // Funzione per scaricare singole immagini (fallback)
  const downloadSingleImages = async () => {
    if (processedImages.length === 0) return;

    for (let i = 0; i < processedImages.length; i++) {
      const item = processedImages[i];
      const link = document.createElement("a");
      const fileName = item.file.name.replace(/\.[^/.]+$/, "") + "_no_bg.png";
      link.download = fileName;
      link.href = item.processed;
      link.click();

      // Pausa breve tra i download
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    toast({
      title: "Download singoli completato",
      description: `${processedImages.length} immagini scaricate separatamente`,
      duration: 4000,
    });
  };

  const removeBackground = async () => {
    if (!image || !preview) return;

    setLoading(true);

    try {
      const canvas = canvasRef.current;
      if (!canvas) {
        setLoading(false);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setLoading(false);
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        try {
          // Limita le dimensioni per evitare problemi di performance
          const maxSize = 2048;
          let { width, height } = img;

          if (width > maxSize || height > maxSize) {
            const ratio = Math.min(maxSize / width, maxSize / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;

          // Disegna l'immagine ridimensionata sul canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Ottieni i dati dell'immagine
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;

          // 1. Trova il colore di sfondo dominante
          const bgColor = findDominantBackgroundColor(data, width, height);

          // 2. Detect edges per identificare i bordi del soggetto
          const edges = detectEdges(data, width, height);
          const edgeThreshold = 50;

          // 3. Applica flood fill partendo dai bordi (campionamento ridotto per performance)
          const backgroundMask = new Array(width * height).fill(false);

          // Campiona solo ogni 4 pixel per migliorare le performance
          const step = Math.max(1, Math.floor(Math.min(width, height) / 100));

          // Flood fill dai bordi dell'immagine usando campionamento
          for (let x = 0; x < width; x += step) {
            try {
              // Top e bottom borders
              const topFill = floodFill(data, width, height, x, 0, tolerance);
              const bottomFill = floodFill(
                data,
                width,
                height,
                x,
                height - 1,
                tolerance
              );

              topFill.forEach((filled, index) => {
                if (filled) backgroundMask[index] = true;
              });
              bottomFill.forEach((filled, index) => {
                if (filled) backgroundMask[index] = true;
              });
            } catch (e) {
              console.warn("Errore nel flood fill orizzontale:", e);
            }
          }

          for (let y = 0; y < height; y += step) {
            try {
              // Left e right borders
              const leftFill = floodFill(data, width, height, 0, y, tolerance);
              const rightFill = floodFill(
                data,
                width,
                height,
                width - 1,
                y,
                tolerance
              );

              leftFill.forEach((filled, index) => {
                if (filled) backgroundMask[index] = true;
              });
              rightFill.forEach((filled, index) => {
                if (filled) backgroundMask[index] = true;
              });
            } catch (e) {
              console.warn("Errore nel flood fill verticale:", e);
            }
          }

          // 4. Raffina la maschera usando edge detection
          for (let i = 0; i < width * height; i++) {
            const pixelIndex = i * 4;
            const r = data[pixelIndex];
            const g = data[pixelIndex + 1];
            const b = data[pixelIndex + 2];

            // Se il pixel è simile al colore di sfondo e non è vicino a un edge forte
            const colorDist = colorDistance(
              r,
              g,
              b,
              bgColor.r,
              bgColor.g,
              bgColor.b
            );
            const isNearEdge = edges[i] > edgeThreshold;

            if (colorDist < tolerance && !isNearEdge) {
              backgroundMask[i] = true;
            }
          }

          // 5. Applica anti-aliasing ai bordi (versione ottimizzata)
          for (let i = 0; i < data.length; i += 4) {
            const pixelIndex = i / 4;

            if (backgroundMask[pixelIndex]) {
              // Pixel di sfondo - completamente trasparente
              data[i + 3] = 0;
            } else {
              // Controlla se è un pixel di bordo per applicare semi-trasparenza
              const x = pixelIndex % width;
              const y = Math.floor(pixelIndex / width);

              let neighborBackgroundCount = 0;
              let totalNeighbors = 0;

              // Controlla solo i 4 vicini principali per performance
              const neighbors = [
                { dx: -1, dy: 0 },
                { dx: 1, dy: 0 },
                { dx: 0, dy: -1 },
                { dx: 0, dy: 1 },
              ];

              neighbors.forEach(({ dx, dy }) => {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                  const neighborIndex = ny * width + nx;
                  if (backgroundMask[neighborIndex]) {
                    neighborBackgroundCount++;
                  }
                  totalNeighbors++;
                }
              });

              // Applica semi-trasparenza ai pixel di bordo
              if (totalNeighbors > 0) {
                const transparencyRatio =
                  neighborBackgroundCount / totalNeighbors;
                if (transparencyRatio > 0.25) {
                  const alpha = Math.max(
                    0,
                    255 * (1 - transparencyRatio * 0.6)
                  );
                  data[i + 3] = alpha;
                }
              }
            }
          }

          // Applica i dati modificati al canvas
          ctx.putImageData(imageData, 0, 0);

          // Converti in PNG con trasparenza
          const processedDataUrl = canvas.toDataURL("image/png");
          setProcessedImage(processedDataUrl);

          setLoading(false);
          toast({
            title: "Sfondo rimosso",
            description:
              "Lo sfondo è stato rimosso con algoritmi avanzati di computer vision. L'immagine è stata convertita in PNG.",
            duration: 4000,
          });
        } catch (error) {
          console.error("Errore durante l'elaborazione:", error);
          setLoading(false);
          toast({
            title: "Errore nell'elaborazione",
            description:
              "Si è verificato un errore durante l'elaborazione dell'immagine. Prova con un'immagine più piccola.",
            variant: "destructive",
            duration: 4000,
          });
        }
      };

      img.onerror = () => {
        setLoading(false);
        toast({
          title: "Errore",
          description: "Impossibile caricare l'immagine",
          variant: "destructive",
          duration: 4000,
        });
      };

      img.src = preview;
    } catch (error) {
      console.error("Errore generale:", error);
      setLoading(false);
      toast({
        title: "Errore",
        description:
          "Si è verificato un errore durante l'elaborazione dell'immagine",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.download = `no-background-${Date.now()}.png`;
    link.href = processedImage;
    link.click();
    toast({
      title: "Download avviato",
      description: "L'immagine senza sfondo è stata scaricata",
      duration: 4000,
    });
  };
  const reset = () => {
    setImage(null);
    setPreview(null);
    setProcessedImage(null);
    setImages([]);
    setProcessedImages([]);
  };
  return (
    <MainLayout>
      {" "}
      <div className="tool-header">
        <h1>
          Rimuovi Sfondo da Foto Online Gratis - AI Background Remover Batch
        </h1>
        <p className="text-gray-600 mt-2">
          Rimuovi automaticamente lo sfondo dalle tue foto con intelligenza
          artificiale avanzata.{" "}
          <strong>Caricamento massivo fino a 50 immagini</strong> per
          elaborazione batch professionale. Converti immagini in PNG con
          trasparenza perfetta. Strumento gratuito per rimuovere sfondo da foto,
          perfetto per e-commerce, social media e design professionale. Supporta
          JPEG, PNG, WEBP con <strong>processing batch veloce</strong> per
          grandi volumi di immagini.
        </p>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            {" "}
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-2">
                1. Carica immagini (fino a 50 per elaborazione batch)
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
                {images.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-4 max-w-full overflow-hidden">
                      {images.slice(0, 12).map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-16 h-16 object-cover border rounded"
                          />
                        </div>
                      ))}
                      {images.length > 12 && (
                        <div className="w-16 h-16 border rounded bg-gray-100 flex items-center justify-center text-xs">
                          +{images.length - 12}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {images.length} immagini caricate
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={reset}>
                        <Trash className="h-4 w-4 mr-1" /> Rimuovi tutte
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("images-upload")?.click()
                        }
                      >
                        Aggiungi altre
                      </Button>
                    </div>
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
                          document.getElementById("images-upload")?.click()
                        }
                      >
                        Seleziona immagini
                      </Button>
                    )}
                    <input
                      id="images-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Seleziona una o più immagini per{" "}
                      <strong>elaborazione batch</strong> (JPG, PNG, WEBP - max
                      10MB ciascuna, fino a 50 immagini simultanee)
                    </p>
                  </div>
                )}
              </div>
            </div>{" "}
            {(preview || images.length > 0) && (
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-4">
                  2. Rimuovi lo sfondo
                </h2>
                <Alert className="mb-4">
                  <AlertTitle>Nota importante</AlertTitle>
                  <AlertDescription>
                    Questo strumento utilizza algoritmi avanzati di computer
                    vision per la rimozione dello sfondo, inclusi edge
                    detection, flood fill e analisi dei colori. Funziona meglio
                    con immagini che hanno uno sfondo ben contrastato dal
                    soggetto principale. Le immagini molto grandi vengono
                    automaticamente ridimensionate per garantire prestazioni
                    ottimali.
                  </AlertDescription>
                </Alert>

                <div className="mb-4">
                  <Label htmlFor="tolerance" className="flex justify-between">
                    <span>Sensibilità: {tolerance}</span>
                    <span className="text-sm text-gray-500">
                      {tolerance < 20
                        ? "Bassa"
                        : tolerance < 60
                        ? "Media"
                        : "Alta"}
                    </span>
                  </Label>
                  <Slider
                    id="tolerance"
                    min={10}
                    max={100}
                    step={5}
                    value={[tolerance]}
                    onValueChange={(value) => setTolerance(value[0])}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Più preciso</span>
                    <span>Più permissivo</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Valori bassi: rimuove solo pixel molto simili allo sfondo
                    <br />
                    Valori alti: rimuove anche pixel parzialmente simili allo
                    sfondo
                  </p>
                </div>

                <div className="space-y-4">
                  {processing && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Elaborazione in corso...</span>
                        <span>
                          {currentProcessing} di {images.length}
                        </span>
                      </div>
                      <Progress
                        value={(currentProcessing / images.length) * 100}
                      />
                    </div>
                  )}

                  <Button
                    onClick={
                      images.length === 1 ? removeBackground : processImages
                    }
                    disabled={processing || images.length === 0}
                    className="w-full py-6"
                  >
                    {processing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Elaborazione in corso...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-5 w-5" />
                        {images.length === 1
                          ? "Rimuovi sfondo (AI-Enhanced)"
                          : `Elabora ${images.length} immagini`}
                      </>
                    )}
                  </Button>

                  {processedImages.length > 0 && (
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                          Risultati ({processedImages.length})
                        </h3>
                        {processedImages.length > 1 && (
                          <div className="flex gap-2">
                            <Button
                              onClick={downloadAllProcessedImages}
                              className="px-4"
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              ZIP ({processedImages.length})
                            </Button>
                            <Button
                              onClick={downloadSingleImages}
                              variant="outline"
                              className="px-4"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Singole
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                        {processedImages.map((item, index) => (
                          <div key={index} className="border rounded-lg p-2">
                            <div className="mb-2">
                              <div className="text-xs text-gray-500 mb-1">
                                Originale
                              </div>
                              <img
                                src={item.originalUrl}
                                alt={`Original ${index + 1}`}
                                className="w-full h-20 object-cover rounded"
                              />
                            </div>
                            <div className="mb-2">
                              <div className="text-xs text-gray-500 mb-1">
                                Processata
                              </div>
                              <div className="bg-checkerboard rounded p-1">
                                <img
                                  src={item.processed}
                                  alt={`Processed ${index + 1}`}
                                  className="w-full h-20 object-contain"
                                />
                              </div>
                            </div>
                            <Button
                              onClick={() => {
                                const link = document.createElement("a");
                                const fileName =
                                  item.file.name.replace(/\.[^/.]+$/, "") +
                                  "_no_bg.png";
                                link.download = fileName;
                                link.href = item.processed;
                                link.click();
                              }}
                              size="sm"
                              className="w-full text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Scarica
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {processedImage && (
              <div>
                <h2 className="text-xl font-medium mb-4">3. Risultato</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Originale</h3>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <img
                        src={preview}
                        alt="Immagine originale"
                        className="w-full h-48 object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Senza sfondo</h3>
                    <div className="border rounded-lg p-4 bg-checkerboard">
                      <img
                        src={processedImage}
                        alt="Immagine senza sfondo"
                        className="w-full h-48 object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={downloadImage} className="px-8">
                    <Download className="h-5 w-5 mr-2" />
                    Scarica PNG
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          {" "}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-4">
              Come funziona - Batch Processing
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
                  Regola la sensibilità per l'
                  <strong>elaborazione batch</strong> ottimale
                </span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  3
                </div>
                <span>
                  Elabora tutte le immagini e scarica come{" "}
                  <strong>ZIP singolo</strong> o file separati
                </span>
              </li>
            </ol>
          </div>{" "}
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-4">Vantaggi Batch Processing</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2 items-start">
                <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium mt-0.5">
                  •
                </div>
                <span>
                  <strong>Elaborazione massiva:</strong> Fino a 50 immagini in
                  una sola volta
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium mt-0.5">
                  •
                </div>
                <span>
                  <strong>Download ZIP:</strong> Scarica tutte le immagini
                  processate in un archivio
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium mt-0.5">
                  •
                </div>
                <span>
                  <strong>Ideale per e-commerce:</strong> Processa cataloghi
                  prodotti velocemente
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium mt-0.5">
                  •
                </div>
                <span>
                  <strong>Risparmio tempo:</strong> Automatizza la rimozione
                  sfondo su grandi volumi
                </span>
              </li>
              <li className="flex gap-2 items-start">
                <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium mt-0.5">
                  •
                </div>
                <span>
                  Tutti i calcoli sono eseguiti localmente per la privacy
                </span>
              </li>
            </ul>
          </div>
          <div className="ad-placeholder h-60">Spazio pubblicitario</div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RimuoviSfondo;
