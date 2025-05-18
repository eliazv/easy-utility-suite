
import { useState, useEffect } from "react";
import { Dice6, Copy, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";

const GeneratoreNumeri = () => {
  // Simple random number
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [result, setResult] = useState<number | null>(null);
  
  // Multiple numbers
  const [quantity, setQuantity] = useState<number>(6);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(false);
  const [multipleResults, setMultipleResults] = useState<number[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  
  // Dice roll
  const [diceQuantity, setDiceQuantity] = useState<number>(2);
  const [diceType, setDiceType] = useState<number>(6);
  const [diceResults, setDiceResults] = useState<number[]>([]);
  
  // Recent generations
  const [recentGenerations, setRecentGenerations] = useState<string[]>([]);

  // Generate a single random number
  const generateRandomNumber = () => {
    if (min > max) {
      toast.error("Il valore minimo non può essere maggiore del massimo");
      return;
    }
    
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    setResult(randomNum);
    addToRecent(`Numero: ${randomNum} (da ${min} a ${max})`);
  };
  
  // Generate multiple random numbers
  const generateMultipleNumbers = () => {
    if (min > max) {
      toast.error("Il valore minimo non può essere maggiore del massimo");
      return;
    }
    
    if (!allowDuplicates && (max - min + 1) < quantity) {
      toast.error("Non ci sono abbastanza numeri nell'intervallo per generare senza duplicati");
      return;
    }
    
    const results: number[] = [];
    
    if (allowDuplicates) {
      for (let i = 0; i < quantity; i++) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        results.push(randomNum);
      }
    } else {
      // Fisher-Yates shuffle for non-duplicates
      const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      results.push(...pool.slice(0, quantity));
    }
    
    setMultipleResults(results);
    addToRecent(`Serie: ${results.join(', ')} (da ${min} a ${max})`);
  };
  
  // Roll dice
  const rollDice = () => {
    const results: number[] = [];
    for (let i = 0; i < diceQuantity; i++) {
      const roll = Math.floor(Math.random() * diceType) + 1;
      results.push(roll);
    }
    setDiceResults(results);
    addToRecent(`Dadi: ${results.join(', ')} (${diceQuantity}d${diceType})`);
  };
  
  // Add to recent generations
  const addToRecent = (text: string) => {
    setRecentGenerations(prev => [text, ...prev.slice(0, 9)]);
  };
  
  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copiato negli appunti!");
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Initialize with a random number
  useEffect(() => {
    generateRandomNumber();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Generatore Numeri Casuali</h1>
        <p className="text-gray-600 mb-6">
          Genera numeri casuali in diversi formati: singolo numero, estrazioni multiple o lanci di dadi.
        </p>
        
        <Tabs defaultValue="single">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="single">Numero Singolo</TabsTrigger>
            <TabsTrigger value="multiple">Numeri Multipli</TabsTrigger>
            <TabsTrigger value="dice">Dadi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single">
            <Card>
              <CardHeader>
                <CardTitle>Genera un numero casuale</CardTitle>
                <CardDescription>
                  Imposta l'intervallo e genera un numero casuale all'interno di esso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="min">Valore minimo</Label>
                    <Input
                      id="min"
                      type="number"
                      value={min}
                      onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max">Valore massimo</Label>
                    <Input
                      id="max"
                      type="number"
                      value={max}
                      onChange={(e) => setMax(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={generateRandomNumber}
                >
                  <Dice6 className="mr-2 h-5 w-5" />
                  Genera Numero Casuale
                </Button>
                
                {result !== null && (
                  <div className="mt-8">
                    <div className="text-center">
                      <h3 className="text-sm text-gray-500 mb-1">Risultato</h3>
                      <div className="text-6xl font-bold mb-4">{result}</div>
                      <div className="text-gray-500 text-sm">
                        Numero casuale tra {min} e {max}
                      </div>
                      
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => copyToClipboard(result.toString())}
                      >
                        {copied ? (
                          <Check className="mr-2 h-4 w-4" />
                        ) : (
                          <Copy className="mr-2 h-4 w-4" />
                        )}
                        Copia
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="multiple">
            <Card>
              <CardHeader>
                <CardTitle>Genera multipli numeri casuali</CardTitle>
                <CardDescription>
                  Genera una serie di numeri casuali all'interno dell'intervallo specificato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="multiple-min">Valore minimo</Label>
                    <Input
                      id="multiple-min"
                      type="number"
                      value={min}
                      onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="multiple-max">Valore massimo</Label>
                    <Input
                      id="multiple-max"
                      type="number"
                      value={max}
                      onChange={(e) => setMax(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <Label htmlFor="quantity" className="mb-2 block">
                    Quantità: {quantity}
                  </Label>
                  <Slider
                    id="quantity"
                    min={1}
                    max={100}
                    step={1}
                    value={[quantity]}
                    onValueChange={(value) => setQuantity(value[0])}
                  />
                </div>
                
                <div className="flex items-center space-x-2 mb-6">
                  <Switch
                    id="allow-duplicates"
                    checked={allowDuplicates}
                    onCheckedChange={setAllowDuplicates}
                  />
                  <Label htmlFor="allow-duplicates">Consenti duplicati</Label>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={generateMultipleNumbers}
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Genera Numeri
                </Button>
                
                {multipleResults.length > 0 && (
                  <div className="mt-8">
                    <div className="text-center">
                      <h3 className="text-sm text-gray-500 mb-3">Risultati</h3>
                      <div className="bg-gray-50 p-4 rounded-lg mb-4 max-h-40 overflow-y-auto">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {multipleResults.map((num, index) => (
                            <div key={index} className="bg-white px-3 py-2 rounded-lg border shadow-sm">
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => copyToClipboard(multipleResults.join(", "))}
                      >
                        {copied ? (
                          <Check className="mr-2 h-4 w-4" />
                        ) : (
                          <Copy className="mr-2 h-4 w-4" />
                        )}
                        Copia tutti i numeri
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="dice">
            <Card>
              <CardHeader>
                <CardTitle>Lancia i dadi</CardTitle>
                <CardDescription>
                  Simula il lancio di dadi di vari tipi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Label htmlFor="dice-quantity" className="mb-2 block">
                    Numero di dadi: {diceQuantity}
                  </Label>
                  <Slider
                    id="dice-quantity"
                    min={1}
                    max={10}
                    step={1}
                    value={[diceQuantity]}
                    onValueChange={(value) => setDiceQuantity(value[0])}
                  />
                </div>
                
                <div className="mb-6">
                  <Label htmlFor="dice-type">Tipo di dado</Label>
                  <div className="mt-2 grid grid-cols-6 gap-2">
                    {[4, 6, 8, 10, 12, 20].map((sides) => (
                      <Button
                        key={sides}
                        variant={diceType === sides ? "default" : "outline"}
                        className="py-2 px-1"
                        onClick={() => setDiceType(sides)}
                      >
                        D{sides}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={rollDice}
                >
                  <Dice6 className="mr-2 h-5 w-5" />
                  Lancia Dadi
                </Button>
                
                {diceResults.length > 0 && (
                  <div className="mt-8">
                    <div className="text-center">
                      <h3 className="text-sm text-gray-500 mb-3">Risultati del lancio</h3>
                      
                      <div className="flex flex-wrap gap-4 justify-center mb-4">
                        {diceResults.map((result, index) => (
                          <div 
                            key={index} 
                            className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-2xl font-bold shadow-md border-2 border-gray-300"
                          >
                            {result}
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-lg font-bold mb-2">
                        Totale: {diceResults.reduce((sum, val) => sum + val, 0)}
                      </div>
                      
                      <div className="text-gray-500 text-sm mb-4">
                        {diceQuantity}d{diceType}
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={rollDice}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Rilancia
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {recentGenerations.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Generazioni recenti</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recentGenerations.map((gen, index) => (
                  <li key={index} className="text-sm text-gray-600 flex justify-between items-center">
                    <span>{gen}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(gen.split(":")[1].trim())}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default GeneratoreNumeri;
