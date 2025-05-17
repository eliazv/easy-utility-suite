
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <main className="flex-1 overflow-auto p-4 md:p-6 max-w-7xl mx-auto w-full">
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
