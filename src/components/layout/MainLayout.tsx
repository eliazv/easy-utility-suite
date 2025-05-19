
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useSidebar } from "@/hooks/use-sidebar";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { close, isOpen, toggle } = useSidebar();
  
  // Only close sidebar on route change in mobile mode if it's actually open
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && isOpen) {
      close();
    }
  }, [location.pathname, close, isOpen]);

  // Prevent body scrolling when mobile sidebar is open
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggle} 
          className="fixed bottom-4 right-4 z-50 rounded-full shadow-md md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <footer className="p-4 text-center text-sm text-gray-500 border-t">
          <p>© {new Date().getFullYear()} ToolKit - Tutti i diritti riservati</p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
