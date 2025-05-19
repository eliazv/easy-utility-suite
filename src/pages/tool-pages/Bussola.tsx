
import { useState, useEffect } from "react";
import { Compass } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

const Bussola = () => {
  const { toast } = useToast();
  const [heading, setHeading] = useState<number | null>(null);
  const [permission, setPermission] = useState<PermissionState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{lat: number | null, lng: number | null}>({ lat: null, lng: null });
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    // Check if device orientation is supported
    if (window.DeviceOrientationEvent) {
      navigator.permissions.query({ name: 'accelerometer' as any })
        .then((result) => {
          setPermission(result.state);
          
          if (result.state === 'granted') {
            startCompass();
          }
        })
        .catch(() => {
          // Safari and some browsers don't support the permissions API for sensors
          try {
            startCompass();
          } catch (error) {
            setErrorMessage("Non è stato possibile accedere al sensore di orientamento.");
          }
        });
    } else {
      setErrorMessage("Il tuo dispositivo non supporta la bussola.");
    }
    
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setErrorMessage("Non è stato possibile determinare la tua posizione.");
        }
      );
    }
    
    return () => {
      if (isWatching) {
        window.removeEventListener("deviceorientation", handleOrientationChange);
      }
    };
  }, []);

  const startCompass = () => {
    window.addEventListener("deviceorientation", handleOrientationChange);
    setIsWatching(true);
  };

  const handleOrientationChange = (event: DeviceOrientationEvent) => {
    // Alpha is the compass direction (in degrees)
    if (event.alpha !== null) {
      setHeading(Math.round(event.alpha));
    }
  };

  const requestPermission = () => {
    // For iOS 13+ devices
    if ((DeviceOrientationEvent as any).requestPermission) {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: PermissionState) => {
          if (permissionState === 'granted') {
            startCompass();
            setPermission('granted');
            toast({
              title: "Permesso concesso",
              description: "Ora puoi usare la bussola"
            });
          } else {
            setErrorMessage("Permesso negato per l'accesso alla bussola.");
          }
        })
        .catch((error: Error) => {
          setErrorMessage(`Errore nell'accesso ai sensori: ${error.message}`);
        });
    } else {
      // For other browsers
      startCompass();
    }
  };

  const getDirectionName = (heading: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Bussola</h1>
        <p className="text-gray-600 mt-2">
          Usa il sensore del tuo dispositivo per ottenere indicazioni direzionali.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6 text-center">
            {errorMessage && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Errore</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {permission !== 'granted' && !errorMessage && (
              <div className="mb-6">
                <p className="mb-4">Per utilizzare la bussola è necessario concedere l'accesso ai sensori del dispositivo.</p>
                <button
                  onClick={requestPermission}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md"
                >
                  Attiva Bussola
                </button>
              </div>
            )}

            {heading !== null && (
              <div className="relative">
                <div className="inline-block">
                  <div className="relative h-64 w-64 md:h-80 md:w-80 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-300 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Compass 
                          className="h-52 w-52 md:h-64 md:w-64 text-primary"
                          style={{ transform: `rotate(${heading}deg)` }}
                        />
                      </div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-lg font-bold">N</div>
                      <div className="absolute right-0 top-1/2 translate-x-1 -translate-y-1/2 text-lg font-bold">E</div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-lg font-bold">S</div>
                      <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 text-lg font-bold">O</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <div className="text-4xl font-bold">{heading}° {getDirectionName(heading)}</div>
                </div>
              </div>
            )}
          </div>

          {coordinates.lat && coordinates.lng && (
            <div className="bg-white rounded-lg border p-6 mt-6">
              <h2 className="text-xl font-medium mb-4">Le tue coordinate</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <div className="text-sm text-gray-500 mb-1">Latitudine</div>
                  <div className="text-xl font-medium">{coordinates.lat.toFixed(6)}</div>
                </div>
                <div className="p-4 border rounded-md">
                  <div className="text-sm text-gray-500 mb-1">Longitudine</div>
                  <div className="text-xl font-medium">{coordinates.lng.toFixed(6)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-3">Istruzioni</h3>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  1
                </div>
                <span>Concedi i permessi di accesso ai sensori quando richiesto</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  2
                </div>
                <span>Tieni il tuo dispositivo in posizione piatta e orizzontale</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  3
                </div>
                <span>Ruota il dispositivo per calibrare la bussola</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  4
                </div>
                <span>Leggi la direzione in gradi e il punto cardinale</span>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-3">Note</h3>
            <p className="text-sm text-gray-600 mb-3">
              La precisione della bussola può variare in base al dispositivo e ai materiali circostanti.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700 mt-0.5">
                  <Compass className="h-3 w-3" />
                </div>
                <span>Oggetti metallici possono interferire con il funzionamento</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700 mt-0.5">
                  <Compass className="h-3 w-3" />
                </div>
                <span>Potrebbe essere necessario calibrare il sensore</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700 mt-0.5">
                  <Compass className="h-3 w-3" />
                </div>
                <span>All'interno di edifici la precisione è ridotta</span>
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

export default Bussola;
