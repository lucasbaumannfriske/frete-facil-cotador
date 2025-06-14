import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { 
  Calendar as CalendarIcon, 
  FilterIcon, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  XCircle,
  BarChart3 
} from "lucide-react";
import { CotacaoSalva } from "@/types";
import DesempenhoTransportadoras from "./DesempenhoTransportadoras";

interface ReportsProps {
  historico: CotacaoSalva[];
}

const Reports = ({ historico }: ReportsProps) => {
  const [periodoFiltro, setPeriodoFiltro] = useState<"diario" | "mensal" | "anual">("mensal");
  const [statusFiltro, setStatusFiltro] = useState<"todos" | "aprovado" | "pendente" | "rejeitado">("todos");
  const [dataInicio, setDataInicio] = useState<Date | undefined>(new Date(new Date().setMonth(new Date().getMonth() - 3)));
  const [dataFim, setDataFim] = useState<Date | undefined>(new Date());

  // Função para formatar data no formato dd/mm/yyyy
  const formatDate = (dateString: string) => {
    const parts = dateString.split('/');
    if (parts.length !== 3) return new Date();
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  };

  const agruparPorPeriodo = (cotacoes: CotacaoSalva[]) => {
    let cotacoesFiltradas = cotacoes;
    
    if (dataInicio && dataFim) {
      cotacoesFiltradas = cotacoes.filter(c => {
        const data = formatDate(c.data);
        return data >= dataInicio && data <= dataFim;
      });
    }

    if (statusFiltro !== "todos") {
      cotacoesFiltradas = cotacoesFiltradas.filter(cotacao => 
        cotacao.transportadoras.some(t => t.status.toLowerCase() === statusFiltro)
      );
    }

    const dadosAgrupados: Record<string, { 
      periodo: string;
      totalAprovado: number;
      totalPendente: number;
      totalRejeitado: number;
      count: number;
    }> = {};

    cotacoesFiltradas.forEach(cotacao => {
      let chave = "";
      const data = formatDate(cotacao.data);
      
      if (periodoFiltro === "diario") {
        chave = format(data, "dd/MM/yyyy");
      } else if (periodoFiltro === "mensal") {
        chave = format(data, "MM/yyyy");
      } else {
        chave = format(data, "yyyy");
      }

      if (!dadosAgrupados[chave]) {
        dadosAgrupados[chave] = {
          periodo: chave,
          totalAprovado: 0,
          totalPendente: 0,
          totalRejeitado: 0,
          count: 0
        };
      }

      cotacao.transportadoras.forEach(transportadora => {
        const valor = parseFloat(transportadora.propostaFinal || transportadora.valorTotal) || 0;
        
        if (transportadora.status.toLowerCase() === "aprovado") {
          dadosAgrupados[chave].totalAprovado += valor;
        } else if (transportadora.status.toLowerCase() === "pendente") {
          dadosAgrupados[chave].totalPendente += valor;
        } else if (transportadora.status.toLowerCase() === "rejeitado") {
          dadosAgrupados[chave].totalRejeitado += valor;
        }
      });

      dadosAgrupados[chave].count += 1;
    });

    const chavesOrdenadas = Object.keys(dadosAgrupados).sort((a, b) => {
      const datePartsA = a.split('/');
      const datePartsB = b.split('/');
      
      if (periodoFiltro === "diario") {
        return formatDate(a).getTime() - formatDate(b).getTime();
      } else if (periodoFiltro === "mensal") {
        return new Date(parseInt(datePartsA[1]), parseInt(datePartsA[0]) - 1, 1).getTime() - 
               new Date(parseInt(datePartsB[1]), parseInt(datePartsB[0]) - 1, 1).getTime();
      } else {
        return parseInt(a) - parseInt(b);
      }
    });

    return chavesOrdenadas.map(chave => dadosAgrupados[chave]);
  };

  const dadosGrafico = useMemo(() => agruparPorPeriodo(historico), [historico, periodoFiltro, statusFiltro, dataInicio, dataFim]);

  const totalAprovado = useMemo(() => 
    dadosGrafico.reduce((total, item) => total + item.totalAprovado, 0)
  , [dadosGrafico]);

  const totalPendente = useMemo(() => 
    dadosGrafico.reduce((total, item) => total + item.totalPendente, 0)
  , [dadosGrafico]);

  const totalRejeitado = useMemo(() => 
    dadosGrafico.reduce((total, item) => total + item.totalRejeitado, 0)
  , [dadosGrafico]);

  const totalCotacoes = useMemo(() => 
    dadosGrafico.reduce((total, item) => total + item.count, 0)
  , [dadosGrafico]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BarChart3 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Relatórios e Análises</h2>
          <p className="text-muted-foreground">Acompanhe o desempenho das cotações</p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FilterIcon className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodo" className="text-sm font-medium">Período</Label>
              <Select value={periodoFiltro} onValueChange={(value: any) => setPeriodoFiltro(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diário</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select value={statusFiltro} onValueChange={(value: any) => setStatusFiltro(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="aprovado">Aprovados</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="rejeitado">Rejeitados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Data Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataInicio}
                    onSelect={setDataInicio}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Data Fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? format(dataFim, "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataFim}
                    onSelect={setDataFim}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Ações</Label>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  setDataInicio(undefined);
                  setDataFim(undefined);
                  setStatusFiltro("todos");
                }}
              >
                <FilterIcon className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Cotações</p>
                <p className="text-2xl font-bold">{totalCotacoes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Aprovado</p>
                <p className="text-2xl font-bold text-green-600">R$ {totalAprovado.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pendente</p>
                <p className="text-2xl font-bold text-yellow-600">R$ {totalPendente.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rejeitado</p>
                <p className="text-2xl font-bold text-red-600">R$ {totalRejeitado.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NOVA SEÇÃO: Desempenho das Transportadoras */}
      <DesempenhoTransportadoras historico={historico} />

      {/* Gráfico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Evolução de Valores {periodoFiltro === "diario" ? "Diários" : periodoFiltro === "mensal" ? "Mensais" : "Anuais"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dadosGrafico.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="p-3 bg-muted rounded-full mb-4">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-muted-foreground mb-2">Nenhum dado disponível</p>
              <p className="text-sm text-muted-foreground">Ajuste os filtros para visualizar os dados</p>
            </div>
          ) : (
            <div className="h-[400px]">
              <ChartContainer
                config={{
                  aprovado: { color: "#16a34a" },
                  pendente: { color: "#eab308" },
                  rejeitado: { color: "#dc2626" },
                }}
              >
                <BarChart
                  data={dadosGrafico}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periodo" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar name="Aprovado" dataKey="totalAprovado" fill="var(--color-aprovado)" />
                  <Bar name="Pendente" dataKey="totalPendente" fill="var(--color-pendente)" />
                  <Bar name="Rejeitado" dataKey="totalRejeitado" fill="var(--color-rejeitado)" />
                </BarChart>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
