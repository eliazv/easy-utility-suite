
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { 
  FileText, Calculator, KeyRound, Image, 
  Percent, List, BarChart2, AlignLeft, 
  X, Calendar, Clock
} from "lucide-react";

const tools = [
  {
    name: "Convertitore PDF in Word",
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
    name: "Generatore password",
    icon: <KeyRound className="h-5 w-5" />,
    path: "/genera-password",
    color: "text-tool-purple"
  },
  {
    name: "Ridimensiona immagini",
    icon: <Image className="h-5 w-5" />,
    path: "/ridimensiona-immagini",
    color: "text-tool-green"
  },
  {
    name: "Calcolatore sconto",
    icon: <Percent className="h-5 w-5" />,
    path: "/calcola-sconto",
    color: "text-tool-orange"
  },
  {
    name: "Generatore Lorem Ipsum",
    icon: <AlignLeft className="h-5 w-5" />,
    path: "/lorem-ipsum",
    color: "text-tool-purple"
  }
];

// Altri strumenti da aggiungere in futuro
const additionalTools = [
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
    name: "Calcolatore BMI",
    icon: <BarChart2 className="h-5 w-5" />,
    path: "/calcola-bmi",
    color: "text-tool-orange"
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
          <div className="px-3 py-2">
            <h3 className="mb-2 text-sm font-medium">Strumenti</h3>
            <ul className="grid gap-1">
              {tools.map((tool) => (
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
          
          <div className="px-3 py-2">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">In Arrivo</h3>
            <ul className="grid gap-1">
              {additionalTools.map((tool) => (
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
        </nav>
      </div>

      <div className="sticky bottom-0 p-4">
        <div className="ad-placeholder h-32">Spazio pubblicitario</div>
      </div>
    </aside>
  );
};

export default Sidebar;
