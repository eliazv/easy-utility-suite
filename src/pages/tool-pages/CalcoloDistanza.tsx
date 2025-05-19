
import { useState } from "react";
import { MapPin, ArrowRight, Ruler } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CalcoloDistanza = () => {
  const { toast } = useToast();
  const [puntoA, setPuntoA] = useState({ lat: "", lng: "" });
  const [puntoB, setPuntoB] = useState({ lat: "", lng: "" });
  const [distanza, setDistanza] = useState<{
    km: number | null;
    miles: number | null;
    nauticMiles: number | null;
  }>({
    km: null,
    miles: null,
    nauticMiles: null
  });
  const [method, setMethod] = useState("haversine");
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get user's current location
  const getUserLocation = (point: "A" | "B") => {
    if (!navigator.geolocation) {
      toast({
        title: "Errore",
        description: "La geolocalizzazione non è supportata dal tuo browser.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Ricerca posizione",
      description: "Stiamo rilevando la tua posizione attuale..."
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        if (point === "A") {
          setPuntoA({
            lat: latitude.toString(),
            lng: longitude.toString()
          });
        } else {
          setPuntoB({
            lat: latitude.toString(),
            lng: longitude.toString()
          });
        }

        toast({
          title: "Posizione rilevata",
          description: `Le coordinate sono state inserite nel punto ${point}.`
        });
      },
      (err) => {
        toast({
          title: "Errore",
          description: `Impossibile rilevare la posizione: ${err.message}`,
          variant: "destructive"
        });
      }
    );
  };

  // Convert degrees to radians
  const toRadians = (degrees: number) => {
    return degrees * (Math.PI / 180);
  };

  // Haversine formula to calculate the distance between two points on Earth
  const calculateHaversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;

    return distanceKm;
  };

  // Spherical Law of Cosines formula to calculate distance
  const calculateCosineLawDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Earth's radius in kilometers
    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaLamba = toRadians(lon2 - lon1);

    const distance = 
      Math.acos(
        Math.sin(phi1) * Math.sin(phi2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.cos(deltaLamba)
      ) * R;

    return distance;
  };

  const calculateDistance = () => {
    try {
      setError(null);
      
      // Validate inputs
      const lat1 = parseFloat(puntoA.lat);
      const lon1 = parseFloat(puntoA.lng);
      const lat2 = parseFloat(puntoB.lat);
      const lon2 = parseFloat(puntoB.lng);

      if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
        setError("Inserisci coordinate valide per entrambi i punti");
        return;
      }

      if (lat1 < -90 || lat1 > 90 || lat2 < -90 || lat2 > 90) {
        setError("La latitudine deve essere tra -90 e 90 gradi");
        return;
      }

      if (lon1 < -180 || lon1 > 180 || lon2 < -180 || lon2 > 180) {
        setError("La longitudine deve essere tra -180 e 180 gradi");
        return;
      }

      // Calculate the distance using the selected method
      let distanceKm;
      if (method === "haversine") {
        distanceKm = calculateHaversineDistance(lat1, lon1, lat2, lon2);
      } else {
        distanceKm = calculateCosineLawDistance(lat1, lon1, lat2, lon2);
      }

      // Convert to miles and nautical miles
      const distanceMiles = distanceKm * 0.621371;
      const distanceNauticalMiles = distanceKm * 0.539957;

      setDistanza({
        km: distanceKm,
        miles: distanceMiles,
        nauticMiles: distanceNauticalMiles
      });

      toast({
        title: "Calcolo completato",
        description: `La distanza è di circa ${distanceKm.toFixed(2)} km.`
      });
    } catch (err) {
      setError("Si è verificato un errore durante il calcolo della distanza.");
    }
  };

  const getGoogleMapsUrl = () => {
    if (!puntoA.lat || !puntoA.lng || !puntoB.lat || !puntoB.lng) return "#";
    
    return `https://www.google.com/maps/dir/${puntoA.lat},${puntoA.lng}/${puntoB.lat},${puntoB.lng}`;
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Calcolo Distanza</h1>
        <p className="text-gray-600 mt-2">
          Calcola la distanza tra due punti sulla Terra utilizzando le coordinate GPS.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="mb-6">
              <Label htmlFor="method-select">Metodo di calcolo</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger id="method-select" className="w-full sm:w-60 mt-1">
                  <SelectValue placeholder="Seleziona metodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="haversine">Formula di Haversine</SelectItem>
                  <SelectItem value="cosine">Legge sferica dei coseni</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                La formula di Haversine è più precisa per distanze brevi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Punto A</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => getUserLocation("A")}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Usa posizione attuale
                  </Button>
                </div>
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor="latA">Latitudine</Label>
                    <Input 
                      id="latA" 
                      placeholder="Es. 45.4642" 
                      value={puntoA.lat}
                      onChange={(e) => setPuntoA({...puntoA, lat: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lngA">Longitudine</Label>
                    <Input 
                      id="lngA" 
                      placeholder="Es. 9.1900" 
                      value={puntoA.lng}
                      onChange={(e) => setPuntoA({...puntoA, lng: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="border p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Punto B</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => getUserLocation("B")}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Usa posizione attuale
                  </Button>
                </div>
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor="latB">Latitudine</Label>
                    <Input 
                      id="latB" 
                      placeholder="Es. 41.9028" 
                      value={puntoB.lat}
                      onChange={(e) => setPuntoB({...puntoB, lat: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lngB">Longitudine</Label>
                    <Input 
                      id="lngB" 
                      placeholder="Es. 12.4964" 
                      value={puntoB.lng}
                      onChange={(e) => setPuntoB({...puntoB, lng: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <Button 
                onClick={calculateDistance} 
                className="px-8"
                size="lg"
              >
                <Ruler className="h-4 w-4 mr-2" />
                Calcola Distanza
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Errore</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {distanza.km !== null && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Chilometri</div>
                  <div className="text-2xl font-bold text-primary mt-1">
                    {distanza.km.toFixed(2)} km
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Miglia</div>
                  <div className="text-2xl font-bold text-primary mt-1">
                    {distanza.miles!.toFixed(2)} mi
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Miglia Nautiche</div>
                  <div className="text-2xl font-bold text-primary mt-1">
                    {distanza.nauticMiles!.toFixed(2)} NM
                  </div>
                </div>
              </div>
            )}

            {distanza.km !== null && (
              <div className="mt-6 text-center">
                <a 
                  href={getGoogleMapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  <MapPin className="h-4 w-4" />
                  Visualizza percorso su Google Maps
                </a>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border p-6 mt-6">
            <h2 className="text-xl font-medium mb-4">Informazioni sui metodi di calcolo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Formula di Haversine</h3>
                <p className="text-sm text-gray-600">
                  La formula di Haversine calcola la distanza tra due punti sulla superficie terrestre tenendo conto della curvatura della Terra. È particolarmente accurata per distanze brevi e medie.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Legge sferica dei coseni</h3>
                <p className="text-sm text-gray-600">
                  Questo metodo utilizza la trigonometria sferica per calcolare la distanza più breve tra due punti sulla superficie terrestre. Utile per calcolare distanze molto grandi.
                </p>
              </div>
            </div>
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
                <span>Inserisci le coordinate del primo punto (Punto A)</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  2
                </div>
                <span>Inserisci le coordinate del secondo punto (Punto B)</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  3
                </div>
                <span>Seleziona il metodo di calcolo preferito</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  4
                </div>
                <span>Clicca su "Calcola Distanza" per ottenere il risultato</span>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-3">Come ottenere le coordinate</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700 mt-0.5">
                  <MapPin className="h-3 w-3" />
                </div>
                <span>Usa il pulsante "Usa posizione attuale" per rilevare la tua posizione</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700 mt-0.5">
                  <MapPin className="h-3 w-3" />
                </div>
                <span>Cerca un luogo su Google Maps, fai clic destro e seleziona "Cosa c'è qui?" per vedere le coordinate</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700 mt-0.5">
                  <MapPin className="h-3 w-3" />
                </div>
                <span>Utilizza il nostro strumento "Coordinate GPS" per ottenere la tua posizione attuale</span>
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
