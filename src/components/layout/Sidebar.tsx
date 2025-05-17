
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { 
  FileText, Calculator, KeyRound, Image, 
  Percent, AlignLeft, X, Calendar, Clock,
  BarChart2, FileCode, FileSpreadsheet, FileImage,
  Clock3, QrCode, Wallet, Compass, Download
} from "lucide-react";

// Tool groups
const toolGroups = [
  {
    id: "documents",
    name: "Documenti",
    tools: [
      {
        name: "Convertitore file",
        icon: <FileText className="h-5 w-5" />,
        path: "/pdf-to-word",
        color: "text-tool-red"
      },
      {
        name: "Conta caratteri e parole",
        icon: <AlignLeft className="h-5 w-5" />,
        path: "/conta-caratteri",
        color: "text-tool-blue"
      },
      {
        name: "Generatore Lorem Ipsum",
        icon: <AlignLeft className="h-5 w-5" />,
        path: "/lorem-ipsum",
        color: "text-tool-purple"
      }
    ]
  },
  {
    id: "images",
    name: "Immagini",
    tools: [
      {
        name: "Ridimensiona immagini",
        icon: <Image className="h-5 w-5" />,
        path: "/ridimensiona-immagini",
        color: "text-tool-green"
      },
      {
        name: "Comprimi immagini",
        icon: <FileImage className="h-5 w-5" />,
        path: "/comprimi-immagini",
        color: "text-tool-green"
      }
    ]
  },
  {
    id: "calculators",
    name: "Calcolatori",
    tools: [
      {
        name: "Calcolatore percentuale",
        icon: <Percent className="h-5 w-5" />,
        path: "/calcola-sconto",
        color: "text-tool-orange"
      },
      {
        name: "Calcolatore BMI",
        icon: <BarChart2 className="h-5 w-5" />,
        path: "/calcola-bmi",
        color: "text-tool-orange"
      }
    ]
  },
  {
    id: "converters",
    name: "Convertitori",
    tools: [
      {
        name: "Convertitore date",
        icon: <Calendar className="h-5 w-5" />,
        path: "/converti-date",
        color: "text-tool-blue"
      },
      {
        name: "Convertitore ore",
        icon: <Clock className="h-5 w-5" />,
        path: "/converti-ore",
        color: "text-tool-green"
      },
      {
        name: "Convertitore valute",
        icon: <Wallet className="h-5 w-5" />,
        path: "/converti-valute",
        color: "text-tool-purple"
      }
    ]
  },
  {
    id: "security",
    name: "Sicurezza",
    tools: [
      {
        name: "Generatore password",
        icon: <KeyRound className="h-5 w-5" />,
        path: "/genera-password",
        color: "text-tool-purple"
      },
      {
        name: "Generatore QR Code",
        icon: <QrCode className="h-5 w-5" />,
        path: "/genera-qrcode",
        color: "text-tool-blue"
      }
    ]
  },
  {
    id: "utility",
    name: "Utilità",
    tools: [
      {
        name: "Timer e Cronometro",
        icon: <Clock3 className="h-5 w-5" />,
        path: "/timer-cronometro",
        color: "text-tool-red"
      }
    ]
  }
];

// Altri strumenti da aggiungere in futuro
const additionalToolGroups = [
  {
    id: "coming-soon",
    name: "In Arrivo",
    tools: [
      {
        name: "Bussola",
        icon: <Compass className="h-5 w-5" />,
        path: "/bussola",
        color: "text-tool-blue"
      },
      {
        name: "Download manager",
        icon: <Download className="h-5 w-5" />,
        path: "/download-manager",
        color: "text-tool-green"
      }
    ]
  }
];

const Sidebar = () => {
  const location = useLocation();
  const { isOpen, close } = useSidebar();
  
  return (
    <aside 
      className={cn(
        "fixed md:sticky inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background transition-transform duration-300",
        isOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-0 lg:w-64"
      )}
    >
      <div className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b bg-background px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl font-bold">
            <span className="gradient-text">Tool</span>Kit
          </span>
        </Link>
        <button 
          onClick={close}
          className="absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none md:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {toolGroups.map((group) => (
            <div className="px-3 py-2" key={group.id}>
              <h3 className="mb-2 text-sm font-medium">{group.name}</h3>
              <ul className="grid gap-1">
                {group.tools.map((tool) => (
                  <li key={tool.path}>
                    <Link
                      to={tool.path}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                        location.pathname === tool.path ? "bg-accent" : "transparent"
                      )}
                    >
                      <span className={cn("flex-shrink-0", tool.color)}>{tool.icon}</span>
                      <span>{tool.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {additionalToolGroups.map((group) => (
            <div className="px-3 py-2" key={group.id}>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">{group.name}</h3>
              <ul className="grid gap-1">
                {group.tools.map((tool) => (
                  <li key={tool.path}>
                    <span
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed"
                    >
                      <span className="flex-shrink-0 opacity-50">{tool.icon}</span>
                      <span>{tool.name}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="sticky bottom-0 p-4">
        <div className="ad-placeholder h-32">Spazio pubblicitario</div>
      </div>
    </aside>
  );
};

export default Sidebar;
