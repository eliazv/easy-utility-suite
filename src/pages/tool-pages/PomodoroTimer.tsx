
import { useState, useEffect } from "react";
import { AlertCircle, Play, Pause, RotateCcw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MainLayout from "@/components/layout/MainLayout";

const PomodoroTimer = () => {
  const [mode, setMode] = useState<"pomodoro" | "shortBreak" | "longBreak">("pomodoro");
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [settings, setSettings] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15
  });
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && time > 0) {
      interval = window.setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      setIsActive(false);
      
      // Notify when timer ends
      if (Notification.permission === "granted") {
        new Notification("Pomodoro Timer", {
          body: `Il tuo ${mode === "pomodoro" ? "pomodoro" : "riposo"} è terminato!`,
          icon: "/favicon.ico"
        });
      }
      
      // Auto switch to next mode
      if (mode === "pomodoro") {
        const newCycles = cycles + 1;
        setCycles(newCycles);
        if (newCycles % 4 === 0) {
          setMode("longBreak");
          setTime(settings.longBreak * 60);
        } else {
          setMode("shortBreak");
          setTime(settings.shortBreak * 60);
        }
      } else {
        setMode("pomodoro");
        setTime(settings.pomodoro * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, time, mode, settings, cycles]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    switch (mode) {
      case "pomodoro":
        setTime(settings.pomodoro * 60);
        break;
      case "shortBreak":
        setTime(settings.shortBreak * 60);
        break;
      case "longBreak":
        setTime(settings.longBreak * 60);
        break;
    }
  };

  const switchMode = (newMode: "pomodoro" | "shortBreak" | "longBreak") => {
    setIsActive(false);
    setMode(newMode);
    
    switch (newMode) {
      case "pomodoro":
        setTime(settings.pomodoro * 60);
        break;
      case "shortBreak":
        setTime(settings.shortBreak * 60);
        break;
      case "longBreak":
        setTime(settings.longBreak * 60);
        break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const updateSetting = (key: keyof typeof settings, value: number) => {
    setSettings({
      ...settings,
      [key]: value
    });
    
    // Update current timer if it matches the setting being changed
    if (mode === key) {
      setTime(value * 60);
    }
  };

  const requestNotificationPermission = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    // Request notification permission on component mount
    requestNotificationPermission();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Timer Pomodoro</h1>
        <p className="text-gray-600 mb-6">
          Usa il metodo Pomodoro per migliorare la tua produttività: lavora per 25 minuti e poi fai una pausa breve.
        </p>
        
        <Tabs value={mode} onValueChange={(v) => switchMode(v as any)}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
            <TabsTrigger value="shortBreak">Pausa Breve</TabsTrigger>
            <TabsTrigger value="longBreak">Pausa Lunga</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className={`text-center p-8 rounded-lg mb-6 bg-opacity-10 ${
          mode === "pomodoro" ? "bg-red-100" : 
          mode === "shortBreak" ? "bg-green-100" : "bg-blue-100"
        }`}>
          <h2 className="text-6xl font-bold mb-8">{formatTime(time)}</h2>
          
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={toggleTimer}
              className={isActive ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}
            >
              {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {isActive ? "Pausa" : "Avvia"}
            </Button>
            
            <Button variant="outline" size="lg" onClick={resetTimer}>
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Cicli completati: {Math.floor(cycles / 4)}</h3>
          <p className="text-sm text-gray-600">Pomodoro corrente: {(cycles % 4) + 1}/4</p>
        </div>

        <div className="space-y-6 mb-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Durata Pomodoro: {settings.pomodoro} min
            </label>
            <Slider
              value={[settings.pomodoro]}
              onValueChange={(value) => updateSetting("pomodoro", value[0])}
              min={5}
              max={60}
              step={1}
              className="my-4"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">
              Durata Pausa Breve: {settings.shortBreak} min
            </label>
            <Slider
              value={[settings.shortBreak]}
              onValueChange={(value) => updateSetting("shortBreak", value[0])}
              min={1}
              max={15}
              step={1}
              className="my-4"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">
              Durata Pausa Lunga: {settings.longBreak} min
            </label>
            <Slider
              value={[settings.longBreak]}
              onValueChange={(value) => updateSetting("longBreak", value[0])}
              min={5}
              max={30}
              step={1}
              className="my-4"
            />
          </div>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Cos'è il metodo Pomodoro?</AlertTitle>
          <AlertDescription>
            Il metodo Pomodoro è una tecnica di gestione del tempo che utilizza timer per suddividere 
            il lavoro in intervalli di 25 minuti, separati da brevi pause. Dopo 4 "pomodori" si fa una 
            pausa più lunga. Questo metodo aiuta a mantenere la concentrazione e a combattere l'affaticamento mentale.
          </AlertDescription>
        </Alert>
      </div>
    </MainLayout>
  );
};

export default PomodoroTimer;
