
import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Calculator } from "lucide-react";
import { format, differenceInDays, differenceInMonths, differenceInYears, addDays, isBefore } from "date-fns";
import { it } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import MainLayout from "@/components/layout/MainLayout";

const CalcolaDifferenzaDate = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));
  const [tab, setTab] = useState<string>("difference");

  const calculateDifference = () => {
    if (isBefore(endDate, startDate)) {
      return {
        days: differenceInDays(startDate, endDate) * -1,
        months: differenceInMonths(startDate, endDate) * -1,
        years: differenceInYears(startDate, endDate) * -1
      };
    }
    
    return {
      days: differenceInDays(endDate, startDate),
      months: differenceInMonths(endDate, startDate),
      years: differenceInYears(endDate, startDate)
    };
  };

  const difference = calculateDifference();
  const totalDays = Math.abs(difference.days);
  const remainingMonths = Math.abs(difference.months) % 12;
  const years = Math.abs(difference.years);
  
  const swapDates = () => {
    const temp = startDate;
    setStartDate(endDate);
    setEndDate(temp);
  };
  
  const getBusinessDays = (start: Date, end: Date) => {
    let count = 0;
    const curDate = new Date(start.getTime());
    while (curDate <= end) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  };
  
  const businessDays = getBusinessDays(
    isBefore(startDate, endDate) ? startDate : endDate,
    isBefore(startDate, endDate) ? endDate : startDate
  );
  
  const getFormattedDate = (date: Date) => {
    return format(date, "EEEE d MMMM yyyy", { locale: it });
  };
  
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Calcola Differenza tra Date</h1>
        <p className="text-gray-600 mb-6">
          Calcola il tempo esatto tra due date, in giorni, settimane, mesi e anni.
        </p>
        
        <Tabs value={tab} onValueChange={setTab} className="mb-6">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="difference">Differenza tra date</TabsTrigger>
            <TabsTrigger value="add">Aggiungi/Sottrai giorni</TabsTrigger>
          </TabsList>
          
          <TabsContent value="difference">
            <Card>
              <CardHeader>
                <CardTitle>Seleziona due date</CardTitle>
                <CardDescription>
                  Scegli una data di inizio e una di fine per calcolare la differenza
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Data di inizio</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="start-date"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(startDate, "PPP", { locale: it })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => date && setStartDate(date)}
                          initialFocus
                          locale={it}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end-date">Data di fine</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="end-date"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(endDate, "PPP", { locale: it })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => date && setEndDate(date)}
                          initialFocus
                          locale={it}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={swapDates}
                >
                  Inverti le date
                </Button>
                
                <div className="mt-6 space-y-4">
                  <h3 className="font-medium text-lg">Risultato</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">Da: {getFormattedDate(startDate)}</p>
                    <p className="font-medium">A: {getFormattedDate(endDate)}</p>
                    <p className="font-medium mt-4">
                      La differenza è di:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>{totalDays} {totalDays === 1 ? 'giorno' : 'giorni'}</li>
                      {totalDays >= 7 && (
                        <li>{Math.floor(totalDays / 7)} {Math.floor(totalDays / 7) === 1 ? 'settimana' : 'settimane'} e {totalDays % 7} {totalDays % 7 === 1 ? 'giorno' : 'giorni'}</li>
                      )}
                      {difference.months >= 1 && (
                        <li>{difference.months} {difference.months === 1 ? 'mese' : 'mesi'} e {Math.floor(totalDays - (difference.months * 30))} {Math.floor(totalDays - (difference.months * 30)) === 1 ? 'giorno' : 'giorni'}</li>
                      )}
                      {difference.years >= 1 && (
                        <li>{years} {years === 1 ? 'anno' : 'anni'}, {remainingMonths} {remainingMonths === 1 ? 'mese' : 'mesi'}</li>
                      )}
                    </ul>
                    
                    <div className="mt-4">
                      <p><strong>Giorni lavorativi:</strong> {businessDays}</p>
                      <p><strong>Giorni di weekend:</strong> {totalDays - businessDays}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Aggiungi o sottrai giorni</CardTitle>
                <CardDescription>
                  Calcola una nuova data aggiungendo o sottraendo un numero di giorni
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Implementation would go here */}
                <p className="text-center py-10 text-muted-foreground">
                  Questa funzionalità sarà disponibile presto
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Date significative</CardTitle>
            <CardDescription>
              Alcune informazioni sulle date selezionate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Data di inizio</h3>
                <ul className="space-y-1">
                  <li><strong>Giorno dell'anno:</strong> {format(startDate, 'D', { locale: it })} di {format(new Date(startDate.getFullYear(), 11, 31), 'D', { locale: it })}</li>
                  <li><strong>Settimana dell'anno:</strong> {format(startDate, 'w', { locale: it })}</li>
                  <li><strong>Trimestre:</strong> {Math.floor(startDate.getMonth() / 3) + 1}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Data di fine</h3>
                <ul className="space-y-1">
                  <li><strong>Giorno dell'anno:</strong> {format(endDate, 'D', { locale: it })} di {format(new Date(endDate.getFullYear(), 11, 31), 'D', { locale: it })}</li>
                  <li><strong>Settimana dell'anno:</strong> {format(endDate, 'w', { locale: it })}</li>
                  <li><strong>Trimestre:</strong> {Math.floor(endDate.getMonth() / 3) + 1}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CalcolaDifferenzaDate;
