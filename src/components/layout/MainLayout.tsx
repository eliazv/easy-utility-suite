
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useSidebar } from "@/hooks/use-sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { close, isOpen } = useSidebar();
  
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
