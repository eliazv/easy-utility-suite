
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight } from "lucide-react";

const CalcolaSconto = () => {
  const [prezzo, setPrezzo] = useState<string>("");
  const [sconto, setSconto] = useState<string>("");
  const [risultati, setRisultati] = useState({
    importoSconto: 0,
    prezzoFinale: 0,
    risparmio: 0
  });
  const [error, setError] = useState("");

  // Calcola i risultati quando cambiano i valori
  useEffect(() => {
    if (prezzo && sconto) {
      calcola();
    }
  }, [prezzo, sconto]);

  const calcola = () => {
    // Converti i valori in numeri
    const prezzoNum = parseFloat(prezzo);
    const scontoNum = parseFloat(sconto);

    // Validazione
    if (isNaN(prezzoNum) || isNaN(scontoNum)) {
      setError("Inserisci valori numerici validi");
      return;
    }

    if (prezzoNum <= 0) {
      setError("Il prezzo deve essere maggiore di 0");
      return;
    }

    if (scontoNum < 0 || scontoNum > 100) {
      setError("Lo sconto deve essere tra 0 e 100");
      return;
    }

    // Calcolo dei risultati
    const importoSconto = (prezzoNum * scontoNum) / 100;
    const prezzoFinale = prezzoNum - importoSconto;
    const risparmioPercentuale = (importoSconto / prezzoNum) * 100;

    setRisultati({
      importoSconto: importoSconto,
      prezzoFinale: prezzoFinale,
      risparmio: risparmioPercentuale
    });

    setError("");
  };

  const handlePrezzoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrezzo(e.target.value);
    if (e.target.value && sconto) {
      calcola();
    }
  };

  const handleScontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSconto(e.target.value);
    if (prezzo && e.target.value) {
      calcola();
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Calcolatore di sconto</h1>
        <p className="text-gray-600 mt-2">
          Calcola rapidamente l'importo dello sconto e il prezzo finale di un prodotto o servizio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-medium mb-4">Inserisci i dati</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prezzo">Prezzo originale (€)</Label>
                    <Input
                      id="prezzo"
                      type="number"
                      placeholder="Es. 100"
                      value={prezzo}
                      onChange={handlePrezzoChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sconto">Percentuale di sconto (%)</Label>
                    <Input
                      id="sconto"
                      type="number"
                      placeholder="Es. 20"
                      value={sconto}
                      onChange={handleScontoChange}
                      className="mt-1"
                      min="0"
                      max="100"
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                  <Button
                    onClick={calcola}
                    disabled={!prezzo || !sconto}
                    className="w-full mt-2"
                  >
                    <Calculator className="mr-2 h-5 w-5" /> Calcola sconto
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-medium mb-4">Risultati</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 mb-1">Prezzo originale</p>
                    <p className="text-2xl font-medium">
                      {prezzo ? formatCurrency(parseFloat(prezzo)) : "—"}
                    </p>
                  </div>
                  <div className="flex items-center my-2">
                    <ArrowRight className="text-gray-400 mx-auto" />
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Importo sconto ({sconto || 0}%)</p>
                    <p className="text-xl text-red-500 font-medium">
                      - {formatCurrency(risultati.importoSconto)}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-blue-100">
                    <p className="text-gray-500 mb-1">Prezzo finale</p>
                    <p className="text-2xl font-semibold text-green-600">
                      {formatCurrency(risultati.prezzoFinale)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Risparmio</p>
                    <p className="text-lg font-medium">
                      {formatCurrency(risultati.importoSconto)} ({sconto || 0}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-medium mb-2">Esempi di sconti comuni</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {[5, 10, 15, 20, 25, 30, 40, 50].map(percentuale => (
                  <Button
                    key={percentuale}
                    variant="outline"
                    onClick={() => {
                      setSconto(percentuale.toString());
                      if (prezzo) calcola();
                    }}
                  >
                    {percentuale}%
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-4">Come funziona</h3>
            <p className="text-sm text-gray-600 mb-4">
              Il calcolatore di sconto utilizza la seguente formula:
            </p>
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <p className="text-sm mb-1">Importo dello sconto:</p>
              <p className="font-mono">Prezzo × (Percentuale ÷ 100)</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm mb-1">Prezzo finale:</p>
              <p className="font-mono">Prezzo − Importo dello sconto</p>
            </div>
          </div>

          <div className="ad-placeholder h-80">
            Spazio pubblicitario
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalcolaSconto;
