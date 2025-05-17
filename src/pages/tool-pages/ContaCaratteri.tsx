
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { AlignLeft, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ContaCaratteri = () => {
  const [text, setText] = useState("");
  const { toast } = useToast();
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
  });

  useEffect(() => {
    // Calcola statistiche quando il testo cambia
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.trim() === "" ? 0 : text.split(/\n+/).filter(Boolean).length;

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
    });
  }, [text]);

  const handleClear = () => {
    setText("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Testo copiato",
      description: "Il testo è stato copiato negli appunti",
    });
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Conta caratteri e parole</h1>
        <p className="text-gray-600 mt-2">
          Strumento gratuito per contare caratteri, parole, frasi e paragrafi nel tuo testo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="text-input" className="font-medium">
                  Inserisci il testo da analizzare
                </label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClear}
                  >
                    Cancella
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopy}
                    disabled={!text}
                  >
                    <Copy className="h-4 w-4 mr-1" /> Copia
                  </Button>
                </div>
              </div>
              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-64 p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Inserisci qui il tuo testo..."
              ></textarea>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-3">Statistiche del testo</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="border rounded-md p-3 bg-white">
                  <p className="text-sm text-gray-500">Caratteri</p>
                  <p className="text-xl font-semibold">{stats.characters}</p>
                </div>
                <div className="border rounded-md p-3 bg-white">
                  <p className="text-sm text-gray-500">Caratteri (senza spazi)</p>
                  <p className="text-xl font-semibold">{stats.charactersNoSpaces}</p>
                </div>
                <div className="border rounded-md p-3 bg-white">
                  <p className="text-sm text-gray-500">Parole</p>
                  <p className="text-xl font-semibold">{stats.words}</p>
                </div>
                <div className="border rounded-md p-3 bg-white">
                  <p className="text-sm text-gray-500">Frasi</p>
                  <p className="text-xl font-semibold">{stats.sentences}</p>
                </div>
                <div className="border rounded-md p-3 bg-white">
                  <p className="text-sm text-gray-500">Paragrafi</p>
                  <p className="text-xl font-semibold">{stats.paragraphs}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-4">Informazioni</h3>
            <p className="text-gray-600 text-sm mb-4">
              Questo strumento ti permette di contare rapidamente:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <AlignLeft className="h-3 w-3" />
                </div>
                <span>Caratteri totali (inclusi spazi)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <AlignLeft className="h-3 w-3" />
                </div>
                <span>Caratteri senza spazi</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <AlignLeft className="h-3 w-3" />
                </div>
                <span>Numero di parole</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <AlignLeft className="h-3 w-3" />
                </div>
                <span>Numero di frasi</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="bg-blue-100 p-1 rounded-full text-blue-700">
                  <AlignLeft className="h-3 w-3" />
                </div>
                <span>Numero di paragrafi</span>
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

export default ContaCaratteri;
