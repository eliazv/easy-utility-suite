
import { useState } from "react";
import { Ruler, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/components/ui/use-toast";

interface Coordinate {
  lat: number;
  lng: number;
}

const CalcoloDistanza = () => {
  const { toast } = useToast();
  
  // Stato per coordinate inserite manualmente
  const [point1, setPoint1] = useState<Coordinate>({ lat: 0, lng: 0 });
  const [point2, setPoint2] = useState<Coordinate>({ lat: 0, lng: 0 });
  
  // Stato per unità di misura
  const [unit, setUnit] = useState<"km" | "mi">("km");
  
  // Stato per il risultato del calcolo
  const [distance, setDistance] = useState<number | null>(null);
  
  // Calcola la distanza tra due punti usando la formula dell'emisenoverso (Haversine)
  const calculateDistance = () => {
    const R = unit === "km" ? 6371 : 3958.8; // Raggio della Terra in km o miglia
    
    const dLat = toRad(point2.lat - point1.lat);
    const dLon = toRad(point2.lng - point1.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const calculatedDistance = R * c;
    
    setDistance(calculatedDistance);
    
    toast({
      title: "Calcolo completato",
      description: `La distanza è di ${calculatedDistance.toFixed(2)} ${unit}`,
    });
  };
  
  // Converti gradi in radianti
  const toRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };
  
  // Gestione degli input per le coordinate
  const handlePoint1Change = (field: "lat" | "lng", value: string) => {
    const numValue = parseFloat(value);
    setPoint1(prev => ({ ...prev, [field]: isNaN(numValue) ? 0 : numValue }));
  };
  
  const handlePoint2Change = (field: "lat" | "lng", value: string) => {
    const numValue = parseFloat(value);
    setPoint2(prev => ({ ...prev, [field]: isNaN(numValue) ? 0 : numValue }));
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Calcolo Distanza</h1>
        <p className="text-gray-600 mt-2">
          Calcola la distanza tra due punti sulla superficie terrestre utilizzando le coordinate geografiche.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <Tabs defaultValue="coordinates" className="w-full">
              <TabsList className="grid grid-cols-1 w-full md:w-auto mb-4">
                <TabsTrigger value="coordinates">Coordinate</TabsTrigger>
              </TabsList>
              
              <TabsContent value="coordinates" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Punto 1</h3>
                    <div className="space-y-2">
                      <Label htmlFor="lat1">Latitudine</Label>
                      <Input 
                        id="lat1" 
                        type="number" 
                        step="0.000001"
                        placeholder="Es. 45.4642" 
                        value={point1.lat || ''}
                        onChange={(e) => handlePoint1Change("lat", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lng1">Longitudine</Label>
                      <Input 
                        id="lng1" 
                        type="number" 
                        step="0.000001"
                        placeholder="Es. 9.1900" 
                        value={point1.lng || ''}
                        onChange={(e) => handlePoint1Change("lng", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Punto 2</h3>
                    <div className="space-y-2">
                      <Label htmlFor="lat2">Latitudine</Label>
                      <Input 
                        id="lat2" 
                        type="number" 
                        step="0.000001"
                        placeholder="Es. 41.9028" 
                        value={point2.lat || ''}
                        onChange={(e) => handlePoint2Change("lat", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lng2">Longitudine</Label>
                      <Input 
                        id="lng2" 
                        type="number" 
                        step="0.000001"
                        placeholder="Es. 12.4964" 
                        value={point2.lng || ''}
                        onChange={(e) => handlePoint2Change("lng", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Unità di misura</h3>
                  <RadioGroup 
                    value={unit} 
                    onValueChange={(value) => setUnit(value as "km" | "mi")}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="km" id="km" />
                      <Label htmlFor="km">Chilometri (km)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mi" id="mi" />
                      <Label htmlFor="mi">Miglia (mi)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button 
                  onClick={calculateDistance}
                  size="lg"
                  className="w-full md:w-auto"
                >
                  <Ruler className="mr-2 h-4 w-4" />
                  Calcola distanza
                </Button>
                
                {distance !== null && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">Risultato</h3>
                    <p className="text-2xl font-bold text-blue-900">
                      {distance.toFixed(2)} {unit}
                    </p>
                    <p className="text-sm text-blue-700 mt-2">
                      Distanza calcolata sulla superficie terrestre utilizzando la formula di Haversine.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-3">Istruzioni</h3>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  1
                </div>
                <span>Inserisci le coordinate del primo punto</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  2
                </div>
                <span>Inserisci le coordinate del secondo punto</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  3
                </div>
                <span>Seleziona l'unità di misura desiderata</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  4
                </div>
                <span>Clicca su "Calcola distanza" per ottenere il risultato</span>
              </li>
            </ol>
          </div>
          
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-3">Come ottenere le coordinate</h3>
            <p className="text-sm text-gray-700 mb-3">
              Puoi ottenere le coordinate di un luogo da:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2 items-start">
                <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                <span>Google Maps: fai clic con il tasto destro su un punto e seleziona "Che cosa c'è qui?"</span>
              </li>
              <li className="flex gap-2 items-start">
                <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                <span>Utilizza l'app coordinate GPS di questo sito</span>
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

export default CalcoloDistanza;
