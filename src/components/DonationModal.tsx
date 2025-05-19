
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DONATION_AMOUNTS = [
  { value: "5", label: "€5" },
  { value: "10", label: "€10" },
  { value: "25", label: "€25" },
  { value: "50", label: "€50" },
  { value: "100", label: "€100" },
  { value: "custom", label: "Altro importo" }
];

export const DonationModal = ({ open, onOpenChange }: DonationModalProps) => {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState("10");
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDonate = () => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
      
      toast({
        title: "Grazie per la tua donazione!",
        description: "La tua generosità ci aiuta a mantenere i nostri strumenti gratuiti per tutti."
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sostieni il nostro progetto</DialogTitle>
          <DialogDescription>
            La tua donazione ci aiuta a mantenere questi strumenti gratuiti e a sviluppare nuove funzionalità.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={selectedAmount} onValueChange={setSelectedAmount}>
            <div className="grid grid-cols-2 gap-4">
              {DONATION_AMOUNTS.map((amount) => (
                <div key={amount.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={amount.value} id={`amount-${amount.value}`} />
                  <Label htmlFor={`amount-${amount.value}`}>{amount.label}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          
          {selectedAmount === "custom" && (
            <div className="mt-4">
              <Label htmlFor="custom-amount">Importo personalizzato (€)</Label>
              <div className="flex items-center mt-1">
                <span className="mr-2">€</span>
                <input
                  type="number"
                  id="custom-amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Inserisci un importo"
                  min="1"
                  step="1"
                />
              </div>
            </div>
          )}
          
          <div className="mt-6 space-y-2">
            <div className="bg-blue-50 p-3 rounded-md">
              <h4 className="font-medium text-blue-700">Il tuo supporto è importante</h4>
              <p className="text-sm text-blue-600">Tutte le donazioni vengono utilizzate per il mantenimento e lo sviluppo della piattaforma.</p>
            </div>
            
            <div className="text-sm text-gray-500">
              Accettiamo pagamenti tramite carta di credito, PayPal e bonifico bancario.
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annulla</Button>
          <Button onClick={handleDonate} disabled={isProcessing}>
            {isProcessing ? "Elaborazione..." : "Dona ora"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
