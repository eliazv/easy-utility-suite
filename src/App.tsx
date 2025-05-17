
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./hooks/use-sidebar";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PdfToWord from "./pages/tool-pages/PdfToWord";
import ContaCaratteri from "./pages/tool-pages/ContaCaratteri";
import GeneraPassword from "./pages/tool-pages/GeneraPassword";
import RidimensionaImmagini from "./pages/tool-pages/RidimensionaImmagini";
import CalcolaSconto from "./pages/tool-pages/CalcolaSconto";
import LoremIpsum from "./pages/tool-pages/LoremIpsum";
import ConvertiDate from "./pages/tool-pages/ConvertiDate";
import ConvertiOre from "./pages/tool-pages/ConvertiOre";
import CalcolaBMI from "./pages/tool-pages/CalcolaBMI";
import ConvertiValute from "./pages/tool-pages/ConvertiValute";
import GeneraQRCode from "./pages/tool-pages/GeneraQRCode";
import ComprimiImmagini from "./pages/tool-pages/ComprimiImmagini";
import TimerCronometro from "./pages/tool-pages/TimerCronometro";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Documenti */}
            <Route path="/pdf-to-word" element={<PdfToWord />} />
            <Route path="/conta-caratteri" element={<ContaCaratteri />} />
            <Route path="/lorem-ipsum" element={<LoremIpsum />} />
            
            {/* Immagini */}
            <Route path="/ridimensiona-immagini" element={<RidimensionaImmagini />} />
            <Route path="/comprimi-immagini" element={<ComprimiImmagini />} />
            
            {/* Calcolatori */}
            <Route path="/calcola-sconto" element={<CalcolaSconto />} />
            <Route path="/calcola-bmi" element={<CalcolaBMI />} />
            
            {/* Convertitori */}
            <Route path="/converti-date" element={<ConvertiDate />} />
            <Route path="/converti-ore" element={<ConvertiOre />} />
            <Route path="/converti-valute" element={<ConvertiValute />} />
            
            {/* Sicurezza */}
            <Route path="/genera-password" element={<GeneraPassword />} />
            <Route path="/genera-qrcode" element={<GeneraQRCode />} />
            
            {/* Utilità */}
            <Route path="/timer-cronometro" element={<TimerCronometro />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
