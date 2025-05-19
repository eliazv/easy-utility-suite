
import { useState, useEffect } from "react";
import { MapPin, Copy, CheckCircle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CoordinateGPS = () => {
  const { toast } = useToast();
  const [position, setPosition] = useState<{
    lat: number | null;
    lng: number | null;
    accuracy: number | null;
    altitude: number | null;
    altitudeAccuracy: number | null;
    timestamp: number | null;
    heading: number | null;
    speed: number | null;
  }>({
    lat: null,
    lng: null,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    timestamp: null,
    heading: null,
    speed: null
  });
  const [watchId, setWatchId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingPosition, setLoadingPosition] = useState(false);
  const [ddCoords, setDdCoords] = useState({ lat: "", lng: "" });
  const [dmsCoords, setDmsCoords] = useState({ lat: "", lng: "" });
  
  // Check if geolocation is available in the browser
  const geoAvailable = 'geolocation' in navigator;

  const getPosition = () => {
    if (!geoAvailable) {
      setError("La geolocalizzazione non è supportata dal tuo browser.");
      return;
    }

    setLoadingPosition(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = pos.coords;
        setPosition({
          lat: latitude,
          lng: longitude,
          accuracy,
          altitude,
          altitudeAccuracy,
          timestamp: pos.timestamp,
          heading,
          speed
        });
        setLoadingPosition(false);
        
        // Convert to DMS format
        const latDMS = convertToDMS(latitude, true);
        const lngDMS = convertToDMS(longitude, false);
        setDmsCoords({
          lat: latDMS,
          lng: lngDMS
        });
      },
      (err) => {
        setLoadingPosition(false);
        switch (err.code) {
          case 1:
            setError("Permesso negato per l'accesso alla posizione.");
            break;
          case 2:
            setError("Posizione non disponibile.");
            break;
          case 3:
            setError("Timeout nella richiesta di posizione.");
            break;
          default:
            setError("Errore sconosciuto nella geolocalizzazione.");
        }
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  };

  const startWatchingPosition = () => {
    if (!geoAvailable) return;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = pos.coords;
        setPosition({
          lat: latitude,
          lng: longitude,
          accuracy,
          altitude,
          altitudeAccuracy,
          timestamp: pos.timestamp,
          heading,
          speed
        });
        
        // Convert to DMS format
        const latDMS = convertToDMS(latitude, true);
        const lngDMS = convertToDMS(longitude, false);
        setDmsCoords({
          lat: latDMS,
          lng: lngDMS
        });
      },
      (err) => {
        setError(`Errore: ${err.message}`);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 5000, 
        maximumAge: 0 
      }
    );
    
    setWatchId(id);
  };

  const stopWatchingPosition = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  // Convert decimal degrees to DMS format
  const convertToDMS = (coordinate: number, isLatitude: boolean) => {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.round((minutesNotTruncated - minutes) * 60 * 100) / 100;
    
    const direction = isLatitude
      ? coordinate >= 0 ? "N" : "S"
      : coordinate >= 0 ? "E" : "O";
    
    return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
  };

  // Convert DMS to decimal degrees
  const convertDMStoDD = (dms: string, isLatitude: boolean): number | null => {
    // Example input: "40° 26' 46.3" N"
    const regex = /(\d+)° (\d+)' ([\d.]+)" ([NSEO])/;
    const match = dms.match(regex);
    
    if (!match) return null;
    
    const degrees = parseFloat(match[1]);
    const minutes = parseFloat(match[2]);
    const seconds = parseFloat(match[3]);
    const direction = match[4];
    
    let dd = degrees + (minutes/60) + (seconds/3600);
    
    if ((isLatitude && direction === "S") || (!isLatitude && direction === "O")) {
      dd *= -1;
    }
    
    return dd;
  };

  // Handle DMS to DD conversion
  const handleDMStoDD = () => {
    const latDD = convertDMStoDD(dmsCoords.lat, true);
    const lngDD = convertDMStoDD(dmsCoords.lng, false);
    
    if (latDD === null || lngDD === null) {
      toast({
        title: "Errore di conversione",
        description: "Formato DMS non valido. Esempio corretto: 40° 26' 46.3\" N",
        variant: "destructive"
      });
      return;
    }
    
    setDdCoords({
      lat: latDD.toFixed(6),
      lng: lngDD.toFixed(6)
    });
    
    toast({
      title: "Conversione completata",
      description: "Coordinate convertite con successo."
    });
  };

  // Handle DD to DMS conversion
  const handleDDtoDMS = () => {
    const lat = parseFloat(ddCoords.lat);
    const lng = parseFloat(ddCoords.lng);
    
    if (isNaN(lat) || isNaN(lng)) {
      toast({
        title: "Errore di conversione",
        description: "Inserisci valori numerici validi per latitudine e longitudine",
        variant: "destructive"
      });
      return;
    }
    
    const latDMS = convertToDMS(lat, true);
    const lngDMS = convertToDMS(lng, false);
    
    setDmsCoords({
      lat: latDMS,
      lng: lngDMS
    });
    
    toast({
      title: "Conversione completata",
      description: "Coordinate convertite con successo."
    });
  };

  // Copy coordinates to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiato negli appunti",
        description: "Il testo è stato copiato negli appunti."
      });
    });
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const getMapLink = () => {
    if (!position.lat || !position.lng) return "#";
    return `https://www.google.com/maps/search/?api=1&query=${position.lat},${position.lng}`;
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Coordinate GPS</h1>
        <p className="text-gray-600 mt-2">
          Ottieni le tue coordinate GPS attuali e converti tra diversi formati di coordinate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
              <h2 className="text-xl font-medium">La tua posizione attuale</h2>
              <div className="flex gap-2">
                {watchId === null ? (
                  <Button onClick={getPosition} disabled={loadingPosition} variant="outline">
                    {loadingPosition ? "Ricerca..." : "Aggiorna posizione"}
                  </Button>
                ) : (
                  <>
                    <Button variant="secondary" onClick={getPosition}>
                      Aggiorna
                    </Button>
                    <Button variant="destructive" onClick={stopWatchingPosition}>
                      Stop
                    </Button>
                  </>
                )}
                <Button onClick={startWatchingPosition} disabled={watchId !== null}>
                  Traccia
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Errore</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!geoAvailable && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Non supportato</AlertTitle>
                <AlertDescription>Il tuo browser non supporta la geolocalizzazione.</AlertDescription>
              </Alert>
            )}

            {position.lat !== null && position.lng !== null && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-500 mb-1">Coordinate Decimali (DD)</div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-medium">
                        {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => copyToClipboard(`${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-500 mb-1">Coordinate DMS</div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-medium truncate max-w-[80%]">
                        {dmsCoords.lat}, {dmsCoords.lng}
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => copyToClipboard(`${dmsCoords.lat}, ${dmsCoords.lng}`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-3 border rounded-md">
                    <div className="text-xs text-gray-500 mb-1">Precisione</div>
                    <div className="font-medium">{position.accuracy ? `±${position.accuracy.toFixed(1)}m` : "N/A"}</div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="text-xs text-gray-500 mb-1">Altitudine</div>
                    <div className="font-medium">{position.altitude ? `${position.altitude.toFixed(1)}m` : "N/A"}</div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="text-xs text-gray-500 mb-1">Velocità</div>
                    <div className="font-medium">{position.speed ? `${(position.speed * 3.6).toFixed(1)} km/h` : "N/A"}</div>
                  </div>
                </div>

                <div className="text-center">
                  <a 
                    href={getMapLink()}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                  >
                    <MapPin className="h-4 w-4" />
                    Apri in Google Maps
                  </a>
                </div>
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Converti coordinate</h3>
              
              <Tabs defaultValue="dd-to-dms" className="w-full">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="dd-to-dms">DD → DMS</TabsTrigger>
                  <TabsTrigger value="dms-to-dd">DMS → DD</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dd-to-dms" className="p-4 border rounded-md mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="dd-lat">Latitudine (DD)</Label>
                      <Input
                        id="dd-lat"
                        value={ddCoords.lat}
                        onChange={(e) => setDdCoords({...ddCoords, lat: e.target.value})}
                        placeholder="Es. 45.4612"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dd-lng">Longitudine (DD)</Label>
                      <Input
                        id="dd-lng"
                        value={ddCoords.lng}
                        onChange={(e) => setDdCoords({...ddCoords, lng: e.target.value})}
                        placeholder="Es. 9.1897"
                      />
                    </div>
                  </div>
                  <Button onClick={handleDDtoDMS}>Converti in DMS</Button>
                </TabsContent>
                
                <TabsContent value="dms-to-dd" className="p-4 border rounded-md mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="dms-lat">Latitudine (DMS)</Label>
                      <Input
                        id="dms-lat"
                        value={dmsCoords.lat}
                        onChange={(e) => setDmsCoords({...dmsCoords, lat: e.target.value})}
                        placeholder='Es. 45° 27\' 40.3" N'
                      />
                    </div>
                    <div>
                      <Label htmlFor="dms-lng">Longitudine (DMS)</Label>
                      <Input
                        id="dms-lng"
                        value={dmsCoords.lng}
                        onChange={(e) => setDmsCoords({...dmsCoords, lng: e.target.value})}
                        placeholder='Es. 9° 11\' 23.1" E'
                      />
                    </div>
                  </div>
                  <Button onClick={handleDMStoDD}>Converti in DD</Button>
                </TabsContent>
              </Tabs>
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
                <span>Clicca su "Aggiorna posizione" per rilevare la tua posizione attuale</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  2
                </div>
                <span>Usa "Traccia" per monitorare la posizione in tempo reale</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  3
                </div>
                <span>Clicca sull'icona per copiare le coordinate negli appunti</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  4
                </div>
                <span>Utilizza lo strumento di conversione per cambiare formato</span>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-3">Formati di coordinate</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>
                <div className="font-medium mb-1">Decimali (DD)</div>
                <div className="text-gray-600">Es. 45.4612, 9.1897</div>
              </li>
              <li>
                <div className="font-medium mb-1">Gradi, Minuti, Secondi (DMS)</div>
                <div className="text-gray-600">Es. 45° 27' 40.3" N, 9° 11' 23.1" E</div>
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

export default CoordinateGPS;
