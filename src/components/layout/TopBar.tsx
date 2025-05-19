
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import DonationModal from "@/components/DonationModal";

const TopBar = () => {
  const { toggle } = useSidebar();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [showDonationModal, setShowDonationModal] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace spaces with hyphens and convert to lowercase
    const formattedSearch = searchValue.toLowerCase().replace(/\s+/g, "-");
    
    // Check if the search matches a route
    if (formattedSearch) {
      // Try to navigate to the route
      navigate(`/${formattedSearch}`);
      // Clear the search input
      setSearchValue("");
    }
  };

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Mobile sidebar toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <form onSubmit={handleSearch} className="flex-1 md:flex-initial md:w-64 lg:w-96">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca uno strumento..."
              className="pl-8"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </form>
        
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowDonationModal(true)}
          >
            Supportaci
          </Button>
        </div>

        {/* Donation Modal */}
        <DonationModal 
          open={showDonationModal} 
          onOpenChange={setShowDonationModal} 
        />
      </div>
    </header>
  );
};

export default TopBar;
