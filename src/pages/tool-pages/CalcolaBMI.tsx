
import { useState, useEffect } from "react";
import { BarChart2, Info } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

type BMICategory = {
  range: string;
  category: string;
  description: string;
  color: string;
};

const bmiCategories: BMICategory[] = [
  { 
    range: "< 18.5", 
    category: "Sottopeso", 
    description: "Un BMI inferiore a 18.5 indica che sei sottopeso. Potresti dover aumentare di peso, preferibilmente con il consiglio di un professionista della salute.",
    color: "bg-blue-500" 
  },
  { 
    range: "18.5 - 24.9", 
    category: "Normopeso", 
    description: "Un BMI tra 18.5 e 24.9 indica che sei in un intervallo di peso sano per la tua altezza.",
    color: "bg-green-500" 
  },
  { 
    range: "25.0 - 29.9", 
    category: "Sovrappeso", 
    description: "Un BMI tra 25 e 29.9 indica che sei in sovrappeso. Potresti essere consigliato di perdere peso.",
    color: "bg-yellow-500" 
  },
  { 
    range: "30.0 - 34.9", 
    category: "Obesità Classe 1", 
    description: "Un BMI tra 30 e 34.9 indica obesità di classe 1. È consigliabile perdere peso per ridurre il rischio di problemi di salute.",
    color: "bg-orange-500" 
  },
  { 
    range: "35.0 - 39.9", 
    category: "Obesità Classe 2", 
    description: "Un BMI tra 35 e 39.9 indica obesità di classe 2 (severa). È fortemente consigliato perdere peso.",
    color: "bg-red-500" 
  },
  { 
    range: "≥ 40", 
    category: "Obesità Classe 3", 
    description: "Un BMI di 40 o superiore indica obesità di classe 3 (grave). È urgentemente consigliata la perdita di peso.",
    color: "bg-red-700" 
  },
];

const CalcolaBMI = () => {
  const { toast } = useToast();
  const [height, setHeight] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<BMICategory | null>(null);
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");

  const calculateBMI = () => {
    if (height === "" || weight === "" || height <= 0 || weight <= 0) {
      toast({
        title: "Errore",
        description: "Inserisci valori validi per altezza e peso",
        variant: "destructive",
      });
      return;
    }

    let bmiValue: number;

    if (unitSystem === "metric") {
      // Calcolo BMI nel sistema metrico (peso in kg, altezza in cm)
      const heightInMeters = Number(height) / 100;
      bmiValue = Number(weight) / (heightInMeters * heightInMeters);
    } else {
      // Calcolo BMI nel sistema imperiale (peso in lb, altezza in in)
      bmiValue = (Number(weight) * 703) / (Number(height) * Number(height));
    }

    // Arrotonda a una cifra decimale
    const roundedBMI = Math.round(bmiValue * 10) / 10;
    setBmi(roundedBMI);

    // Determina la categoria
    const foundCategory = determineBMICategory(roundedBMI);
    setCategory(foundCategory);

    toast({
      title: "BMI calcolato",
      description: `Il tuo BMI è ${roundedBMI} (${foundCategory?.category})`,
    });
  };

  const determineBMICategory = (bmiValue: number): BMICategory => {
    if (bmiValue < 18.5) return bmiCategories[0];
    if (bmiValue < 25) return bmiCategories[1];
    if (bmiValue < 30) return bmiCategories[2];
    if (bmiValue < 35) return bmiCategories[3];
    if (bmiValue < 40) return bmiCategories[4];
    return bmiCategories[5];
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setHeight(value);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : Number(e.target.value);
    setWeight(value);
  };

  const switchUnitSystem = () => {
    if (unitSystem === "metric") {
      // Converti da metrico a imperiale
      setUnitSystem("imperial");
      if (height !== "") {
        // cm a inches (1 cm = 0.393701 inches)
        setHeight(Math.round(Number(height) * 0.393701 * 10) / 10);
      }
      if (weight !== "") {
        // kg a pounds (1 kg = 2.20462 pounds)
        setWeight(Math.round(Number(weight) * 2.20462 * 10) / 10);
      }
    } else {
      // Converti da imperiale a metrico
      setUnitSystem("metric");
      if (height !== "") {
        // inches a cm (1 inch = 2.54 cm)
        setHeight(Math.round(Number(height) * 2.54 * 10) / 10);
      }
      if (weight !== "") {
        // pounds a kg (1 pound = 0.453592 kg)
        setWeight(Math.round(Number(weight) * 0.453592 * 10) / 10);
      }
    }
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Calcolatore BMI (Indice di Massa Corporea)</h1>
        <p className="text-gray-600 mt-2">
          Calcola il tuo Indice di Massa Corporea (BMI) e scopri se il tuo peso rientra in un intervallo salutare.
          Il BMI è un indicatore che mette in relazione il peso e l'altezza.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex justify-end mb-4">
              <Button variant="outline" onClick={switchUnitSystem}>
                Cambia in {unitSystem === "metric" ? "Imperiale (in, lb)" : "Metrico (cm, kg)"}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="height">
                  Altezza {unitSystem === "metric" ? "(cm)" : "(pollici)"}
                </Label>
                <Input
                  id="height"
                  type="number"
                  min="1"
                  placeholder={unitSystem === "metric" ? "Es. 170" : "Es. 67"}
                  value={height}
                  onChange={handleHeightChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="weight">
                  Peso {unitSystem === "metric" ? "(kg)" : "(libbre)"}
                </Label>
                <Input
                  id="weight"
                  type="number"
                  min="1"
                  placeholder={unitSystem === "metric" ? "Es. 70" : "Es. 154"}
                  value={weight}
                  onChange={handleWeightChange}
                  className="mt-1"
                />
              </div>
            </div>
            
            <Button onClick={calculateBMI} className="w-full mt-6">
              Calcola BMI
            </Button>
            
            {bmi !== null && category && (
              <div className="mt-8">
                <h2 className="text-xl font-medium mb-4">Il tuo risultato</h2>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center flex-1">
                    <div className="text-5xl font-bold mb-2">{bmi}</div>
                    <div className="text-gray-500">Il tuo BMI</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      <h3 className="text-lg font-medium">{category.category}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Scala BMI</h3>
                  <div className="flex h-6 rounded-md overflow-hidden w-full">
                    {bmiCategories.map((cat, index) => (
                      <div 
                        key={index}
                        className={`${cat.color} ${cat === category ? 'border-2 border-white' : ''} flex-1`}
                        title={`${cat.category}: ${cat.range}`}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>16</span>
                    <span>24</span>
                    <span>32</span>
                    <span>40+</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Nota importante</h3>
                <p className="text-sm text-gray-600">
                  Il BMI è un indicatore generale e potrebbe non essere adeguato per tutti gli individui, 
                  come atleti (con molta massa muscolare), donne in gravidanza, anziani o persone in crescita. 
                  Questo strumento non sostituisce il consiglio di un professionista della salute. 
                  Consulta sempre un medico per una valutazione completa del tuo stato di salute.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-4">Categorie BMI</h3>
            <div className="space-y-2">
              {bmiCategories.map((cat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                  <span className="font-medium text-sm">{cat.category}</span>
                  <span className="text-sm text-gray-500 ml-auto">{cat.range}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-4">Come si calcola il BMI?</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                Il BMI si calcola dividendo il peso in chilogrammi per il quadrato dell'altezza in metri.
              </p>
              <div className="bg-gray-50 p-3 rounded text-center">
                <p className="font-medium">BMI = peso (kg) / [altezza (m)]²</p>
              </div>
              <p>
                Nel sistema imperiale, la formula è leggermente diversa:
              </p>
              <div className="bg-gray-50 p-3 rounded text-center">
                <p className="font-medium">BMI = [peso (lb) / altezza² (in)] × 703</p>
              </div>
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

export default CalcolaBMI;
