
import { Link } from "react-router-dom";
import { 
  FileText, Calculator, KeyRound, Image, 
  Percent, AlignLeft, ArrowRight, Calendar,
  Clock, BarChart2, FileImage,
  Clock3, QrCode, Wallet, Compass,
  Download, Palette, Ruler, Crosshair, 
  MapPin, MessageSquare, Wifi, PenTool,
  SplitSquareVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

// Tool groups
const toolGroups = [
  {
    id: "documents",
    name: "Documenti",
    tools: [
      {
        name: "Convertitore file",
        description: "Converti facilmente i tuoi file tra diversi formati",
        icon: <FileText className="h-10 w-10" />,
        path: "/pdf-to-word",
        color: "bg-red-50 text-tool-red"
      },
      {
        name: "Conta caratteri e parole",
        description: "Calcola il numero di caratteri, parole e frasi nel tuo testo",
        icon: <AlignLeft className="h-10 w-10" />,
        path: "/conta-caratteri",
        color: "bg-blue-50 text-tool-blue"
      }
    ]
  },
  {
    id: "images",
    name: "Immagini",
    tools: [
      {
        name: "Ridimensiona immagini",
        description: "Modifica le dimensioni delle tue immagini senza perdere qualità",
        icon: <Image className="h-10 w-10" />,
        path: "/ridimensiona-immagini",
        color: "bg-green-50 text-tool-green"
      },
      {
        name: "Comprimi immagini",
        description: "Riduci la dimensione dei file immagine mantenendo una buona qualità",
        icon: <FileImage className="h-10 w-10" />,
        path: "/comprimi-immagini",
        color: "bg-green-50 text-tool-green"
      }
    ]
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
        color: "bg-orange-50 text-tool-orange"
      },
      {
        name: "Calcolatore BMI",
        description: "Calcola il tuo Indice di Massa Corporea e scopri se sei nel range ideale",
        icon: <BarChart2 className="h-10 w-10" />,
        path: "/calcola-bmi",
        color: "bg-orange-50 text-tool-orange"
      },
      {
        name: "Convertitore unità",
        description: "Converti facilmente tra diverse unità di misura",
        icon: <Ruler className="h-10 w-10" />,
        path: "/converti-unita",
        color: "bg-orange-50 text-tool-orange"
      },
      {
        name: "Calcolatore area",
        description: "Calcola l'area di diverse figure geometriche",
        icon: <SplitSquareVertical className="h-10 w-10" />,
        path: "/calcola-area",
        color: "bg-orange-50 text-tool-orange"
      }
    ]
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
        color: "bg-blue-50 text-tool-blue"
      },
      {
        name: "Convertitore ore",
        description: "Converti orari tra formato 12h, 24h, minuti e secondi",
        icon: <Clock className="h-10 w-10" />,
        path: "/converti-ore",
        color: "bg-green-50 text-tool-green"
      },
      {
        name: "Convertitore valute",
        description: "Converti importi tra diverse valute con tassi di cambio aggiornati",
        icon: <Wallet className="h-10 w-10" />,
        path: "/converti-valute",
        color: "bg-purple-50 text-tool-purple"
      }
    ]
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
        color: "bg-purple-50 text-tool-purple"
      },
      {
        name: "Generatore QR Code",
        description: "Crea QR code personalizzati per URL, testi, email e numeri di telefono",
        icon: <QrCode className="h-10 w-10" />,
        path: "/genera-qrcode",
        color: "bg-blue-50 text-tool-blue"
      },
      {
        name: "Generatore Lorem Ipsum",
        description: "Genera testo fittizio per i tuoi progetti di design",
        icon: <AlignLeft className="h-10 w-10" />,
        path: "/lorem-ipsum",
        color: "bg-red-50 text-tool-red"
      },
      {
        name: "Generatore colori",
        description: "Crea, converti e gestisci colori in diversi formati",
        icon: <Palette className="h-10 w-10" />,
        path: "/generatore-colori",
        color: "bg-purple-50 text-tool-purple"
      }
    ]
  },
  {
    id: "utility",
    name: "Utilità",
    tools: [
      {
        name: "Timer e Cronometro",
        description: "Strumenti per misurare il tempo con timer countdown e cronometro",
        icon: <Clock3 className="h-10 w-10" />,
        path: "/timer-cronometro",
        color: "bg-red-50 text-tool-red"
      },
      {
        name: "Condivisione wifi",
        description: "Genera QR code per condividere facilmente la rete wifi",
        icon: <Wifi className="h-10 w-10" />,
        path: "/condividi-wifi",
        color: "bg-blue-50 text-tool-blue"
      },
      {
        name: "Strumento disegno",
        description: "Canvas digitale per disegno a mano libera e sketch",
        icon: <PenTool className="h-10 w-10" />,
        path: "/strumento-disegno",
        color: "bg-purple-50 text-tool-purple"
      }
    ]
  },
  {
    id: "geografici",
    name: "Strumenti Geografici",
    tools: [
      {
        name: "Bussola",
        description: "Utilizza la bussola per orientarti e trovare il Nord magnetico",
        icon: <Compass className="h-10 w-10" />,
        path: "/bussola",
        color: "bg-blue-50 text-tool-blue"
      },
      {
        name: "Coordinate GPS",
        description: "Rileva e condividi la tua posizione GPS attuale",
        icon: <MapPin className="h-10 w-10" />,
        path: "/coordinate-gps",
        color: "bg-red-50 text-tool-red"
      },
      {
        name: "Calcolo distanza",
        description: "Misura la distanza tra due punti sulla mappa",
        icon: <Crosshair className="h-10 w-10" />,
        path: "/calcolo-distanza",
        color: "bg-green-50 text-tool-green"
      }
    ]
  }
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
            Strumenti online <span className="gradient-text">gratuiti</span> per le tue esigenze quotidiane
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
                <p className="text-gray-500 mt-2 mb-4 flex-grow">{tool.description}</p>
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
      
      <section className="mb-12">
        <h2 className="text-2xl font-medium mb-6">In Arrivo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="tool-card opacity-70">
            <div className="flex items-start">
              <div className="bg-blue-50 text-tool-blue p-3 rounded-md">
                <MessageSquare className="h-10 w-10" />
              </div>
            </div>
            <h3 className="text-xl font-medium mt-4">Traduttore testo</h3>
            <p className="text-gray-500 mt-2 mb-4 flex-grow">
              Traduci testi tra diverse lingue con traduzione automatica
            </p>
            <div className="flex justify-end mt-2">
              <Button variant="ghost" className="gap-1" disabled>
                Presto disponibile
              </Button>
            </div>
          </div>

          <div className="tool-card opacity-70">
            <div className="flex items-start">
              <div className="bg-green-50 text-tool-green p-3 rounded-md">
                <Download className="h-10 w-10" />
              </div>
            </div>
            <h3 className="text-xl font-medium mt-4">Download manager</h3>
            <p className="text-gray-500 mt-2 mb-4 flex-grow">
              Gestisci i download di file e archivi da varie fonti
            </p>
            <div className="flex justify-end mt-2">
              <Button variant="ghost" className="gap-1" disabled>
                Presto disponibile
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mt-16">
        <div className="bg-blue-50 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-medium mb-3">Tutti gli strumenti sono gratuiti</h2>
          <p className="text-gray-600 mb-4">
            Il nostro obiettivo è rendere accessibili a tutti strumenti online utili e di qualità. 
            Non è richiesta alcuna registrazione e tutti i dati vengono elaborati direttamente nel browser.
          </p>
          <Button variant="default">Esplora tutti gli strumenti</Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
