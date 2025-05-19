
import { useState, ChangeEvent } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ShapeType = "rectangle" | "circle" | "triangle" | "trapezoid" | "ellipse" | "parallelogram";

const CalcolaArea = () => {
  const [selectedShape, setSelectedShape] = useState<ShapeType>("rectangle");
  
  // Rectangle
  const [rectWidth, setRectWidth] = useState<string>("");
  const [rectHeight, setRectHeight] = useState<string>("");
  const [rectArea, setRectArea] = useState<number | null>(null);
  
  // Circle
  const [radius, setRadius] = useState<string>("");
  const [circleArea, setCircleArea] = useState<number | null>(null);
  
  // Triangle
  const [base, setBase] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [triangleArea, setTriangleArea] = useState<number | null>(null);
  
  // Trapezoid
  const [topBase, setTopBase] = useState<string>("");
  const [bottomBase, setBottomBase] = useState<string>("");
  const [trapezoidHeight, setTrapezoidHeight] = useState<string>("");
  const [trapezoidArea, setTrapezoidArea] = useState<number | null>(null);
  
  // Ellipse
  const [majorAxis, setMajorAxis] = useState<string>("");
  const [minorAxis, setMinorAxis] = useState<string>("");
  const [ellipseArea, setEllipseArea] = useState<number | null>(null);
  
  // Parallelogram
  const [parallelogramBase, setParallelogramBase] = useState<string>("");
  const [parallelogramHeight, setParallelogramHeight] = useState<string>("");
  const [parallelogramArea, setParallelogramArea] = useState<number | null>(null);
  
  // Units
  const [unit, setUnit] = useState<string>("m");
  
  const calculateRectangleArea = () => {
    const width = parseFloat(rectWidth);
    const height = parseFloat(rectHeight);
    
    if (!isNaN(width) && !isNaN(height)) {
      const area = width * height;
      setRectArea(area);
    }
  };
  
  const calculateCircleArea = () => {
    const r = parseFloat(radius);
    
    if (!isNaN(r)) {
      const area = Math.PI * r * r;
      setCircleArea(area);
    }
  };
  
  const calculateTriangleArea = () => {
    const b = parseFloat(base);
    const h = parseFloat(height);
    
    if (!isNaN(b) && !isNaN(h)) {
      const area = 0.5 * b * h;
      setTriangleArea(area);
    }
  };
  
  const calculateTrapezoidArea = () => {
    const top = parseFloat(topBase);
    const bottom = parseFloat(bottomBase);
    const h = parseFloat(trapezoidHeight);
    
    if (!isNaN(top) && !isNaN(bottom) && !isNaN(h)) {
      const area = 0.5 * (top + bottom) * h;
      setTrapezoidArea(area);
    }
  };
  
  const calculateEllipseArea = () => {
    const a = parseFloat(majorAxis);
    const b = parseFloat(minorAxis);
    
    if (!isNaN(a) && !isNaN(b)) {
      const area = Math.PI * a * b;
      setEllipseArea(area);
    }
  };
  
  const calculateParallelogramArea = () => {
    const b = parseFloat(parallelogramBase);
    const h = parseFloat(parallelogramHeight);
    
    if (!isNaN(b) && !isNaN(h)) {
      const area = b * h;
      setParallelogramArea(area);
    }
  };
  
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };
  };
  
  const formatArea = (area: number | null): string => {
    if (area === null) return "";
    return `${area.toFixed(2)} ${unit}²`;
  };
  
  const getAreaFormula = (shape: ShapeType): string => {
    switch (shape) {
      case "rectangle":
        return "Area = lunghezza × larghezza";
      case "circle":
        return "Area = π × r²";
      case "triangle":
        return "Area = (base × altezza) / 2";
      case "trapezoid":
        return "Area = ((base maggiore + base minore) × altezza) / 2";
      case "ellipse":
        return "Area = π × semiasse maggiore × semiasse minore";
      case "parallelogram":
        return "Area = base × altezza";
      default:
        return "";
    }
  };
  
  const renderAreaCalculationUi = () => {
    switch (selectedShape) {
      case "rectangle":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rectangle-width">Lunghezza</Label>
                <div className="flex items-center">
                  <Input
                    id="rectangle-width"
                    type="number"
                    value={rectWidth}
                    onChange={handleInputChange(setRectWidth)}
                    placeholder="0"
                    className="flex-1"
                  />
                  <span className="ml-2">{unit}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="rectangle-height">Larghezza</Label>
                <div className="flex items-center">
                  <Input
                    id="rectangle-height"
                    type="number"
                    value={rectHeight}
                    onChange={handleInputChange(setRectHeight)}
                    placeholder="0"
                    className="flex-1"
                  />
                  <span className="ml-2">{unit}</span>
                </div>
              </div>
            </div>
            
            <Button onClick={calculateRectangleArea}>Calcola Area</Button>
            
            {rectArea !== null && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-lg font-semibold">Risultato:</p>
                <p className="text-xl">{formatArea(rectArea)}</p>
              </div>
            )}
          </div>
        );
        
      case "circle":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="circle-radius">Raggio</Label>
              <div className="flex items-center">
                <Input
                  id="circle-radius"
                  type="number"
                  value={radius}
                  onChange={handleInputChange(setRadius)}
                  placeholder="0"
                  className="flex-1"
                />
                <span className="ml-2">{unit}</span>
              </div>
            </div>
            
            <Button onClick={calculateCircleArea}>Calcola Area</Button>
            
            {circleArea !== null && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-lg font-semibold">Risultato:</p>
                <p className="text-xl">{formatArea(circleArea)}</p>
              </div>
            )}
          </div>
        );
        
      case "triangle":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="triangle-base">Base</Label>
                <div className="flex items-center">
                  <Input
                    id="triangle-base"
                    type="number"
                    value={base}
                    onChange={handleInputChange(setBase)}
                    placeholder="0"
                    className="flex-1"
                  />
                  <span className="ml-2">{unit}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="triangle-height">Altezza</Label>
                <div className="flex items-center">
                  <Input
                    id="triangle-height"
                    type="number"
                    value={height}
                    onChange={handleInputChange(setHeight)}
                    placeholder="0"
                    className="flex-1"
                  />
                  <span className="ml-2">{unit}</span>
                </div>
              </div>
            </div>
            
            <Button onClick={calculateTriangleArea}>Calcola Area</Button>
            
            {triangleArea !== null && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-lg font-semibold">Risultato:</p>
                <p className="text-xl">{formatArea(triangleArea)}</p>
              </div>
            )}
          </div>
        );
        
      case "trapezoid":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trapezoid-top">Base superiore</Label>
                <div className="flex items-center">
                  <Input
                    id="trapezoid-top"
                    type="number"
                    value={topBase}
                    onChange={handleInputChange(setTopBase)}
                    placeholder="0"
                    className="flex-1"
                  />
                  <span className="ml-2">{unit}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="trapezoid-bottom">Base inferiore</Label>
                <div className="flex items-center">
                  <Input
                    id="trapezoid-bottom"
                    type="number"
                    value={bottomBase}
                    onChange={handleInputChange(setBottomBase)}
                    placeholder="0"
                    className="flex-1"
                  />
                  <span className="ml-2">{unit}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="trapezoid-height">Altezza</Label>
                <div className="flex items-center">
                  <Input
                    id="trapezoid-height"
                    type="number"
                    value={trapezoidHeight}
                    onChange={handleInputChange(setTrapezoidHeight)}
                    placeholder="0"
                    className="flex-1"
                  />
                  <span className="ml-2">{unit}</span>
                </div>
              </div>
            </div>
            
            <Button onClick={calculateTrapezoidArea}>Calcola Area</Button>
            
            {trapezoidArea !== null && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-lg font-semibold">Risultato:</p>
                <p className="text-xl">{formatArea(trapezoidArea)}</p>
              </div>
            )}
          </div>
        );
        
      case "ellipse":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ellipse-major">Semiasse maggiore</Label>
                <div className="flex items-center">
                  <Input
                    id="ellipse-major"
                    type="number"
                    value={majorAxis}
                    onChange={handleInputChange(setMajorAxis)}
                    placeholder="0"
                    className="flex-1"
                  />
                  <span className="ml-2">{unit}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="ellipse-minor">Semiasse minore</Label>
                <div className="flex items-center">
                  <Input
                    id="ellipse-minor"
                    type="number"
                    value={minorAxis}
                    onChange={handleInputChange(setMinorAxis)}
                    placeholder="0"
                    className="flex-1"
                  />
                  <span className="ml-2">{unit}</span>
                </div>
              </div>
            </div>
            
            <Button onClick={calculateEllipseArea}>Calcola Area</Button>
            
            {ellipseArea !== null && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-lg font-semibold">Risultato:</p>
                <p className="text-xl">{formatArea(ellipseArea)}</p>
              </div>
            )}
          </div>
        );
        
      case "parallelogram":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parallelogram-base">Base</Label>
                <div className="flex items-center">
                  <Input
                    id="parallelogram-base"
                    type="number"
                    value={parallelogramBase}
                    onChange={handleInputChange(setParallelogramBase)}
                    placeholder="0"
                    className="flex-1"
                  />
                  <span className="ml-2">{unit}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="parallelogram-height">Altezza</Label>
                <div className="flex items-center">
                  <Input
                    id="parallelogram-height"
                    type="number"
                    value={parallelogramHeight}
                    onChange={handleInputChange(setParallelogramHeight)}
                    placeholder="0"
                    className="flex-1"
                  />
                  <span className="ml-2">{unit}</span>
                </div>
              </div>
            </div>
            
            <Button onClick={calculateParallelogramArea}>Calcola Area</Button>
            
            {parallelogramArea !== null && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-lg font-semibold">Risultato:</p>
                <p className="text-xl">{formatArea(parallelogramArea)}</p>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Calcola Area</h1>
        <p className="text-muted-foreground">Calcola l'area di varie forme geometriche</p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Seleziona la forma geometrica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Tabs value={selectedShape} onValueChange={(value) => setSelectedShape(value as ShapeType)}>
                <TabsList className="grid grid-cols-3 md:grid-cols-6">
                  <TabsTrigger value="rectangle">Rettangolo</TabsTrigger>
                  <TabsTrigger value="circle">Cerchio</TabsTrigger>
                  <TabsTrigger value="triangle">Triangolo</TabsTrigger>
                  <TabsTrigger value="trapezoid">Trapezio</TabsTrigger>
                  <TabsTrigger value="ellipse">Ellisse</TabsTrigger>
                  <TabsTrigger value="parallelogram">Parallelogramma</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="unit-select">Unità di misura</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger id="unit-select" className="w-[180px]">
                  <SelectValue placeholder="Seleziona unità" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mm">Millimetri (mm)</SelectItem>
                  <SelectItem value="cm">Centimetri (cm)</SelectItem>
                  <SelectItem value="m">Metri (m)</SelectItem>
                  <SelectItem value="km">Chilometri (km)</SelectItem>
                  <SelectItem value="in">Pollici (in)</SelectItem>
                  <SelectItem value="ft">Piedi (ft)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">Formula</h3>
              <p className="text-muted-foreground">{getAreaFormula(selectedShape)}</p>
            </div>
            
            <div className="mt-6">
              {renderAreaCalculationUi()}
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Istruzioni</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Seleziona la forma geometrica desiderata</li>
            <li>Imposta l'unità di misura</li>
            <li>Inserisci le dimensioni richieste</li>
            <li>Clicca "Calcola Area" per ottenere il risultato</li>
          </ol>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalcolaArea;
