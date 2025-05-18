
import { Menu, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";

const TopBar = () => {
  const { toggle, isOpen } = useSidebar();

  return (
    <div className="sticky top-0 z-10 border-b bg-background px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggle} 
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 md:hidden">
          <span className="font-bold text-xl">
            <span className="gradient-text">Tool</span>Kit
          </span>
        </div>
      </div>

      <div className="ad-placeholder h-10 flex-1 max-w-xl mx-6 hidden md:flex">
        Banner pubblicitario
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-300">
          <DollarSign className="h-4 w-4" />
          <span className="hidden sm:inline">Donazione</span>
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
