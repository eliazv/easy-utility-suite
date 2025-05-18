
import { useState } from "react";
import { Copy, Check, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";

const GeneratoreColori = () => {
  const [hexColor, setHexColor] = useState("#3b82f6");
  const [rgbColor, setRgbColor] = useState({ r: 59, g: 130, b: 246 });
  const [hslColor, setHslColor] = useState({ h: 217, s: 91, l: 60 });
  const [copied, setCopied] = useState(false);
  const [paletteColors, setPaletteColors] = useState<string[]>([
    "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"
  ]);

  // Converti HEX a RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { r: 0, g: 0, b: 0 };
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  };

  // Converti RGB a HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h *= 60;
    }

    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  // Converti HSL a RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    
    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4))
    };
  };

  // Converti RGB a HEX
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  };

  const handleHexChange = (hex: string) => {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      setHexColor(hex);
      const rgb = hexToRgb(hex);
      setRgbColor(rgb);
      setHslColor(rgbToHsl(rgb.r, rgb.g, rgb.b));
    } else if (hex.length <= 7) {
      setHexColor(hex);
    }
  };

  const handleRgbChange = (key: 'r' | 'g' | 'b', value: number) => {
    const updatedRgb = { ...rgbColor, [key]: value };
    setRgbColor(updatedRgb);
    setHexColor(rgbToHex(updatedRgb.r, updatedRgb.g, updatedRgb.b));
    setHslColor(rgbToHsl(updatedRgb.r, updatedRgb.g, updatedRgb.b));
  };

  const handleHslChange = (key: 'h' | 's' | 'l', value: number) => {
    const updatedHsl = { ...hslColor, [key]: value };
    setHslColor(updatedHsl);
    const rgb = hslToRgb(updatedHsl.h, updatedHsl.s, updatedHsl.l);
    setRgbColor(rgb);
    setHexColor(rgbToHex(rgb.r, rgb.g, rgb.b));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Colore copiato negli appunti!");
    setTimeout(() => setCopied(false), 2000);
  };

  const generateRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    handleHexChange(randomHex);
  };

  const generateColorPalette = () => {
    // Genera una palette basata sul colore attuale (tinte più chiare)
    const { h, s, l } = hslColor;
    const newPalette = [];
    
    // Colore principale
    newPalette.push(hexColor);
    
    // Genera varianti più chiare
    for (let i = 1; i <= 4; i++) {
      const newL = Math.min(l + (i * 8), 95);
      const rgb = hslToRgb(h, s, newL);
      newPalette.push(rgbToHex(rgb.r, rgb.g, rgb.b));
    }
    
    setPaletteColors(newPalette);
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Generatore Colori</h1>
        <p className="text-muted-foreground">Crea, converti e gestisci colori in diversi formati</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div 
            className="h-32 rounded-lg shadow-md transition-colors mb-4 flex items-center justify-center text-white" 
            style={{ backgroundColor: hexColor }}
          >
            <Button 
              variant="ghost" 
              size="sm" 
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
              onClick={() => copyToClipboard(hexColor)}
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {hexColor}
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={generateRandomColor} className="flex gap-2">
              <Shuffle className="h-4 w-4" />
              Colore casuale
            </Button>
            <Button variant="outline" onClick={generateColorPalette}>
              Genera palette
            </Button>
          </div>

          <div className="grid grid-cols-5 gap-2 mt-4">
            {paletteColors.map((color, index) => (
              <div 
                key={index}
                className="h-12 rounded cursor-pointer hover:scale-105 transition-transform relative group"
                style={{ backgroundColor: color }}
                onClick={() => copyToClipboard(color)}
              >
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {color}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <Tabs defaultValue="hex" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="hex">HEX</TabsTrigger>
              <TabsTrigger value="rgb">RGB</TabsTrigger>
              <TabsTrigger value="hsl">HSL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hex" className="space-y-4">
              <div>
                <label className="text-sm font-medium">Valore HEX</label>
                <Input 
                  value={hexColor} 
                  onChange={(e) => handleHexChange(e.target.value)}
                  maxLength={7}
                  className="font-mono"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="rgb" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rosso: {rgbColor.r}</label>
                <Slider 
                  value={[rgbColor.r]} 
                  min={0} 
                  max={255} 
                  step={1} 
                  className="mb-6"
                  onValueChange={(val) => handleRgbChange('r', val[0])} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Verde: {rgbColor.g}</label>
                <Slider 
                  value={[rgbColor.g]} 
                  min={0} 
                  max={255}
                  step={1}
                  className="mb-6" 
                  onValueChange={(val) => handleRgbChange('g', val[0])} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Blu: {rgbColor.b}</label>
                <Slider 
                  value={[rgbColor.b]} 
                  min={0} 
                  max={255} 
                  step={1}
                  onValueChange={(val) => handleRgbChange('b', val[0])} 
                />
              </div>
              <div className="font-mono text-sm mt-4">
                rgb({rgbColor.r}, {rgbColor.g}, {rgbColor.b})
              </div>
            </TabsContent>
            
            <TabsContent value="hsl" className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tonalità: {hslColor.h}°</label>
                <Slider 
                  value={[hslColor.h]} 
                  min={0} 
                  max={360} 
                  step={1}
                  className="mb-6" 
                  onValueChange={(val) => handleHslChange('h', val[0])} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Saturazione: {hslColor.s}%</label>
                <Slider 
                  value={[hslColor.s]} 
                  min={0} 
                  max={100} 
                  step={1}
                  className="mb-6" 
                  onValueChange={(val) => handleHslChange('s', val[0])} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Luminosità: {hslColor.l}%</label>
                <Slider 
                  value={[hslColor.l]} 
                  min={0} 
                  max={100} 
                  step={1}
                  onValueChange={(val) => handleHslChange('l', val[0])} 
                />
              </div>
              <div className="font-mono text-sm mt-4">
                hsl({hslColor.h}, {hslColor.s}%, {hslColor.l}%)
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default GeneratoreColori;
