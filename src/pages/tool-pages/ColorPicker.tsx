
import { useState, useEffect, useRef } from "react";
import { Palette, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";

const ColorPicker = () => {
  const [color, setColor] = useState("#6366f1");
  const [rgbColor, setRgbColor] = useState({ r: 99, g: 102, b: 241 });
  const [hslColor, setHslColor] = useState({ h: 239, s: 84, l: 67 });
  const [copied, setCopied] = useState(false);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return { r, g, b };
    }
    return { r: 0, g: 0, b: 0 };
  };

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  // Update RGB and HSL when hex changes
  useEffect(() => {
    const rgb = hexToRgb(color);
    setRgbColor(rgb);
    setHslColor(rgbToHsl(rgb.r, rgb.g, rgb.b));
  }, [color]);

  // Handle hex input change
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^#?([0-9A-F]{0,6})$/i.test(value)) {
      const formattedValue = value.startsWith("#") ? value : `#${value}`;
      if (formattedValue.length <= 7) {
        setColor(formattedValue);
      }
    }
  };

  // Handle RGB input changes
  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgbColor, [channel]: value };
    setRgbColor(newRgb);
    setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  // Handle HSL input changes
  const handleHslChange = (channel: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...hslColor, [channel]: value };
    setHslColor(newHsl);
    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgbColor(rgb);
    setColor(rgbToHex(rgb.r, rgb.g, rgb.b));
  };

  // Setup canvas color picker
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        
        // Add a full rainbow of colors
        gradient.addColorStop(0, "rgb(255, 0, 0)");
        gradient.addColorStop(0.17, "rgb(255, 255, 0)");
        gradient.addColorStop(0.33, "rgb(0, 255, 0)");
        gradient.addColorStop(0.5, "rgb(0, 255, 255)");
        gradient.addColorStop(0.67, "rgb(0, 0, 255)");
        gradient.addColorStop(0.83, "rgb(255, 0, 255)");
        gradient.addColorStop(1, "rgb(255, 0, 0)");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add white to black gradient vertically
        const gradientB = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradientB.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradientB.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        gradientB.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        gradientB.addColorStop(1, "rgba(0, 0, 0, 1)");
        
        ctx.fillStyle = gradientB;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  // Handle canvas click to pick color
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        const imageData = ctx.getImageData(x, y, 1, 1).data;
        const r = imageData[0];
        const g = imageData[1];
        const b = imageData[2];
        setColor(rgbToHex(r, g, b));
        addRecentColor(rgbToHex(r, g, b));
      }
    }
  };

  // Add a color to recent colors
  const addRecentColor = (color: string) => {
    setRecentColors(prev => {
      if (!prev.includes(color)) {
        return [color, ...prev].slice(0, 10);
      }
      return prev;
    });
  };

  // Copy color to clipboard
  const copyToClipboard = (format: 'hex' | 'rgb' | 'hsl' = 'hex') => {
    let textToCopy;
    switch (format) {
      case 'hex':
        textToCopy = color;
        break;
      case 'rgb':
        textToCopy = `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`;
        break;
      case 'hsl':
        textToCopy = `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`;
        break;
    }
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      toast.success(`Copiato: ${textToCopy}`, {
        description: "Il colore è stato copiato negli appunti"
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Generate random color
  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const newColor = rgbToHex(r, g, b);
    setColor(newColor);
    addRecentColor(newColor);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Color Picker</h1>
        <p className="text-gray-600 mb-6">
          Seleziona, modifica e copia i colori in diversi formati (HEX, RGB, HSL).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div 
              className="w-full h-40 rounded-lg shadow-inner mb-4" 
              style={{ backgroundColor: color }}
            ></div>
            
            <div className="flex gap-2 mb-6">
              <Button onClick={() => copyToClipboard('hex')} className="flex-1">
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                Copia
              </Button>
              <Button variant="outline" onClick={generateRandomColor}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Casuale
              </Button>
            </div>

            <canvas 
              ref={canvasRef} 
              width={300} 
              height={200} 
              className="w-full h-40 rounded-lg cursor-pointer" 
              onClick={handleCanvasClick}
            ></canvas>
            
            <p className="text-sm text-gray-500 mt-2">
              Clicca sul selettore di colori sopra per scegliere un colore
            </p>
          </div>

          <div>
            <Tabs defaultValue="hex">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="hex">HEX</TabsTrigger>
                <TabsTrigger value="rgb">RGB</TabsTrigger>
                <TabsTrigger value="hsl">HSL</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hex" className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Codice HEX</label>
                  <div className="flex gap-2">
                    <Input 
                      value={color} 
                      onChange={handleHexChange}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={() => copyToClipboard('hex')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="rgb" className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">R: {rgbColor.r}</label>
                  <Slider
                    value={[rgbColor.r]}
                    min={0}
                    max={255}
                    step={1}
                    onValueChange={(value) => handleRgbChange('r', value[0])}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">G: {rgbColor.g}</label>
                  <Slider
                    value={[rgbColor.g]}
                    min={0}
                    max={255}
                    step={1}
                    onValueChange={(value) => handleRgbChange('g', value[0])}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">B: {rgbColor.b}</label>
                  <Slider
                    value={[rgbColor.b]}
                    min={0}
                    max={255}
                    step={1}
                    onValueChange={(value) => handleRgbChange('b', value[0])}
                  />
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Input 
                    value={`rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`}
                    readOnly
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => copyToClipboard('rgb')}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="hsl" className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">H: {hslColor.h}°</label>
                  <Slider
                    value={[hslColor.h]}
                    min={0}
                    max={359}
                    step={1}
                    onValueChange={(value) => handleHslChange('h', value[0])}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">S: {hslColor.s}%</label>
                  <Slider
                    value={[hslColor.s]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleHslChange('s', value[0])}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">L: {hslColor.l}%</label>
                  <Slider
                    value={[hslColor.l]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleHslChange('l', value[0])}
                  />
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Input 
                    value={`hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`}
                    readOnly
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => copyToClipboard('hsl')}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            {recentColors.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Colori recenti:</h3>
                <div className="flex flex-wrap gap-2">
                  {recentColors.map((col, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-md cursor-pointer border border-gray-200"
                      style={{ backgroundColor: col }}
                      onClick={() => setColor(col)}
                      title={col}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Informazioni sui formati colore</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <span className="w-4 h-4 mr-2 bg-blue-500 rounded-sm"></span>
                HEX
              </h3>
              <p className="text-sm text-gray-600">
                Format esadecimale tipo #RRGGBB, dove RR, GG, BB sono valori da 00 a FF.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <span className="w-4 h-4 mr-2 bg-green-500 rounded-sm"></span>
                RGB
              </h3>
              <p className="text-sm text-gray-600">
                Red, Green, Blue. Ogni canale varia da 0 a 255.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <span className="w-4 h-4 mr-2 bg-purple-500 rounded-sm"></span>
                HSL
              </h3>
              <p className="text-sm text-gray-600">
                Hue (0-359°), Saturation (0-100%), Lightness (0-100%).
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ColorPicker;
