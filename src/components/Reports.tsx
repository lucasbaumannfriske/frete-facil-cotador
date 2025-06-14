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

  // Função para formatar string dd/mm/yyyy para objeto Date OU retornar undefined se inválida
  const formatDate = (dateString: string): Date | undefined => {
    if (!dateString || typeof dateString !== "string") return undefined;
    const parts = dateString.split('/');
    if (parts.length !== 3) return undefined;
    const [dd, mm, yyyy] = parts;
    if (!dd || !mm || !yyyy) return undefined;
    const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    // Verifica se a data é válida
    if (isNaN(parsed.getTime())) return undefined;
    return parsed;
  };

  // Corrige o filtro para considerar todo o dia final
  const cotacoesFiltradas = useMemo(() => {
    let filtradas = historico;

    if (dataInicio && dataFim) {
      const dataInicioZ = new Date(dataInicio);
      dataInicioZ.setHours(0, 0, 0, 0);
      const dataFimZ = new Date(dataFim);
      dataFimZ.setHours(23, 59, 59, 999);

      // Debug log para conferir datas
      console.log("Filtro de datas:", {
        dataInicioZ: dataInicioZ.toISOString(),
        dataFimZ: dataFimZ.toISOString(),
        cotacoesConvertidas: historico.map((c) => ({
          id: c.id,
          dataRaw: c.data,
          dataDate: formatDate(c.data)?.toISOString() ?? "inválido"
        }))
      });

      filtradas = filtradas.filter((c) => {
        const dataC = formatDate(c.data);
        if (!dataC) return false; // Ignorar se falhou a conversão
        return dataC >= dataInicioZ && dataC <= dataFimZ;
      });
    }

    if (statusFiltro !== "todos") {
      filtradas = filtradas.filter((c) =>
        c.transportadoras.some(
          (t) => t.status && t.status.toLowerCase() === statusFiltro
        )
      );
    }

    return filtradas;
  }, [historico, dataInicio, dataFim, statusFiltro]);

  // KPIs: só cotações aprovadas
  const totalCotacoesAprovadas = useMemo(() =>
    cotacoesFiltradas.filter((c) =>
      c.transportadoras.some(
        (t) => t.status && t.status.toLowerCase() === "aprovado"
      )
    ).length,
    [cotacoesFiltradas]
  );

  const totalAprovado = useMemo(
    () =>
      cotacoesFiltradas.reduce((total, cotacao) => {
        const totalAprovadosPorCot = cotacao.transportadoras
          .filter((t) => t.status && t.status.toLowerCase() === "aprovado")
          .reduce(
            (soma, t) =>
              soma +
              (parseFloat(t.propostaFinal || t.valorTotal || "0") || 0),
            0
          );
        return total + totalAprovadosPorCot;
      }, 0),
    [cotacoesFiltradas]
  );

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

      {/* Cards de métricas (apenas os dois KPIs solicitados) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total de Cotações Aprovadas
                </p>
                <p className="text-2xl font-bold">
                  {totalCotacoesAprovadas}
                </p>
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
                <p className="text-sm text-muted-foreground">
                  Valor Total Aprovado
                </p>
                <p className="text-2xl font-bold text-green-600">
                  R${" "}
                  {totalAprovado.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção Desempenho das Transportadoras (usando dados filtrados e atualizados conforme os filtros) */}
      <DesempenhoTransportadoras historico={cotacoesFiltradas} />
    </div>
  );
};

export default Reports;
