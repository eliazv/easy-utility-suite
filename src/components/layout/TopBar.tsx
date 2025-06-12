import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import DonationModal from "@/components/DonationModal";

// Lista degli strumenti disponibili per la ricerca
const availableTools = [
  {
    name: "Rimuovi sfondo",
    path: "/rimuovi-sfondo",
    keywords: ["sfondo", "background", "trasparenza", "png"],
  },
  {
    name: "Ridimensiona immagini",
    path: "/ridimensiona-immagini",
    keywords: ["ridimensiona", "resize", "scala", "dimensioni"],
  },
  {
    name: "Comprimi immagini",
    path: "/comprimi-immagini",
    keywords: ["comprimi", "compress", "ottimizza", "qualità"],
  },
  {
    name: "Generatore password",
    path: "/genera-password",
    keywords: ["password", "sicurezza", "generatore", "random"],
  },
  {
    name: "Generatore QR Code",
    path: "/genera-qrcode",
    keywords: ["qr", "code", "barcode", "generatore"],
  },
  {
    name: "Calcolatore percentuale",
    path: "/calcola-sconto",
    keywords: ["percentuale", "sconto", "calcolo", "matematica"],
  },
  {
    name: "Calcolatore BMI",
    path: "/calcola-bmi",
    keywords: ["bmi", "peso", "altezza", "salute"],
  },
  {
    name: "Timer Pomodoro",
    path: "/timer-pomodoro",
    keywords: ["pomodoro", "timer", "produttività", "focus"],
  },
  {
    name: "Timer e Cronometro",
    path: "/timer-cronometro",
    keywords: ["timer", "cronometro", "tempo", "misura"],
  },
  {
    name: "Convertitore unità",
    path: "/converti-unita",
    keywords: ["converti", "unità", "misure", "metri"],
  },
  {
    name: "Convertitore valute",
    path: "/converti-valute",
    keywords: ["valute", "euro", "dollaro", "cambio"],
  },
  {
    name: "Convertitore ore",
    path: "/converti-ore",
    keywords: ["ore", "tempo", "fuso", "orario"],
  },
  {
    name: "Convertitore date",
    path: "/converti-date",
    keywords: ["date", "calendario", "formato"],
  },
  {
    name: "Conta caratteri e parole",
    path: "/conta-caratteri",
    keywords: ["conta", "caratteri", "parole", "testo"],
  },
  {
    name: "Lorem Ipsum",
    path: "/lorem-ipsum",
    keywords: ["lorem", "ipsum", "testo", "placeholder"],
  },
  {
    name: "Color Picker",
    path: "/color-picker",
    keywords: ["colori", "picker", "palette", "rgb"],
  },
  {
    name: "Bussola",
    path: "/bussola",
    keywords: ["bussola", "nord", "direzione", "navigazione"],
  },
  {
    name: "Coordinate GPS",
    path: "/coordinate-gps",
    keywords: ["gps", "coordinate", "latitudine", "longitudine"],
  },
  {
    name: "Calcolo distanza",
    path: "/calcolo-distanza",
    keywords: ["distanza", "chilometri", "mappa", "percorso"],
  },
  {
    name: "Calcola differenza date",
    path: "/calcola-differenza-date",
    keywords: ["differenza", "date", "giorni", "tempo"],
  },
  {
    name: "Calcola mutuo",
    path: "/calcola-mutuo",
    keywords: ["mutuo", "prestito", "rata", "interesse"],
  },
  {
    name: "Calcola area",
    path: "/calcola-area",
    keywords: ["area", "superficie", "geometria", "metri"],
  },
  {
    name: "Generatore numeri",
    path: "/genera-numeri",
    keywords: ["numeri", "random", "casuali", "generatore"],
  },
];

const TopBar = () => {
  const { toggle } = useSidebar();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<
    typeof availableTools
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);

    if (value.length > 1) {
      const suggestions = availableTools
        .filter(
          (tool) =>
            tool.name.toLowerCase().includes(value.toLowerCase()) ||
            tool.keywords.some((keyword) =>
              keyword.toLowerCase().includes(value.toLowerCase())
            )
        )
        .slice(0, 5); // Limita a 5 suggerimenti

      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (tool: (typeof availableTools)[0]) => {
    navigate(tool.path);
    setSearchValue("");
    setShowSuggestions(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchValue.trim()) {
      // Cerca il primo match esatto o il più vicino
      const exactMatch = availableTools.find(
        (tool) => tool.name.toLowerCase() === searchValue.toLowerCase()
      );

      if (exactMatch) {
        navigate(exactMatch.path);
      } else {
        // Trova il miglior match basato su nome e keywords
        const bestMatch = availableTools.find(
          (tool) =>
            tool.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            tool.keywords.some((keyword) =>
              keyword.toLowerCase().includes(searchValue.toLowerCase())
            )
        );

        if (bestMatch) {
          navigate(bestMatch.path);
        }
      }

      setSearchValue("");
      setShowSuggestions(false);
    }
  };

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Mobile sidebar toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>{" "}
        <form
          onSubmit={handleSearch}
          className="flex-1 md:flex-initial md:w-64 lg:w-96"
        >
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca uno strumento..."
              className="pl-8"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                if (searchSuggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                // Delay per permettere il click sui suggerimenti
                setTimeout(() => setShowSuggestions(false), 200);
              }}
            />

            {/* Dropdown suggerimenti */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchSuggestions.map((tool, index) => (
                  <button
                    key={tool.path}
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    onClick={() => handleSuggestionClick(tool)}
                  >
                    <div className="font-medium text-sm">{tool.name}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {tool.keywords.slice(0, 3).join(", ")}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowDonationModal(true)}>
            Supportaci
          </Button>
        </div>
        {/* Donation Modal */}
        <DonationModal
          open={showDonationModal}
          onOpenChange={setShowDonationModal}
        />
      </div>
    </header>
  );
};

export default TopBar;
