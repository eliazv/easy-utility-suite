
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";

type UnitCategory = 'lunghezza' | 'peso' | 'volume' | 'temperatura' | 'area' | 'velocita';

interface UnitConversion {
  units: Record<string, { label: string; factor: number }>;
  baseUnit: string;
}

const CONVERSIONS: Record<UnitCategory, UnitConversion> = {
  lunghezza: {
    baseUnit: 'm',
    units: {
      'km': { label: 'Chilometri', factor: 0.001 },
      'm': { label: 'Metri', factor: 1 },
      'cm': { label: 'Centimetri', factor: 100 },
      'mm': { label: 'Millimetri', factor: 1000 },
      'mi': { label: 'Miglia', factor: 0.000621371 },
      'yd': { label: 'Iarde', factor: 1.09361 },
      'ft': { label: 'Piedi', factor: 3.28084 },
      'in': { label: 'Pollici', factor: 39.3701 }
    }
  },
  peso: {
    baseUnit: 'kg',
    units: {
      't': { label: 'Tonnellate', factor: 0.001 },
      'kg': { label: 'Chilogrammi', factor: 1 },
      'g': { label: 'Grammi', factor: 1000 },
      'mg': { label: 'Milligrammi', factor: 1000000 },
      'lb': { label: 'Libbre', factor: 2.20462 },
      'oz': { label: 'Once', factor: 35.274 }
    }
  },
  volume: {
    baseUnit: 'l',
    units: {
      'l': { label: 'Litri', factor: 1 },
      'ml': { label: 'Millilitri', factor: 1000 },
      'gal': { label: 'Galloni (US)', factor: 0.264172 },
      'qt': { label: 'Quarti (US)', factor: 1.05669 },
      'pt': { label: 'Pinte (US)', factor: 2.11338 },
      'cup': { label: 'Tazze (US)', factor: 4.22675 },
      'oz_fl': { label: 'Once liquide (US)', factor: 33.814 }
    }
  },
  temperatura: {
    baseUnit: 'c',
    units: {
      'c': { label: 'Celsius', factor: 1 },
      'f': { label: 'Fahrenheit', factor: 1 },
      'k': { label: 'Kelvin', factor: 1 }
    }
  },
  area: {
    baseUnit: 'm2',
    units: {
      'km2': { label: 'Chilometri quadrati', factor: 0.000001 },
      'm2': { label: 'Metri quadrati', factor: 1 },
      'cm2': { label: 'Centimetri quadrati', factor: 10000 },
      'mm2': { label: 'Millimetri quadrati', factor: 1000000 },
      'ha': { label: 'Ettari', factor: 0.0001 },
      'ac': { label: 'Acri', factor: 0.000247105 },
      'ft2': { label: 'Piedi quadrati', factor: 10.7639 }
    }
  },
  velocita: {
    baseUnit: 'ms',
    units: {
      'ms': { label: 'Metri al secondo', factor: 1 },
      'kms': { label: 'Chilometri all\'ora', factor: 3.6 },
      'mph': { label: 'Miglia all\'ora', factor: 2.23694 },
      'kn': { label: 'Nodi', factor: 1.94384 },
      'fts': { label: 'Piedi al secondo', factor: 3.28084 }
    }
  }
};

// Funzioni speciali per la temperatura
const temperatureConvert = (value: number, from: string, to: string): number => {
  // Prima convertiamo al valore base (Celsius)
  let baseTempValue: number;
  
  switch(from) {
    case 'f':
      baseTempValue = (value - 32) * 5/9;
      break;
    case 'k':
      baseTempValue = value - 273.15;
      break;
    default: // Celsius
      baseTempValue = value;
  }
  
  // Poi convertiamo dalla base all'unità di destinazione
  switch(to) {
    case 'f':
      return baseTempValue * 9/5 + 32;
    case 'k':
      return baseTempValue + 273.15;
    default: // Celsius
      return baseTempValue;
  }
};

const ConvertiUnita = () => {
  const [category, setCategory] = useState<UnitCategory>('lunghezza');
  const [fromUnit, setFromUnit] = useState<string>(Object.keys(CONVERSIONS.lunghezza.units)[1]);
  const [toUnit, setToUnit] = useState<string>(Object.keys(CONVERSIONS.lunghezza.units)[0]);
  const [inputValue, setInputValue] = useState<string>("1");
  const [result, setResult] = useState<string>("1");

  // Converti quando cambiano gli input
  const convertValue = (value: string, from: string, to: string, cat: UnitCategory) => {
    if (!value || isNaN(Number(value))) {
      return "0";
    }
    
    const numVal = parseFloat(value);
    
    // Gestione speciale per le temperature
    if (cat === 'temperatura') {
      return temperatureConvert(numVal, from, to).toLocaleString('it-IT', {
        maximumFractionDigits: 6,
        minimumFractionDigits: 0
      });
    }
    
    // Per tutte le altre conversioni
    const { units, baseUnit } = CONVERSIONS[cat];
    
    // Converti al valore base
    const baseValue = from === baseUnit ? numVal : numVal / units[from].factor;
    
    // Converti dal valore base all'unità di destinazione
    const resultValue = to === baseUnit ? baseValue : baseValue * units[to].factor;
    
    return resultValue.toLocaleString('it-IT', {
      maximumFractionDigits: 6,
      minimumFractionDigits: 0
    });
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    setResult(convertValue(val, fromUnit, toUnit, category));
  };

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    // Imposta le unità predefinite per la categoria
    const defaultFromUnit = Object.keys(CONVERSIONS[cat].units)[1];
    const defaultToUnit = Object.keys(CONVERSIONS[cat].units)[0];
    setFromUnit(defaultFromUnit);
    setToUnit(defaultToUnit);
    // Aggiorna il risultato
    setResult(convertValue(inputValue, defaultFromUnit, defaultToUnit, cat));
  };

  const handleFromUnitChange = (unit: string) => {
    setFromUnit(unit);
    setResult(convertValue(inputValue, unit, toUnit, category));
  };

  const handleToUnitChange = (unit: string) => {
    setToUnit(unit);
    setResult(convertValue(inputValue, fromUnit, unit, category));
  };

  // Scambia le unità
  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setResult(convertValue(inputValue, toUnit, fromUnit, category));
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Convertitore di Unità di Misura</h1>
        <p className="text-muted-foreground">Converti facilmente tra diverse unità di misura</p>
      </div>
      
      <div className="grid gap-6">
        <Tabs value={category} onValueChange={(v) => handleCategoryChange(v as UnitCategory)} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
            <TabsTrigger value="lunghezza">Lunghezza</TabsTrigger>
            <TabsTrigger value="peso">Peso</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="temperatura">Temperatura</TabsTrigger>
            <TabsTrigger value="area">Area</TabsTrigger>
            <TabsTrigger value="velocita">Velocità</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Converti {CONVERSIONS[category].units[fromUnit].label} in {CONVERSIONS[category].units[toUnit].label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  <Input
                    type="number"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="text-lg"
                  />
                  <Select value={fromUnit} onValueChange={handleFromUnitChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CONVERSIONS[category].units).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="rounded-full bg-muted p-2 cursor-pointer hover:bg-muted/80" onClick={swapUnits}>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  <Input
                    type="text"
                    value={result}
                    readOnly
                    className="text-lg bg-muted"
                  />
                  <Select value={toUnit} onValueChange={handleToUnitChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CONVERSIONS[category].units).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Formule di conversione comuni</h3>
          <ul className="text-sm space-y-1">
            {category === 'temperatura' ? (
              <>
                <li>Celsius a Fahrenheit: °F = °C × 9/5 + 32</li>
                <li>Fahrenheit a Celsius: °C = (°F - 32) × 5/9</li>
                <li>Celsius a Kelvin: K = °C + 273.15</li>
              </>
            ) : category === 'lunghezza' ? (
              <>
                <li>1 metro = 100 centimetri</li>
                <li>1 chilometro = 1000 metri</li>
                <li>1 miglio = 1.60934 chilometri</li>
                <li>1 piede = 30.48 centimetri</li>
              </>
            ) : category === 'peso' ? (
              <>
                <li>1 chilogrammo = 1000 grammi</li>
                <li>1 libbra = 453.592 grammi</li>
                <li>1 oncia = 28.3495 grammi</li>
              </>
            ) : (
              <>
                <li>Le conversioni variano in base all'unità selezionata</li>
                <li>Il sistema utilizza fattori di conversione standard</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default ConvertiUnita;
