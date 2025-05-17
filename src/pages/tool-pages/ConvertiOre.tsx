
import { useState } from "react";
import { Clock, ArrowRight } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

type TimeFormat = "24h" | "12h" | "minutes" | "seconds";

const ConvertiOre = () => {
  const { toast } = useToast();
  const [inputTime, setInputTime] = useState("");
  const [inputFormat, setInputFormat] = useState<TimeFormat>("24h");
  const [outputFormat, setOutputFormat] = useState<TimeFormat>("12h");
  const [convertedTime, setConvertedTime] = useState("");

  const validateInput = (value: string, format: TimeFormat): boolean => {
    switch (format) {
      case "24h":
        // Formato HH:MM o HH:MM:SS
        return /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.test(value);
      case "12h":
        // Formato HH:MM AM/PM o HH:MM:SS AM/PM
        return /^(0?[1-9]|1[0-2]):([0-5]\d)(?::([0-5]\d))?\s?(AM|PM)$/i.test(value);
      case "minutes":
        // Solo numeri (minuti)
        return /^\d+$/.test(value);
      case "seconds":
        // Solo numeri (secondi)
        return /^\d+$/.test(value);
      default:
        return false;
    }
  };

  const parseTimeToMinutes = (value: string, format: TimeFormat): number => {
    try {
      switch (format) {
        case "24h": {
          const [hours, minutes] = value.split(":").map(Number);
          return hours * 60 + minutes;
        }
        case "12h": {
          const isPM = value.toLowerCase().includes("pm");
          const timeString = value.replace(/\s?[APap][Mm]/, "");
          const [hours, minutes] = timeString.split(":").map(Number);
          let adjustedHours = hours;
          
          if (isPM && hours !== 12) {
            adjustedHours = hours + 12;
          } else if (!isPM && hours === 12) {
            adjustedHours = 0;
          }
          
          return adjustedHours * 60 + minutes;
        }
        case "minutes":
          return parseInt(value, 10);
        case "seconds":
          return Math.floor(parseInt(value, 10) / 60);
        default:
          return 0;
      }
    } catch (error) {
      return 0;
    }
  };

  const formatMinutesToOutput = (totalMinutes: number, format: TimeFormat): string => {
    try {
      switch (format) {
        case "24h": {
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        }
        case "12h": {
          let hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          const period = hours >= 12 ? "PM" : "AM";
          
          if (hours > 12) {
            hours -= 12;
          } else if (hours === 0) {
            hours = 12;
          }
          
          return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
        }
        case "minutes":
          return `${totalMinutes}`;
        case "seconds":
          return `${totalMinutes * 60}`;
        default:
          return "";
      }
    } catch (error) {
      return "";
    }
  };

  const handleConvert = () => {
    if (!inputTime) {
      toast({
        title: "Errore",
        description: "Inserisci un valore",
        variant: "destructive",
      });
      return;
    }

    if (!validateInput(inputTime, inputFormat)) {
      toast({
        title: "Formato non valido",
        description: getFormatDescription(inputFormat),
        variant: "destructive",
      });
      return;
    }

    try {
      const timeInMinutes = parseTimeToMinutes(inputTime, inputFormat);
      const result = formatMinutesToOutput(timeInMinutes, outputFormat);
      setConvertedTime(result);
      
      toast({
        title: "Conversione completata",
        description: "Orario convertito con successo",
      });
    } catch (error) {
      toast({
        title: "Errore di conversione",
        description: "Verifica il formato dell'orario inserito",
        variant: "destructive",
      });
    }
  };

  const getFormatDescription = (format: TimeFormat): string => {
    switch (format) {
      case "24h":
        return "Usa il formato 24 ore (es. 14:30)";
      case "12h":
        return "Usa il formato 12 ore (es. 2:30 PM)";
      case "minutes":
        return "Inserisci il totale dei minuti (es. 870)";
      case "seconds":
        return "Inserisci il totale dei secondi (es. 52200)";
      default:
        return "";
    }
  };

  const getFormatExample = (format: TimeFormat): string => {
    switch (format) {
      case "24h":
        return "14:30";
      case "12h":
        return "2:30 PM";
      case "minutes":
        return "870";
      case "seconds":
        return "52200";
      default:
        return "";
    }
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Convertitore di Orari</h1>
        <p className="text-gray-600 mt-2">
          Converti facilmente gli orari tra diversi formati: formato 12 ore (AM/PM), 
          formato 24 ore, minuti totali o secondi totali.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="mb-4">
                  <Label htmlFor="input-time">Orario di input</Label>
                  <Input
                    id="input-time"
                    value={inputTime}
                    onChange={(e) => setInputTime(e.target.value)}
                    placeholder={getFormatExample(inputFormat)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {getFormatDescription(inputFormat)}
                  </p>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="input-format">Formato di input</Label>
                  <select
                    id="input-format"
                    value={inputFormat}
                    onChange={(e) => setInputFormat(e.target.value as TimeFormat)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    <option value="24h">Formato 24 ore (14:30)</option>
                    <option value="12h">Formato 12 ore (2:30 PM)</option>
                    <option value="minutes">Minuti totali (870)</option>
                    <option value="seconds">Secondi totali (52200)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <Button 
                  onClick={handleConvert}
                  className="h-12 w-12 rounded-full"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="md:col-span-1">
                <div className="mb-4">
                  <Label htmlFor="output-time">Orario convertito</Label>
                  <Input
                    id="output-time"
                    value={convertedTime}
                    readOnly
                    className="mt-1 bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {getFormatDescription(outputFormat)}
                  </p>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="output-format">Formato di output</Label>
                  <select
                    id="output-format"
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as TimeFormat)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    <option value="24h">Formato 24 ore</option>
                    <option value="12h">Formato 12 ore (AM/PM)</option>
                    <option value="minutes">Minuti totali</option>
                    <option value="seconds">Secondi totali</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button onClick={handleConvert} className="w-full">
                Converti Orario
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6 mt-6">
            <h2 className="text-xl font-medium mb-4">Formati di orario supportati</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 text-left border text-sm">Formato</th>
                    <th className="p-2 text-left border text-sm">Descrizione</th>
                    <th className="p-2 text-left border text-sm">Esempio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border text-sm">Formato 24 ore</td>
                    <td className="p-2 border text-sm">Orario nel formato 24 ore (HH:MM)</td>
                    <td className="p-2 border text-sm font-mono">14:30, 08:45</td>
                  </tr>
                  <tr>
                    <td className="p-2 border text-sm">Formato 12 ore</td>
                    <td className="p-2 border text-sm">Orario nel formato 12 ore con AM/PM</td>
                    <td className="p-2 border text-sm font-mono">2:30 PM, 8:45 AM</td>
                  </tr>
                  <tr>
                    <td className="p-2 border text-sm">Minuti totali</td>
                    <td className="p-2 border text-sm">Orario espresso in minuti totali</td>
                    <td className="p-2 border text-sm font-mono">870 (= 14:30)</td>
                  </tr>
                  <tr>
                    <td className="p-2 border text-sm">Secondi totali</td>
                    <td className="p-2 border text-sm">Orario espresso in secondi totali</td>
                    <td className="p-2 border text-sm font-mono">52200 (= 14:30)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-4">Come funziona</h3>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  1
                </div>
                <span>Inserisci l'orario nel formato selezionato</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  2
                </div>
                <span>Scegli il formato di input dell'orario</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  3
                </div>
                <span>Seleziona il formato di output desiderato</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  4
                </div>
                <span>Clicca su "Converti" per ottenere il risultato</span>
              </li>
            </ol>
          </div>
          
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-3">A cosa serve?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Questo strumento è utile per:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700 mt-0.5">
                  <Clock className="h-3 w-3" />
                </div>
                <span>Convertire tra formati 12h e 24h</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700 mt-0.5">
                  <Clock className="h-3 w-3" />
                </div>
                <span>Calcolare minuti o secondi totali</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700 mt-0.5">
                  <Clock className="h-3 w-3" />
                </div>
                <span>Preparare dati per fogli di calcolo</span>
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

export default ConvertiOre;
