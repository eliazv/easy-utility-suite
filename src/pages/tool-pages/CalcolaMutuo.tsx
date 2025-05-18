
import { useState, useEffect } from "react";
import { Calculator, Download, FileSpreadsheet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MainLayout from "@/components/layout/MainLayout";

// Area Chart for the payment breakdown
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type LoanType = "mortgage" | "personal" | "car";
type PaymentFrequency = "monthly" | "biweekly" | "weekly";

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: Array<{
    paymentNumber: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }>;
}

const CalcolaMutuo = () => {
  // Loan parameters
  const [loanType, setLoanType] = useState<LoanType>("mortgage");
  const [loanAmount, setLoanAmount] = useState<number>(150000);
  const [interestRate, setInterestRate] = useState<number>(3.5);
  const [loanTerm, setLoanTerm] = useState<number>(25);
  const [paymentFrequency] = useState<PaymentFrequency>("monthly");
  const [downPayment, setDownPayment] = useState<number>(30000);
  
  // Results
  const [results, setResults] = useState<LoanResult | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  
  // Chart data for visualization
  const [chartData, setChartData] = useState<any[]>([]);

  const calculateLoan = () => {
    const principal = loanAmount - downPayment;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Monthly payment calculation using the formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const x = Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const monthlyPayment = (principal * x * monthlyInterestRate) / (x - 1);
    
    // Calculate amortization schedule
    const schedule = [];
    let remainingBalance = principal;
    
    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      
      schedule.push({
        paymentNumber: i,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: Math.max(0, remainingBalance),
      });
    }
    
    const result: LoanResult = {
      monthlyPayment,
      totalPayment: monthlyPayment * numberOfPayments,
      totalInterest: (monthlyPayment * numberOfPayments) - principal,
      amortizationSchedule: schedule,
    };
    
    setResults(result);
    
    // Generate chart data - sample years
    const newChartData = [];
    const yearsToSample = loanTerm > 10 ? Math.floor(loanTerm / 5) : loanTerm;
    
    for (let year = 0; year <= loanTerm; year += yearsToSample) {
      const paymentIndex = year * 12 - 1;
      if (paymentIndex < 0) {
        newChartData.push({
          year: 0,
          remainingBalance: principal,
          totalPaid: 0,
          totalInterest: 0,
        });
        continue;
      }
      
      if (paymentIndex >= schedule.length) continue;
      
      const totalPaid = (year * 12) * monthlyPayment;
      const totalInterest = totalPaid - (principal - schedule[paymentIndex].remainingBalance);
      
      newChartData.push({
        year,
        remainingBalance: schedule[paymentIndex].remainingBalance,
        totalPaid,
        totalInterest,
      });
    }
    
    // Ensure the final year is included
    const finalYear = {
      year: loanTerm,
      remainingBalance: 0,
      totalPaid: result.totalPayment,
      totalInterest: result.totalInterest,
    };
    
    // Remove any duplicates of the final year and add it
    const filteredData = newChartData.filter(item => item.year !== loanTerm);
    setChartData([...filteredData, finalYear]);
  };
  
  // Recalculate when parameters change
  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm, downPayment]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Calcola Mutuo o Prestito</h1>
        <p className="text-gray-600 mb-6">
          Calcola le rate mensili, gli interessi totali e visualizza un piano di ammortamento dettagliato.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="mortgage">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="mortgage" onClick={() => setLoanType("mortgage")}>
                      Mutuo
                    </TabsTrigger>
                    <TabsTrigger value="personal" onClick={() => setLoanType("personal")}>
                      Prestito
                    </TabsTrigger>
                    <TabsTrigger value="car" onClick={() => setLoanType("car")}>
                      Auto
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="mortgage" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="loan-amount">Importo del mutuo (€)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="loan-amount"
                          type="number"
                          min="1000"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(Number(e.target.value))}
                          className="flex-1"
                        />
                      </div>
                      <Slider
                        min={10000}
                        max={1000000}
                        step={1000}
                        value={[loanAmount]}
                        onValueChange={(value) => setLoanAmount(value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="down-payment">Anticipo (€)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="down-payment"
                          type="number"
                          min="0"
                          value={downPayment}
                          onChange={(e) => setDownPayment(Number(e.target.value))}
                          className="flex-1"
                        />
                      </div>
                      <Slider
                        min={0}
                        max={loanAmount * 0.8}
                        step={1000}
                        value={[downPayment]}
                        onValueChange={(value) => setDownPayment(value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="interest-rate">Tasso di interesse (%)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="interest-rate"
                          type="number"
                          min="0.1"
                          max="20"
                          step="0.1"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className="flex-1"
                        />
                      </div>
                      <Slider
                        min={0.1}
                        max={10}
                        step={0.1}
                        value={[interestRate]}
                        onValueChange={(value) => setInterestRate(value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="loan-term">Durata (anni)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="loan-term"
                          type="number"
                          min="1"
                          max="40"
                          value={loanTerm}
                          onChange={(e) => setLoanTerm(Number(e.target.value))}
                          className="flex-1"
                        />
                      </div>
                      <Slider
                        min={1}
                        max={40}
                        step={1}
                        value={[loanTerm]}
                        onValueChange={(value) => setLoanTerm(value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="payment-frequency">Frequenza pagamenti</Label>
                      <Select defaultValue={paymentFrequency} disabled>
                        <SelectTrigger id="payment-frequency">
                          <SelectValue placeholder="Frequenza pagamenti" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Mensile</SelectItem>
                          <SelectItem value="biweekly">Quindicinale</SelectItem>
                          <SelectItem value="weekly">Settimanale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="personal">
                    <div className="text-center py-10 text-muted-foreground">
                      Simile alla scheda Mutuo con parametri adeguati ai prestiti personali
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="car">
                    <div className="text-center py-10 text-muted-foreground">
                      Simile alla scheda Mutuo con parametri adeguati ai finanziamenti auto
                    </div>
                  </TabsContent>
                </Tabs>
                
                <Button className="w-full mt-4" onClick={calculateLoan}>
                  <Calculator className="mr-2 h-4 w-4" />
                  Calcola
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            {results && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-gray-500">Rata mensile</h3>
                        <p className="text-2xl font-bold mt-1">
                          {formatCurrency(results.monthlyPayment)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-gray-500">Totale da pagare</h3>
                        <p className="text-2xl font-bold mt-1">
                          {formatCurrency(results.totalPayment)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-gray-500">Interessi totali</h3>
                        <p className="text-2xl font-bold mt-1">
                          {formatCurrency(results.totalInterest)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="overflow-hidden">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Grafico dell'ammortamento</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis
                            tickFormatter={(value) => 
                              new Intl.NumberFormat('it-IT', {
                                notation: 'compact',
                                compactDisplay: 'short',
                                style: 'currency',
                                currency: 'EUR'
                              }).format(value)
                            }
                          />
                          <Tooltip 
                            formatter={(value) => formatCurrency(Number(value))}
                            labelFormatter={(label) => `Anno ${label}`}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="remainingBalance"
                            name="Debito residuo"
                            stackId="1"
                            stroke="#8884d8"
                            fill="#8884d8"
                          />
                          <Area
                            type="monotone"
                            dataKey="totalInterest"
                            name="Interessi pagati"
                            stackId="2"
                            stroke="#ffc658"
                            fill="#ffc658"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Piano di ammortamento</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                          Esporta
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                          <Download className="mr-2 h-4 w-4" />
                          PDF
                        </Button>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">N.</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Rata</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Capitale</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Interessi</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Residuo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(showFullSchedule ? results.amortizationSchedule : results.amortizationSchedule.slice(0, 12)).map((entry) => (
                            <tr key={entry.paymentNumber} className="border-b">
                              <td className="px-4 py-2 text-left text-sm">{entry.paymentNumber}</td>
                              <td className="px-4 py-2 text-right text-sm">{formatCurrency(entry.payment)}</td>
                              <td className="px-4 py-2 text-right text-sm">{formatCurrency(entry.principal)}</td>
                              <td className="px-4 py-2 text-right text-sm">{formatCurrency(entry.interest)}</td>
                              <td className="px-4 py-2 text-right text-sm">{formatCurrency(entry.remainingBalance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {!showFullSchedule && (
                      <Button 
                        variant="link" 
                        className="mt-4 mx-auto block" 
                        onClick={() => setShowFullSchedule(true)}
                      >
                        Mostra intero piano
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalcolaMutuo;
