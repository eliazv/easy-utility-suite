
import { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, Play, Pause, RotateCcw, Bell, List } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TimerCronometro = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("timer");
  
  // Timer state
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerTimeLeft, setTimerTimeLeft] = useState<number>(0);
  const timerIntervalRef = useRef<number | null>(null);
  
  // Cronometro state
  const [stopwatchTime, setStopwatchTime] = useState<number>(0);
  const [stopwatchRunning, setStopwatchRunning] = useState<boolean>(false);
  const stopwatchIntervalRef = useRef<number | null>(null);
  const [laps, setLaps] = useState<number[]>([]);
  
  // Effetto sonoro
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    
    return () => {
      // Pulizia degli intervalli quando il componente viene smontato
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    };
  }, []);
  
  // Timer functions
  const startTimer = () => {
    if (hours === 0 && minutes === 0 && seconds === 0) {
      toast({
        title: "Timer non impostato",
        description: "Imposta un tempo prima di avviare il timer",
        variant: "destructive",
      });
      return;
    }
    
    if (timerRunning) return;
    
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setTimerTimeLeft(totalSeconds);
    setTimerRunning(true);
    
    timerIntervalRef.current = window.setInterval(() => {
      setTimerTimeLeft(prev => {
        if (prev <= 1) {
          // Timer finito
          clearInterval(timerIntervalRef.current!);
          setTimerRunning(false);
          playAlarm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const pauseTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      setTimerRunning(false);
    }
  };
  
  const resetTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setTimerRunning(false);
    setTimerTimeLeft(0);
  };
  
  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.play();
      
      toast({
        title: "Timer completato!",
        description: "Il tempo impostato è terminato.",
      });
    }
  };
  
  // Stopwatch functions
  const startStopwatch = () => {
    if (stopwatchRunning) return;
    
    setStopwatchRunning(true);
    const startTime = Date.now() - stopwatchTime;
    
    stopwatchIntervalRef.current = window.setInterval(() => {
      setStopwatchTime(Date.now() - startTime);
    }, 10);
  };
  
  const pauseStopwatch = () => {
    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current);
      setStopwatchRunning(false);
    }
  };
  
  const resetStopwatch = () => {
    if (stopwatchIntervalRef.current) {
      clearInterval(stopwatchIntervalRef.current);
    }
    setStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  };
  
  const addLap = () => {
    if (stopwatchRunning) {
      setLaps(prevLaps => [...prevLaps, stopwatchTime]);
    }
  };
  
  // Formatting functions
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  const formatStopwatchTime = (timeMs: number): string => {
    const ms = Math.floor((timeMs % 1000) / 10).toString().padStart(2, '0');
    const seconds = Math.floor((timeMs / 1000) % 60).toString().padStart(2, '0');
    const minutes = Math.floor((timeMs / (1000 * 60)) % 60).toString().padStart(2, '0');
    const hours = Math.floor(timeMs / (1000 * 60 * 60)).toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}.${ms}`;
  };

  return (
    <MainLayout>
      <div className="tool-header">
        <h1>Timer e Cronometro</h1>
        <p className="text-gray-600 mt-2">
          Strumento per misurare il tempo con timer countdown e cronometro preciso.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-6">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="timer">Timer</TabsTrigger>
                <TabsTrigger value="stopwatch">Cronometro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="timer" className="mt-6">
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="text-6xl font-mono font-bold mb-8">
                      {formatTime(timerTimeLeft)}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-md">
                      <div>
                        <Label htmlFor="hours">Ore</Label>
                        <Input
                          id="hours"
                          type="number"
                          min="0"
                          max="23"
                          value={hours}
                          onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                          disabled={timerRunning}
                          className="text-center"
                        />
                      </div>
                      <div>
                        <Label htmlFor="minutes">Minuti</Label>
                        <Input
                          id="minutes"
                          type="number"
                          min="0"
                          max="59"
                          value={minutes}
                          onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                          disabled={timerRunning}
                          className="text-center"
                        />
                      </div>
                      <div>
                        <Label htmlFor="seconds">Secondi</Label>
                        <Input
                          id="seconds"
                          type="number"
                          min="0"
                          max="59"
                          value={seconds}
                          onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                          disabled={timerRunning}
                          className="text-center"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      {!timerRunning ? (
                        <Button 
                          size="lg" 
                          onClick={startTimer}
                          className="w-32"
                        >
                          <Play className="mr-2 h-5 w-5" />
                          Avvia
                        </Button>
                      ) : (
                        <Button 
                          size="lg" 
                          onClick={pauseTimer}
                          variant="secondary"
                          className="w-32"
                        >
                          <Pause className="mr-2 h-5 w-5" />
                          Pausa
                        </Button>
                      )}
                      <Button 
                        size="lg" 
                        variant="outline" 
                        onClick={resetTimer}
                        className="w-32"
                      >
                        <RotateCcw className="mr-2 h-5 w-5" />
                        Azzera
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-8 border-t pt-6">
                    <h3 className="font-medium mb-4">Timer predefiniti</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setHours(0);
                          setMinutes(1);
                          setSeconds(0);
                        }}
                        disabled={timerRunning}
                      >
                        1 minuto
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setHours(0);
                          setMinutes(5);
                          setSeconds(0);
                        }}
                        disabled={timerRunning}
                      >
                        5 minuti
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setHours(0);
                          setMinutes(10);
                          setSeconds(0);
                        }}
                        disabled={timerRunning}
                      >
                        10 minuti
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setHours(0);
                          setMinutes(25);
                          setSeconds(0);
                        }}
                        disabled={timerRunning}
                      >
                        25 minuti
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setHours(1);
                          setMinutes(0);
                          setSeconds(0);
                        }}
                        disabled={timerRunning}
                      >
                        1 ora
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="stopwatch" className="mt-6">
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="text-6xl font-mono font-bold mb-8">
                      {formatStopwatchTime(stopwatchTime)}
                    </div>
                    
                    <div className="flex space-x-4 mb-8">
                      {!stopwatchRunning ? (
                        <Button 
                          size="lg" 
                          onClick={startStopwatch}
                          className="w-32"
                        >
                          <Play className="mr-2 h-5 w-5" />
                          Avvia
                        </Button>
                      ) : (
                        <Button 
                          size="lg" 
                          onClick={pauseStopwatch}
                          variant="secondary"
                          className="w-32"
                        >
                          <Pause className="mr-2 h-5 w-5" />
                          Pausa
                        </Button>
                      )}
                      
                      <Button 
                        size="lg" 
                        variant="outline" 
                        onClick={resetStopwatch}
                        className="w-32"
                      >
                        <RotateCcw className="mr-2 h-5 w-5" />
                        Azzera
                      </Button>
                      
                      <Button 
                        size="lg" 
                        onClick={addLap}
                        disabled={!stopwatchRunning}
                        variant="ghost"
                        className="w-32"
                      >
                        <List className="mr-2 h-5 w-5" />
                        Giro
                      </Button>
                    </div>
                    
                    {laps.length > 0 && (
                      <div className="w-full max-w-md">
                        <h3 className="font-medium mb-2">Giri</h3>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left">
                                <th className="pb-2">#</th>
                                <th className="pb-2">Tempo giro</th>
                                <th className="pb-2 text-right">Tempo totale</th>
                              </tr>
                            </thead>
                            <tbody>
                              {laps.map((lapTime, index) => {
                                const lapDiff = index > 0 ? lapTime - laps[index - 1] : lapTime;
                                return (
                                  <tr key={index} className="border-t border-gray-200">
                                    <td className="py-2">{laps.length - index}</td>
                                    <td className="py-2">{formatStopwatchTime(lapDiff)}</td>
                                    <td className="py-2 text-right">{formatStopwatchTime(lapTime)}</td>
                                  </tr>
                                );
                              }).reverse()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h3 className="font-medium mb-4">
              {activeTab === "timer" ? "Informazioni sul timer" : "Informazioni sul cronometro"}
            </h3>
            
            {activeTab === "timer" ? (
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  Il timer è utile per impostare un conto alla rovescia per varie attività:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Cottura di cibi</li>
                  <li>Tecnica del Pomodoro per lo studio/lavoro</li>
                  <li>Esercizi fisici a tempo</li>
                  <li>Promemoria per attività quotidiane</li>
                </ul>
                <p className="mt-4">
                  Alla fine del conto alla rovescia, verrà riprodotto un suono di notifica.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  Il cronometro permette di misurare il tempo trascorso con precisione al centesimo di secondo:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Tempi di corsa o attività sportive</li>
                  <li>Misurazione di performance</li>
                  <li>Gare di velocità</li>
                  <li>Registrazione di più giri con la funzione "Lap"</li>
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-medium mb-4">Suggerimenti</h3>
            {activeTab === "timer" ? (
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2 items-start">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium mt-0.5">
                    •
                  </div>
                  <span>Usa i timer predefiniti per impostare rapidamente tempi comuni</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium mt-0.5">
                    •
                  </div>
                  <span>Assicurati che il volume del dispositivo sia attivo per sentire l'allarme</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium mt-0.5">
                    •
                  </div>
                  <span>Per la tecnica Pomodoro, imposta 25 minuti di lavoro e 5 di pausa</span>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2 items-start">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium mt-0.5">
                    •
                  </div>
                  <span>Usa il pulsante "Giro" per registrare tempi intermedi senza fermare il cronometro</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium mt-0.5">
                    •
                  </div>
                  <span>I giri vengono ordinati dal più recente al più vecchio</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center font-medium mt-0.5">
                    •
                  </div>
                  <span>Il tempo del giro mostra la durata dell'intervallo, non il tempo totale</span>
                </li>
              </ul>
            )}
          </div>

          <div className="ad-placeholder h-60 mt-6">
            Spazio pubblicitario
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TimerCronometro;
