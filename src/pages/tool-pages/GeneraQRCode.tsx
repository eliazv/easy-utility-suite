
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { QrCode, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const GeneraQRCode = () => {
  const { toast } = useToast();
  const [qrType, setQrType] = useState<string>("url");
  const [url, setUrl] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [emailBody, setEmailBody] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [size, setSize] = useState<string>("200");
  const [color, setColor] = useState<string>("#000000");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [loading, setLoading] = useState<boolean>(false);
  const [qrImage, setQrImage] = useState<string | null>(null);

  // Genera il contenuto del QR code in base al tipo selezionato
  const generateQRContent = (): string => {
    switch (qrType) {
      case "url":
        return url;
      case "text":
        return text;
      case "email":
        let emailContent = `mailto:${email}`;
        if (emailSubject) emailContent += `?subject=${encodeURIComponent(emailSubject)}`;
        if (emailBody) emailContent += `${emailSubject ? "&" : "?"}body=${encodeURIComponent(emailBody)}`;
        return emailContent;
      case "phone":
        return `tel:${phone}`;
      default:
        return "";
    }
  };

  const generateQRCode = async () => {
    const content = generateQRContent();
    
    if (!content) {
      toast({
        title: "Errore",
        description: "Inserisci il contenuto per generare il QR Code",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simuliamo la generazione di un QR code
    setTimeout(() => {
      // In un'implementazione reale, qui useremmo una libreria per generare il QR code
      // Per ora simuliamo con un URL di esempio da un servizio online
      const encodedContent = encodeURIComponent(content);
      const colorHex = color.replace("#", "");
      const bgColorHex = bgColor.replace("#", "");
      
      // Usa un servizio di generazione QR online come placeholder
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedContent}&size=${size}x${size}&color=${colorHex}&bgcolor=${bgColorHex}`;
      
      setQrImage(qrCodeUrl);
      setLoading(false);
      
      toast({
        title: "QR Code generato",
        description: "Il tuo QR Code è stato generato con successo",
      });
    }, 1000);
  };

  const downloadQRCode = () => {
    if (!qrImage) return;
    
    // Crea un link per il download dell'immagine
    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `qrcode-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download avviato",
      description: "Il QR Code verrà scaricato a breve",
    });
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Generatore QR Code</h1>
        <p className="text-gray-600 mt-2">
          Crea QR Code personalizzati per URL, testo, email o numeri di telefono.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <Tabs value={qrType} onValueChange={setQrType} className="mb-6">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="text">Testo</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Telefono</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      placeholder="https://esempio.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="text" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="text">Testo</Label>
                    <Textarea
                      id="text"
                      placeholder="Inserisci il testo che vuoi codificare"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="email" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Indirizzo email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="esempio@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-subject">Oggetto (opzionale)</Label>
                    <Input
                      id="email-subject"
                      placeholder="Oggetto dell'email"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-body">Corpo (opzionale)</Label>
                    <Textarea
                      id="email-body"
                      placeholder="Corpo dell'email"
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="phone" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Numero di telefono</Label>
                    <Input
                      id="phone"
                      placeholder="+39 123 456 7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-medium mb-4">Personalizzazione</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="size">Dimensione (px)</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger id="size" className="mt-1">
                      <SelectValue placeholder="Seleziona dimensione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 x 100</SelectItem>
                      <SelectItem value="200">200 x 200</SelectItem>
                      <SelectItem value="300">300 x 300</SelectItem>
                      <SelectItem value="400">400 x 400</SelectItem>
                      <SelectItem value="500">500 x 500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="color">Colore</Label>
                  <div className="flex mt-1">
                    <Input
                      id="color"
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                    <Input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 ml-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bg-color">Colore sfondo</Label>
                  <div className="flex mt-1">
                    <Input
                      id="bg-color"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 p-1 h-10"
                    />
                    <Input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 ml-2"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                onClick={generateQRCode}
                disabled={loading}
                className="w-full py-6"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generazione in corso...
                  </>
                ) : (
                  <>
                    <QrCode className="mr-2 h-5 w-5" />
                    Genera QR Code
                  </>
                )}
              </Button>
            </div>
            
            {qrImage && (
              <div className="mt-6 flex flex-col items-center">
                <div className="border p-4 bg-gray-50 rounded-lg">
                  <img src={qrImage} alt="QR Code generato" className="max-w-full" />
                </div>
                <Button
                  onClick={downloadQRCode}
                  variant="outline"
                  className="mt-4"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Scarica QR Code
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-4">Cosa puoi fare con i QR Code</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  •
                </div>
                <span>Condividere rapidamente URL di siti web</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  •
                </div>
                <span>Aggiungere contatti alla rubrica</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  •
                </div>
                <span>Accedere facilmente a WiFi</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  •
                </div>
                <span>Condividere messaggi di testo o informazioni</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  •
                </div>
                <span>Avviare una chiamata telefonica</span>
              </li>
              <li className="flex gap-2">
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium">
                  •
                </div>
                <span>Inviare email precompilate</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-medium mb-4">Suggerimenti</h3>
            <p className="text-sm text-gray-600 mb-4">
              Per ottenere i migliori risultati con il tuo QR Code:
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Mantieni il contenuto breve per una scansione più affidabile</li>
              <li>• Usa colori con buon contrasto</li>
              <li>• Testa il QR Code prima di utilizzarlo</li>
              <li>• Scegli una dimensione adeguata all'uso che ne farai</li>
            </ul>
          </div>

          <div className="ad-placeholder h-60 mt-6">
            Spazio pubblicitario
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GeneraQRCode;
