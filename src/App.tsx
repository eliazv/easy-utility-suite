import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./hooks/use-sidebar";
import { Analytics } from "@vercel/analytics/react";

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
import PomodoroTimer from "./pages/tool-pages/PomodoroTimer";
import ColorPicker from "./pages/tool-pages/ColorPicker";
import CalcolaDifferenzaDate from "./pages/tool-pages/CalcolaDifferenzaDate";
import CalcolaMutuo from "./pages/tool-pages/CalcolaMutuo";
import GeneratoreNumeri from "./pages/tool-pages/GeneratoreNumeri";
import CalcolaArea from "./pages/tool-pages/CalcolaArea";
import CalcoloDistanza from "./pages/tool-pages/CalcoloDistanza";
import RimuoviSfondo from "./pages/tool-pages/RimuoviSfondo";

// Commenting out the components that are causing errors until they're properly implemented
// import Bussola from "./pages/tool-pages/Bussola";
// import CoordinateGPS from "./pages/tool-pages/CoordinateGPS";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Analytics />
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Documenti */}
            <Route path="/pdf-to-word" element={<PdfToWord />} />
            <Route path="/conta-caratteri" element={<ContaCaratteri />} />
            <Route path="/lorem-ipsum" element={<LoremIpsum />} />

            {/* Immagini */}
            <Route
              path="/ridimensiona-immagini"
              element={<RidimensionaImmagini />}
            />
            <Route path="/comprimi-immagini" element={<ComprimiImmagini />} />
            <Route path="/rimuovi-sfondo" element={<RimuoviSfondo />} />

            {/* Calcolatori */}
            <Route path="/calcola-sconto" element={<CalcolaSconto />} />
            <Route path="/calcola-bmi" element={<CalcolaBMI />} />
            <Route path="/calcola-mutuo" element={<CalcolaMutuo />} />
            <Route
              path="/calcola-differenza-date"
              element={<CalcolaDifferenzaDate />}
            />
            <Route path="/calcolo-distanza" element={<CalcoloDistanza />} />
            <Route path="/calcola-area" element={<CalcolaArea />} />

            {/* Convertitori */}
            <Route path="/converti-date" element={<ConvertiDate />} />
            <Route path="/converti-ore" element={<ConvertiOre />} />
            <Route path="/converti-valute" element={<ConvertiValute />} />

            {/* Sicurezza */}
            <Route path="/genera-password" element={<GeneraPassword />} />
            <Route path="/genera-qrcode" element={<GeneraQRCode />} />
            <Route path="/genera-numeri" element={<GeneratoreNumeri />} />

            {/* Utilità */}
            <Route path="/timer-cronometro" element={<TimerCronometro />} />
            <Route path="/timer-pomodoro" element={<PomodoroTimer />} />
            <Route path="/color-picker" element={<ColorPicker />} />

            {/* Strumenti geografici */}
            {/* Temporarily commenting out the routes that are causing errors */}
            {/* <Route path="/bussola" element={<Bussola />} /> */}
            {/* <Route path="/coordinate-gps" element={<CoordinateGPS />} /> */}

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Analytics />
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
