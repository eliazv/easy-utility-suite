
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight, Percent } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CalcolaSconto = () => {
  // State for discount tab
  const [prezzo, setPrezzo] = useState<string>("");
  const [sconto, setSconto] = useState<string>("");
  const [risultati, setRisultati] = useState({
    importoSconto: 0,
    prezzoFinale: 0,
    risparmio: 0
  });
  
  // State for percentage calculator tab
  const [valore1, setValore1] = useState<string>("");
  const [valore2, setValore2] = useState<string>("");
  const [tipoCalcolo, setTipoCalcolo] = useState<string>("originale-percentuale");
  const [risultatoPercentuale, setRisultatoPercentuale] = useState<number | null>(null);
  
  const [error, setError] = useState("");

  // Calcola i risultati quando cambiano i valori per lo sconto
  useEffect(() => {
    if (prezzo && sconto) {
      calcolaSconto();
    }
  }, [prezzo, sconto]);

  // Calcola i risultati quando cambiano i valori per la percentuale
  useEffect(() => {
    if (valore1 && valore2) {
      calcolaPercentuale();
    }
  }, [valore1, valore2, tipoCalcolo]);

  const calcolaSconto = () => {
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
  
  const calcolaPercentuale = () => {
    const val1 = parseFloat(valore1);
    const val2 = parseFloat(valore2);
    
    if (isNaN(val1) || isNaN(val2)) {
      setError("Inserisci valori numerici validi");
      setRisultatoPercentuale(null);
      return;
    }
    
    setError("");
    
    switch (tipoCalcolo) {
      case "originale-percentuale": // Calcola il risultato
        setRisultatoPercentuale(val1 * (1 + (val2 / 100)));
        break;
      case "originale-risultato": // Calcola la percentuale
        setRisultatoPercentuale(((val2 - val1) / val1) * 100);
        break;
      case "percentuale-risultato": // Calcola l'originale
        setRisultatoPercentuale(val2 / (1 + (val1 / 100)));
        break;
    }
  };

  const handlePrezzoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrezzo(e.target.value);
    if (e.target.value && sconto) {
      calcolaSconto();
    }
  };

  const handleScontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSconto(e.target.value);
    if (prezzo && e.target.value) {
      calcolaSconto();
    }
  };
  
  const handleValore1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValore1(e.target.value);
  };
  
  const handleValore2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValore2(e.target.value);
  };
  
  const handleTipoCalcoloChange = (value: string) => {
    setTipoCalcolo(value);
    setValore1("");
    setValore2("");
    setRisultatoPercentuale(null);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };
  
  const getLabelsByType = () => {
    switch (tipoCalcolo) {
      case "originale-percentuale":
        return {
          valore1: "Valore originale",
          valore2: "Percentuale (%)",
          risultato: "Risultato finale"
        };
      case "originale-risultato":
        return {
          valore1: "Valore originale",
          valore2: "Risultato finale",
          risultato: "Percentuale (%)"
        };
      case "percentuale-risultato":
        return {
          valore1: "Percentuale (%)",
          valore2: "Risultato finale",
          risultato: "Valore originale"
        };
      default:
        return {
          valore1: "Valore 1",
          valore2: "Valore 2",
          risultato: "Risultato"
        };
    }
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Calcolatore Percentuale</h1>
        <p className="text-gray-600 mt-2">
          Calcola percentuali, sconti e variazioni percentuali tra numeri.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="percentuale" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="percentuale">Calcolatore Percentuale</TabsTrigger>
              <TabsTrigger value="sconto">Calcolatore Sconto</TabsTrigger>
            </TabsList>
            
            <TabsContent value="percentuale" className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-medium mb-4">Calcolatore Percentuale</h2>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="tipoCalcolo">Cosa vuoi calcolare?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                    <Button 
                      variant={tipoCalcolo === "originale-percentuale" ? "default" : "outline"}
                      className="w-full" 
                      onClick={() => handleTipoCalcoloChange("originale-percentuale")}
                    >
                      Valore Finale
                    </Button>
                    <Button 
                      variant={tipoCalcolo === "originale-risultato" ? "default" : "outline"}
                      className="w-full" 
                      onClick={() => handleTipoCalcoloChange("originale-risultato")}
                    >
                      Percentuale
                    </Button>
                    <Button 
                      variant={tipoCalcolo === "percentuale-risultato" ? "default" : "outline"}
                      className="w-full" 
                      onClick={() => handleTipoCalcoloChange("percentuale-risultato")}
                    >
                      Valore Originale
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="valore1">{getLabelsByType().valore1}</Label>
                    <Input
                      id="valore1"
                      type="number"
                      placeholder={`Es. ${tipoCalcolo.includes("percentuale") && tipoCalcolo !== "originale-percentuale" ? "10" : "100"}`}
                      value={valore1}
                      onChange={handleValore1Change}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="valore2">{getLabelsByType().valore2}</Label>
                    <Input
                      id="valore2"
                      type="number"
                      placeholder={`Es. ${tipoCalcolo.includes("percentuale") && tipoCalcolo !== "percentuale-risultato" ? "10" : "110"}`}
                      value={valore2}
                      onChange={handleValore2Change}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
                
                <Button
                  onClick={calcolaPercentuale}
                  disabled={!valore1 || !valore2}
                  className="w-full mt-2"
                >
                  <Calculator className="mr-2 h-5 w-5" /> Calcola
                </Button>
                
                <div className="bg-blue-50 p-6 rounded-lg mt-4">
                  <h3 className="text-lg font-medium mb-2">Risultato</h3>
                  <div>
                    <p className="text-gray-500 mb-1">{getLabelsByType().risultato}</p>
                    {risultatoPercentuale !== null ? (
                      <p className="text-2xl font-medium">
                        {tipoCalcolo === "originale-risultato" 
                          ? `${risultatoPercentuale.toFixed(2)}%` 
                          : formatCurrency(risultatoPercentuale)
                        }
                      </p>
                    ) : (
                      <p className="text-2xl font-medium">—</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sconto" className="bg-white rounded-lg border p-6">
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
                      onClick={calcolaSconto}
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
                        if (prezzo) calcolaSconto();
                      }}
                    >
                      {percentuale}%
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-4">Come funziona</h3>
            <Tabs defaultValue="percentuale" className="w-full">
              <TabsList className="grid grid-cols-2 mb-2">
                <TabsTrigger value="percentuale">Percentuale</TabsTrigger>
                <TabsTrigger value="sconto">Sconto</TabsTrigger>
              </TabsList>
              
              <TabsContent value="percentuale">
                <p className="text-sm text-gray-600 mb-4">
                  Il calcolatore di percentuale può calcolare:
                </p>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm mb-1">Valore finale:</p>
                    <p className="font-mono">Originale × (1 + Percentuale ÷ 100)</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm mb-1">Percentuale:</p>
                    <p className="font-mono">((Risultato − Originale) ÷ Originale) × 100</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm mb-1">Valore originale:</p>
                    <p className="font-mono">Risultato ÷ (1 + Percentuale ÷ 100)</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="sconto">
                <p className="text-sm text-gray-600 mb-4">
                  Il calcolatore di sconto utilizza la seguente formula:
                </p>
                <div className="bg-gray-50 p-3 rounded-md mb-3">
                  <p className="text-sm mb-1">Importo dello sconto:</p>
                  <p className="font-mono">Prezzo × (Percentuale ÷ 100)</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm mb-1">Prezzo finale:</p>
                  <p className="font-mono">Prezzo − Importo dello sconto</p>
                </div>
              </TabsContent>
            </Tabs>
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
