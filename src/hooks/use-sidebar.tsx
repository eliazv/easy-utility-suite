
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type SidebarContextType = {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  // Inizializza isOpen in base alla larghezza dello schermo
  const [isOpen, setIsOpen] = useState(() => {
    // Su mobile parte chiuso, su desktop parte aperto
    return window.innerWidth >= 768;
  });

  // Aggiorna isOpen quando cambia la dimensione della finestra
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Su desktop, mantieni sempre la sidebar visibile
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggle = () => setIsOpen(prev => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
