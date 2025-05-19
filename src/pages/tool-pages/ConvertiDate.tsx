import { useState } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { format, parse, isValid } from "date-fns";
import { it } from "date-fns/locale";

const formatOptions = [
  { value: "dd/MM/yyyy", label: "DD/MM/YYYY", example: "31/12/2023" },
  { value: "yyyy-MM-dd", label: "YYYY-MM-DD", example: "2023-12-31" },
  { value: "MM/dd/yyyy", label: "MM/DD/YYYY", example: "12/31/2023" },
  { value: "d MMMM yyyy", label: "D Mese YYYY", example: "31 Dicembre 2023" },
  { value: "EEEE, d MMMM yyyy", label: "Giorno, D Mese YYYY", example: "Domenica, 31 Dicembre 2023" }
];

const ConvertiDate = () => {
  const { toast } = useToast();
  const [inputDate, setInputDate] = useState("");
  const [inputFormat, setInputFormat] = useState("dd/MM/yyyy");
  const [outputFormat, setOutputFormat] = useState("yyyy-MM-dd");
  const [convertedDate, setConvertedDate] = useState("");

  const handleConvert = () => {
    try {
      // Parse della data di input con il formato selezionato
      const parsedDate = parse(inputDate, inputFormat, new Date());
      
      if (!isValid(parsedDate)) {
        throw new Error("Data non valida per il formato selezionato");
      }
      
      // Formatta la data nel formato di output
      const result = format(parsedDate, outputFormat, { locale: it });
      setConvertedDate(result);
      
      toast({
        title: "Conversione completata",
        description: "La data è stata convertita con successo",
      });
    } catch (error) {
      toast({
        title: "Errore di conversione",
        description: "Verifica che la data inserita corrisponda al formato selezionato",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Convertitore di date</h1>
        <p className="text-gray-600 mt-2">
          Converti le date tra diversi formati. Utile per documenti, fogli di calcolo, 
          programmazione e altre applicazioni.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="mb-4">
                  <Label htmlFor="input-date">Data di input</Label>
                  <Input
                    id="input-date"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                    placeholder="Inserisci la data"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Esempio: {formatOptions.find(f => f.value === inputFormat)?.example}
                  </p>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="input-format">Formato di input</Label>
                  <select
                    id="input-format"
                    value={inputFormat}
                    onChange={(e) => setInputFormat(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    {formatOptions.map((format) => (
                      <option key={format.value} value={format.value}>
                        {format.label} ({format.example})
                      </option>
                    ))}
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
                  <Label htmlFor="output-date">Data convertita</Label>
                  <Input
                    id="output-date"
                    value={convertedDate}
                    readOnly
                    className="mt-1 bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Esempio: {formatOptions.find(f => f.value === outputFormat)?.example}
                  </p>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="output-format">Formato di output</Label>
                  <select
                    id="output-format"
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    {formatOptions.map((format) => (
                      <option key={format.value} value={format.value}>
                        {format.label} ({format.example})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button onClick={handleConvert} className="w-full">
                Converti Data
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6 mt-6">
            <h2 className="text-xl font-medium mb-4">Formati comuni di data</h2>
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
                  {formatOptions.map((format, index) => (
                    <tr key={index}>
                      <td className="p-2 border text-sm font-mono">{format.value}</td>
                      <td className="p-2 border text-sm">{format.label}</td>
                      <td className="p-2 border text-sm">{format.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-4">Istruzioni</h3>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  1
                </div>
                <span>Inserisci la data nel formato indicato</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  2
                </div>
                <span>Seleziona il formato di input della tua data</span>
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
                <span>Clicca su "Converti" e ottieni il risultato</span>
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
                  <Calendar className="h-3 w-3" />
                </div>
                <span>Convertire date tra formati internazionali</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700 mt-0.5">
                  <Calendar className="h-3 w-3" />
                </div>
                <span>Preparare dati per fogli di calcolo</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700 mt-0.5">
                  <Calendar className="h-3 w-3" />
                </div>
                <span>Formattare date per documenti e reportistica</span>
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

export default ConvertiDate;
