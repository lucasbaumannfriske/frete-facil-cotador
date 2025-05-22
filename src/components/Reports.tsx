
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Calendar as CalendarIcon, FilterIcon } from "lucide-react";
import { CotacaoSalva } from "@/types";

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

  // Função para agrupar dados por período
  const agruparPorPeriodo = (cotacoes: CotacaoSalva[]) => {
    // Filtrar por período de data
    let cotacoesFiltradas = cotacoes;
    
    if (dataInicio && dataFim) {
      cotacoesFiltradas = cotacoes.filter(c => {
        const data = formatDate(c.data);
        return data >= dataInicio && data <= dataFim;
      });
    }

    // Filtrar por status
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
      
      // Definir a chave com base no período selecionado
      if (periodoFiltro === "diario") {
        chave = format(data, "dd/MM/yyyy");
      } else if (periodoFiltro === "mensal") {
        chave = format(data, "MM/yyyy");
      } else {
        chave = format(data, "yyyy");
      }

      // Inicializar o objeto se não existir
      if (!dadosAgrupados[chave]) {
        dadosAgrupados[chave] = {
          periodo: chave,
          totalAprovado: 0,
          totalPendente: 0,
          totalRejeitado: 0,
          count: 0
        };
      }

      // Somar valores por status
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

    // Ordenar as chaves por data
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
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h2 className="text-2xl font-bold">Relatórios e Análises</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="periodo">Período:</Label>
            <Select value={periodoFiltro} onValueChange={(value: any) => setPeriodoFiltro(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diario">Diário</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="status">Status:</Label>
            <Select value={statusFiltro} onValueChange={(value: any) => setStatusFiltro(value)}>
              <SelectTrigger className="w-32">
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

          <div className="flex items-center gap-2">
            <Label>Data Início:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2 items-center w-32 justify-start">
                  <CalendarIcon className="h-4 w-4" />
                  {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Selecionar"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dataInicio}
                  onSelect={setDataInicio}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2">
            <Label>Data Fim:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex gap-2 items-center w-32 justify-start">
                  <CalendarIcon className="h-4 w-4" />
                  {dataFim ? format(dataFim, "dd/MM/yyyy") : "Selecionar"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dataFim}
                  onSelect={setDataFim}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button variant="outline" className="flex items-center gap-2" onClick={() => {
            setDataInicio(undefined);
            setDataFim(undefined);
            setStatusFiltro("todos");
          }}>
            <FilterIcon className="h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">Total de Cotações</div>
            <div className="text-2xl font-bold">{totalCotacoes}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">Total Aprovado</div>
            <div className="text-2xl font-bold text-green-600">R$ {totalAprovado.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">Total Pendente</div>
            <div className="text-2xl font-bold text-yellow-600">R$ {totalPendente.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-2">Total Rejeitado</div>
            <div className="text-2xl font-bold text-red-600">R$ {totalRejeitado.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Evolução de Valores {periodoFiltro === "diario" ? "Diários" : periodoFiltro === "mensal" ? "Mensais" : "Anuais"}</h3>
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
          {dadosGrafico.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center h-[200px]">
              <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
