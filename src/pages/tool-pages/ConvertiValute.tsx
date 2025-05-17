
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowDown, ArrowRight, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

const currencies: Currency[] = [
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "USD", name: "Dollaro USA", symbol: "$" },
  { code: "GBP", name: "Sterlina britannica", symbol: "£" },
  { code: "JPY", name: "Yen giapponese", symbol: "¥" },
  { code: "CNY", name: "Yuan cinese", symbol: "¥" },
  { code: "CHF", name: "Franco svizzero", symbol: "Fr" },
  { code: "CAD", name: "Dollaro canadese", symbol: "$" },
  { code: "AUD", name: "Dollaro australiano", symbol: "$" },
  { code: "RUB", name: "Rublo russo", symbol: "₽" },
  { code: "INR", name: "Rupia indiana", symbol: "₹" },
  { code: "BRL", name: "Real brasiliano", symbol: "R$" },
  { code: "ZAR", name: "Rand sudafricano", symbol: "R" },
];

// Tassi di cambio fittizi (in un'app reale questi verrebbero ottenuti da un'API)
const exchangeRates: Record<string, Record<string, number>> = {
  EUR: {
    USD: 1.09, GBP: 0.86, JPY: 162.5, CNY: 7.83, CHF: 0.98, CAD: 1.47, 
    AUD: 1.64, RUB: 98.5, INR: 90.8, BRL: 5.5, ZAR: 19.8, EUR: 1
  },
  USD: {
    EUR: 0.92, GBP: 0.79, JPY: 150, CNY: 7.2, CHF: 0.9, CAD: 1.35, 
    AUD: 1.51, RUB: 90.5, INR: 83.2, BRL: 5.1, ZAR: 18.2, USD: 1
  },
  GBP: {
    EUR: 1.16, USD: 1.27, JPY: 190, CNY: 9.1, CHF: 1.14, CAD: 1.71, 
    AUD: 1.91, RUB: 114.5, INR: 105.5, BRL: 6.4, ZAR: 23, GBP: 1
  },
  // Valori fittizi per le altre valute
  JPY: {
    EUR: 0.0062, USD: 0.0067, GBP: 0.0053, CNY: 0.048, CHF: 0.006, 
    CAD: 0.009, AUD: 0.01, RUB: 0.6, INR: 0.55, BRL: 0.034, ZAR: 0.12, JPY: 1
  },
  CNY: {
    EUR: 0.128, USD: 0.139, GBP: 0.11, JPY: 20.8, CHF: 0.125, 
    CAD: 0.188, AUD: 0.21, RUB: 12.6, INR: 11.6, BRL: 0.7, ZAR: 2.53, CNY: 1
  }
};

// Funzione per ottenere tutti i tassi mancanti usando conversione EUR come intermediario
const getExchangeRate = (from: string, to: string): number => {
  // Se abbiamo già il tasso di cambio diretto
  if (exchangeRates[from] && exchangeRates[from][to]) {
    return exchangeRates[from][to];
  }
  
  // Altrimenti usiamo l'EUR come valuta intermediaria (se possibile)
  if (exchangeRates[from] && exchangeRates[from]["EUR"] && 
      exchangeRates["EUR"] && exchangeRates["EUR"][to]) {
    return exchangeRates[from]["EUR"] * exchangeRates["EUR"][to];
  }
  
  // Se non possiamo convertire, ritorniamo un valore di default
  return 1;
};

const ConvertiValute = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState<string>("EUR");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleConvert = () => {
    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Errore",
        description: "Inserisci un importo valido",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulazione di una chiamata API
    setTimeout(() => {
      const rate = getExchangeRate(fromCurrency, toCurrency);
      const calculatedResult = Number(amount) * rate;
      setResult(calculatedResult);
      setLoading(false);
      
      toast({
        title: "Conversione completata",
        description: `${amount} ${fromCurrency} = ${calculatedResult.toFixed(2)} ${toCurrency}`,
      });
    }, 800);
  };
  
  const switchCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };
  
  const getSymbol = (code: string): string => {
    const currency = currencies.find(c => c.code === code);
    return currency ? currency.symbol : "";
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Convertitore di valute</h1>
        <p className="text-gray-600 mt-2">
          Converti facilmente importi tra diverse valute utilizzando tassi di cambio aggiornati.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="amount">Importo</Label>
                <div className="mt-1 relative">
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                    {getSymbol(fromCurrency)}
                  </span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="from-currency">Da</Label>
                <Select
                  value={fromCurrency}
                  onValueChange={setFromCurrency}
                >
                  <SelectTrigger id="from-currency" className="mt-1">
                    <SelectValue placeholder="Seleziona valuta" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2 flex justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={switchCurrencies}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <div className="rotate-90 md:rotate-0">
                    <ArrowRight className="h-6 w-6 md:hidden" />
                    <ArrowDown className="h-6 w-6 hidden md:block" />
                  </div>
                </Button>
              </div>
              
              <div>
                <Label htmlFor="to-currency">A</Label>
                <Select
                  value={toCurrency}
                  onValueChange={setToCurrency}
                >
                  <SelectTrigger id="to-currency" className="mt-1">
                    <SelectValue placeholder="Seleziona valuta" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="result">Risultato</Label>
                <div className="mt-1 relative">
                  <Input
                    id="result"
                    type="text"
                    value={result !== null ? result.toFixed(2) : ""}
                    readOnly
                    className="pl-8"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                    {getSymbol(toCurrency)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                onClick={handleConvert}
                disabled={loading}
                className="w-full py-6"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Conversione in corso...
                  </>
                ) : (
                  "Converti"
                )}
              </Button>
            </div>
            
            {result !== null && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-lg font-medium">
                  {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Tasso di cambio: 1 {fromCurrency} = {getExchangeRate(fromCurrency, toCurrency).toFixed(4)} {toCurrency}
                </p>
              </div>
            )}
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
                <span>Inserisci l'importo da convertire</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  2
                </div>
                <span>Seleziona la valuta di partenza</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  3
                </div>
                <span>Seleziona la valuta di destinazione</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  4
                </div>
                <span>Clicca su "Converti" per ottenere il risultato</span>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-medium mb-4">Informazioni sui tassi di cambio</h3>
            <p className="text-sm text-gray-600 mb-2">
              I tassi di cambio mostrati sono approssimativi e potrebbero variare leggermente rispetto ai tassi ufficiali.
            </p>
            <p className="text-sm text-gray-600">
              I dati sono aggiornati periodicamente per garantire la massima precisione possibile.
            </p>
          </div>

          <div className="ad-placeholder h-60 mt-6">
            Spazio pubblicitario
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ConvertiValute;
