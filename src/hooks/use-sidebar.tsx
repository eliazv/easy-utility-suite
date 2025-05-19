
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type SidebarContextType = {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  // Initialize isOpen based on screen width
  const [isOpen, setIsOpen] = useState(() => {
    // On desktop start open, on mobile start closed
    return window.innerWidth >= 768;
  });

  // Update isOpen when window size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Su desktop, mantieni sempre la sidebar visibile
        setIsOpen(true);
      } else {
        // On mobile, close sidebar when resizing to mobile
        setIsOpen(false);
      }
    };

    // Set initial state
    handleResize();

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
