
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCcw, KeyRound, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const GeneraPassword = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  // Genera una password all'avvio
  useState(() => {
    generatePassword();
  });

  const generatePassword = () => {
    let charset = "";
    let result = "";

    if (options.uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (options.numbers) charset += "0123456789";
    if (options.symbols) charset += "!@#$%^&*()_+{}:\"<>?|[];\',./`~";

    // Assicurati che almeno un set di caratteri sia selezionato
    if (charset === "") {
      setOptions({ ...options, lowercase: true });
      charset += "abcdefghijklmnopqrstuvwxyz";
    }

    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setPassword(result);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast({
      title: "Password copiata",
      description: "La password è stata copiata negli appunti",
    });
    
    // Resetta l'icona dopo 2 secondi
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleOptionChange = (option: keyof typeof options) => {
    // Verifica che almeno un'opzione rimanga selezionata
    const newOptions = { ...options, [option]: !options[option] };
    
    if (Object.values(newOptions).some(Boolean)) {
      setOptions(newOptions);
      generatePassword();
    } else {
      toast({
        title: "Attenzione",
        description: "Devi selezionare almeno un tipo di carattere",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Generatore di password sicure</h1>
        <p className="text-gray-600 mt-2">
          Crea password forti e sicure per proteggere i tuoi account e dati personali.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-4">La tua password generata</h2>
              <div className="flex">
                <Input 
                  value={password} 
                  readOnly 
                  className="font-mono text-lg"
                />
                <Button
                  onClick={handleCopy}
                  className="ml-2"
                  variant="outline"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  onClick={generatePassword}
                  className="ml-2"
                  variant="outline"
                >
                  <RefreshCcw className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-4">Lunghezza password: {length} caratteri</h3>
              <Slider
                value={[length]}
                min={8}
                max={32}
                step={1}
                onValueChange={(value) => {
                  setLength(value[0]);
                  generatePassword();
                }}
              />
              <div className="flex justify-between mt-1 text-sm text-gray-500">
                <span>8</span>
                <span>16</span>
                <span>24</span>
                <span>32</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Opzioni caratteri</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase" className="cursor-pointer">
                    Lettere maiuscole (A-Z)
                  </Label>
                  <Switch
                    id="uppercase"
                    checked={options.uppercase}
                    onCheckedChange={() => handleOptionChange("uppercase")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lowercase" className="cursor-pointer">
                    Lettere minuscole (a-z)
                  </Label>
                  <Switch
                    id="lowercase"
                    checked={options.lowercase}
                    onCheckedChange={() => handleOptionChange("lowercase")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="numbers" className="cursor-pointer">
                    Numeri (0-9)
                  </Label>
                  <Switch
                    id="numbers"
                    checked={options.numbers}
                    onCheckedChange={() => handleOptionChange("numbers")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="symbols" className="cursor-pointer">
                    Simboli (!@#$%^&*)
                  </Label>
                  <Switch
                    id="symbols"
                    checked={options.symbols}
                    onCheckedChange={() => handleOptionChange("symbols")}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button onClick={generatePassword} className="w-full">
                Genera nuova password
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-4">Consigli per password sicure</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <KeyRound className="h-3 w-3" />
                </div>
                <span>Usa una password di almeno 12 caratteri</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <KeyRound className="h-3 w-3" />
                </div>
                <span>Combina lettere, numeri e simboli</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <KeyRound className="h-3 w-3" />
                </div>
                <span>Evita nomi, date o parole comuni</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <KeyRound className="h-3 w-3" />
                </div>
                <span>Usa password diverse per ogni servizio</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <KeyRound className="h-3 w-3" />
                </div>
                <span>Cambia le tue password regolarmente</span>
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

export default GeneraPassword;
