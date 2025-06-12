import { Link } from "react-router-dom";
import {
  FileText,
  Calculator,
  KeyRound,
  Image,
  Percent,
  AlignLeft,
  ArrowRight,
  Calendar,
  Clock,
  BarChart2,
  FileImage,
  Clock3,
  QrCode,
  Wallet,
  Compass,
  Download,
  Palette,
  Ruler,
  Crosshair,
  MapPin,
  MessageSquare,
  Wifi,
  PenTool,
  SplitSquareVertical,
  Dice6,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

// Tool groups
const toolGroups = [
  {
    id: "images",
    name: "Immagini",
    tools: [
      {
        name: "Rimuovi sfondo",
        description:
          "Rimuovi automaticamente lo sfondo dalle foto con intelligenza artificiale - Converti in PNG con trasparenza",
        icon: <Image className="h-10 w-10" />,
        path: "/rimuovi-sfondo",
        color: "bg-green-50 text-tool-green",
      },
      {
        name: "Comprimi immagini",
        description:
          "Comprimi immagini JPEG, PNG, WEBP senza perdita di qualità - Ottimizza per web e social media",
        icon: <FileImage className="h-10 w-10" />,
        path: "/comprimi-immagini",
        color: "bg-green-50 text-tool-green",
      },
      {
        name: "Ridimensiona immagini",
        description:
          "Modifica le dimensioni delle tue immagini senza perdere qualità",
        icon: <Image className="h-10 w-10" />,
        path: "/ridimensiona-immagini",
        color: "bg-green-50 text-tool-green",
      },
    ],
  },
  {
    id: "documents",
    name: "Documenti",
    tools: [
      {
        name: "Convertitore file",
        description: "Converti facilmente i tuoi file tra diversi formati",
        icon: <FileText className="h-10 w-10" />,
        path: "/pdf-to-word",
        color: "bg-red-50 text-tool-red",
      },
      {
        name: "Conta caratteri e parole",
        description:
          "Calcola il numero di caratteri, parole e frasi nel tuo testo",
        icon: <AlignLeft className="h-10 w-10" />,
        path: "/conta-caratteri",
        color: "bg-blue-50 text-tool-blue",
      },
    ],
  },
  {
    id: "calculators",
    name: "Calcolatori",
    tools: [
      {
        name: "Calcolatore percentuale",
        description: "Calcola percentuali, sconti e variazioni tra numeri",
        icon: <Percent className="h-10 w-10" />,
        path: "/calcola-sconto",
        color: "bg-orange-50 text-tool-orange",
      },
      {
        name: "Calcolatore BMI",
        description:
          "Calcola il tuo Indice di Massa Corporea e scopri se sei nel range ideale",
        icon: <BarChart2 className="h-10 w-10" />,
        path: "/calcola-bmi",
        color: "bg-orange-50 text-tool-orange",
      },
      {
        name: "Calcolo differenza date",
        description: "Calcola i giorni, mesi e anni tra due date diverse",
        icon: <Calendar className="h-10 w-10" />,
        path: "/calcola-differenza-date",
        color: "bg-blue-50 text-tool-blue",
      },
      {
        name: "Calcolo mutuo/prestito",
        description: "Calcola rate, interessi e piano di ammortamento",
        icon: <FileSpreadsheet className="h-10 w-10" />,
        path: "/calcola-mutuo",
        color: "bg-red-50 text-tool-red",
      },
    ],
  },
  {
    id: "converters",
    name: "Convertitori",
    tools: [
      {
        name: "Convertitore date",
        description: "Converti date tra diversi formati internazionali",
        icon: <Calendar className="h-10 w-10" />,
        path: "/converti-date",
        color: "bg-blue-50 text-tool-blue",
      },
      {
        name: "Convertitore ore",
        description: "Converti orari tra formato 12h, 24h, minuti e secondi",
        icon: <Clock className="h-10 w-10" />,
        path: "/converti-ore",
        color: "bg-green-50 text-tool-green",
      },
      {
        name: "Convertitore valute",
        description:
          "Converti importi tra diverse valute con tassi di cambio aggiornati",
        icon: <Wallet className="h-10 w-10" />,
        path: "/converti-valute",
        color: "bg-purple-50 text-tool-purple",
      },
    ],
  },
  {
    id: "generators",
    name: "Generatori",
    tools: [
      {
        name: "Generatore password",
        description: "Crea password sicure e personalizzate per i tuoi account",
        icon: <KeyRound className="h-10 w-10" />,
        path: "/genera-password",
        color: "bg-purple-50 text-tool-purple",
      },
      {
        name: "Generatore QR Code",
        description:
          "Crea QR code personalizzati per URL, testi, email e numeri di telefono",
        icon: <QrCode className="h-10 w-10" />,
        path: "/genera-qrcode",
        color: "bg-blue-50 text-tool-blue",
      },
      {
        name: "Generatore Lorem Ipsum",
        description: "Genera testo fittizio per i tuoi progetti di design",
        icon: <AlignLeft className="h-10 w-10" />,
        path: "/lorem-ipsum",
        color: "bg-red-50 text-tool-red",
      },
      {
        name: "Generatore colori",
        description: "Crea, converti e gestisci colori in diversi formati",
        icon: <Palette className="h-10 w-10" />,
        path: "/color-picker",
        color: "bg-purple-50 text-tool-purple",
      },
      {
        name: "Generatore numeri casuali",
        description: "Genera numeri casuali, serie o simula lanci di dadi",
        icon: <Dice6 className="h-10 w-10" />,
        path: "/genera-numeri",
        color: "bg-orange-50 text-tool-orange",
      },
    ],
  },
  {
    id: "utility",
    name: "Utilità",
    tools: [
      {
        name: "Timer e Cronometro",
        description:
          "Strumenti per misurare il tempo con timer countdown e cronometro",
        icon: <Clock3 className="h-10 w-10" />,
        path: "/timer-cronometro",
        color: "bg-red-50 text-tool-red",
      },
      {
        name: "Timer Pomodoro",
        description:
          "Utilizza la tecnica Pomodoro per migliorare la produttività",
        icon: <Clock className="h-10 w-10" />,
        path: "/timer-pomodoro",
        color: "bg-red-50 text-tool-red",
      },
      {
        name: "Strumento disegno",
        description: "Canvas digitale per disegno a mano libera e sketch",
        icon: <PenTool className="h-10 w-10" />,
        path: "/strumento-disegno",
        color: "bg-purple-50 text-tool-purple",
      },
    ],
  },
  {
    id: "geografici",
    name: "Strumenti Geografici",
    tools: [
      {
        name: "Bussola",
        description:
          "Utilizza la bussola per orientarti e trovare il Nord magnetico",
        icon: <Compass className="h-10 w-10" />,
        path: "/bussola",
        color: "bg-blue-50 text-tool-blue",
      },
      {
        name: "Coordinate GPS",
        description: "Rileva e condividi la tua posizione GPS attuale",
        icon: <MapPin className="h-10 w-10" />,
        path: "/coordinate-gps",
        color: "bg-red-50 text-tool-red",
      },
      {
        name: "Calcolo distanza",
        description: "Misura la distanza tra due punti sulla mappa",
        icon: <Crosshair className="h-10 w-10" />,
        path: "/calcolo-distanza",
        color: "bg-green-50 text-tool-green",
      },
    ],
  },
];

const Index = () => {
  return (
    <MainLayout>
      <div className="ad-placeholder w-full h-20 mb-8">
        Banner pubblicitario orizzontale
      </div>

      <section className="mb-12">
        <div className="max-w-3xl">
          <h1 className="font-bold mb-4">
            Strumenti online <span className="gradient-text">gratuiti</span> per
            le tue esigenze quotidiane
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Semplici, veloci e facili da usare. Nessuna installazione richiesta.
          </p>
        </div>
      </section>

      {toolGroups.map((group) => (
        <section key={group.id} className="mb-12">
          <h2 className="text-2xl font-medium mb-6">{group.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.tools.map((tool) => (
              <Link to={tool.path} key={tool.path} className="tool-card">
                <div className="flex items-start">
                  <div className={`${tool.color} p-3 rounded-md`}>
                    {tool.icon}
                  </div>
                </div>
                <h3 className="text-xl font-medium mt-4">{tool.name}</h3>
                <p className="text-gray-500 mt-2 mb-4 flex-grow">
                  {tool.description}
                </p>
                <div className="flex justify-end mt-2">
                  <Button variant="ghost" className="gap-1">
                    Utilizza <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-16">
        <div className="bg-blue-50 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-medium mb-3">
            Tutti gli strumenti sono gratuiti
          </h2>
          <p className="text-gray-600 mb-4">
            Il nostro obiettivo è rendere accessibili a tutti strumenti online
            utili e di qualità. Non è richiesta alcuna registrazione e tutti i
            dati vengono elaborati direttamente nel browser.
          </p>
          <Button variant="default">Esplora tutti gli strumenti</Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
