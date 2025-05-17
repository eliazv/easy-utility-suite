
import { Link } from "react-router-dom";
import { 
  FileText, Calculator, KeyRound, Image, 
  Percent, AlignLeft, ArrowRight, Calendar,
  Clock, BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

const tools = [
  {
    name: "Convertitore PDF in Word",
    description: "Converti facilmente i tuoi file PDF in documenti Word modificabili",
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
  },
  {
    name: "Generatore password",
    description: "Crea password sicure e personalizzate per i tuoi account",
    icon: <KeyRound className="h-10 w-10" />,
    path: "/genera-password",
    color: "bg-purple-50 text-tool-purple"
  },
  {
    name: "Ridimensiona immagini",
    description: "Modifica le dimensioni delle tue immagini senza perdere qualità",
    icon: <Image className="h-10 w-10" />,
    path: "/ridimensiona-immagini",
    color: "bg-green-50 text-tool-green"
  },
  {
    name: "Calcolatore sconto",
    description: "Calcola velocemente sconti e prezzi finali",
    icon: <Percent className="h-10 w-10" />,
    path: "/calcola-sconto",
    color: "bg-orange-50 text-tool-orange"
  },
  {
    name: "Generatore Lorem Ipsum",
    description: "Genera testo fittizio per i tuoi progetti di design",
    icon: <AlignLeft className="h-10 w-10" />,
    path: "/lorem-ipsum",
    color: "bg-purple-50 text-tool-purple"
  },
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
    name: "Calcolatore BMI",
    description: "Calcola il tuo Indice di Massa Corporea e scopri se sei nel range ideale",
    icon: <BarChart2 className="h-10 w-10" />,
    path: "/calcola-bmi",
    color: "bg-orange-50 text-tool-orange"
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
      
      <section>
        <h2 className="text-2xl font-medium mb-6">Strumenti Popolari</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
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
