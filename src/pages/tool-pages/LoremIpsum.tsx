
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, RefreshCcw, AlignLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const LoremIpsum = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState(5);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState("");

  // Dizionario di parole latine
  const words = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", 
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", 
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", 
    "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis", 
    "aute", "irure", "reprehenderit", "voluptate", "velit", "esse", "cillum", "eu", "fugiat", 
    "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", 
    "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
  ];

  // Genera una parola casuale
  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  // Genera una frase casuale
  const generateSentence = (min = 5, max = 15) => {
    const length = Math.floor(Math.random() * (max - min + 1)) + min;
    let sentence = getRandomWord().charAt(0).toUpperCase() + getRandomWord().slice(1);
    
    for (let i = 1; i < length; i++) {
      sentence += " " + getRandomWord();
    }
    
    return sentence + ".";
  };

  // Genera un paragrafo casuale
  const generateParagraph = (min = 3, max = 7) => {
    const length = Math.floor(Math.random() * (max - min + 1)) + min;
    let paragraph = "";
    
    for (let i = 0; i < length; i++) {
      paragraph += generateSentence();
      if (i < length - 1) {
        paragraph += " ";
      }
    }
    
    return paragraph;
  };

  // Genera il testo richiesto
  const generateText = () => {
    let text = "";
    
    switch (type) {
      case "paragraphs":
        for (let i = 0; i < amount; i++) {
          text += generateParagraph();
          if (i < amount - 1) {
            text += "\n\n";
          }
        }
        break;
      
      case "sentences":
        for (let i = 0; i < amount; i++) {
          text += generateSentence();
          if (i < amount - 1) {
            text += " ";
          }
        }
        break;
      
      case "words":
        text = getRandomWord().charAt(0).toUpperCase() + getRandomWord().slice(1);
        for (let i = 1; i < amount; i++) {
          text += " " + getRandomWord();
        }
        text += ".";
        break;
    }
    
    setResult(text);
    setCopied(false);
  };

  // Copia il testo negli appunti
  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    
    toast({
      title: "Testo copiato",
      description: "Il testo è stato copiato negli appunti",
    });
    
    // Reset dell'icona dopo 2 secondi
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  // Genera il testo all'avvio
  useState(() => {
    generateText();
  });

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Generatore di Lorem Ipsum</h1>
        <p className="text-gray-600 mt-2">
          Genera testo fittizio Lorem Ipsum per i tuoi progetti di design e sviluppo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-4">Opzioni di generazione</h2>
              <Tabs
                defaultValue="paragraphs"
                value={type}
                onValueChange={(v) => setType(v as "paragraphs" | "sentences" | "words")}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="paragraphs">Paragrafi</TabsTrigger>
                  <TabsTrigger value="sentences">Frasi</TabsTrigger>
                  <TabsTrigger value="words">Parole</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span>Quantità: {amount}</span>
                  <span className="text-gray-500">
                    {type === "paragraphs"
                      ? "paragrafi"
                      : type === "sentences"
                      ? "frasi"
                      : "parole"}
                  </span>
                </div>
                <Slider
                  value={[amount]}
                  min={1}
                  max={type === "paragraphs" ? 10 : type === "sentences" ? 20 : 50}
                  step={1}
                  onValueChange={(value) => {
                    setAmount(value[0]);
                  }}
                  className="mb-6"
                />
                <Button
                  onClick={generateText}
                  className="w-full"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Genera nuovo testo
                </Button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-medium">Testo generato</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <>
                      <Check className="mr-1 h-4 w-4" />
                      Copiato
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 h-4 w-4" />
                      Copia
                    </>
                  )}
                </Button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border overflow-auto max-h-80">
                {type === "paragraphs" ? (
                  result.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p>{result}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-4">Cos'è Lorem Ipsum?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Lorem Ipsum è un testo segnaposto utilizzato nel settore della 
              tipografia e della stampa. È considerato il testo segnaposto standard
              sin dal sedicesimo secolo.
            </p>
            <h4 className="font-medium text-sm mt-4 mb-2">Utilizzi comuni:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <AlignLeft className="h-3 w-3" />
                </div>
                <span>Mockup di design di siti web</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <AlignLeft className="h-3 w-3" />
                </div>
                <span>Template di documenti</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <AlignLeft className="h-3 w-3" />
                </div>
                <span>Presentazioni e layout grafici</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <AlignLeft className="h-3 w-3" />
                </div>
                <span>Prototipi di applicazioni</span>
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

export default LoremIpsum;
