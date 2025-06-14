import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  TrendingUp,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { CotacaoSalva } from "@/types";
import DesempenhoTransportadoras from "./DesempenhoTransportadoras";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface ReportsProps {
  historico: CotacaoSalva[];
}

const Reports = ({ historico }: ReportsProps) => {
  // Apenas dois filtros: dataInicio e dataFim
  const [dataInicio, setDataInicio] = useState<Date | undefined>(new Date(new Date().setMonth(new Date().getMonth() - 3)));
  const [dataFim, setDataFim] = useState<Date | undefined>(new Date());

  // Função para formatar string dd/mm/yyyy para Date
  const formatDate = (dateString: string): Date | undefined => {
    if (!dateString || typeof dateString !== "string") return undefined;
    const parts = dateString.split('/');
    if (parts.length !== 3) return undefined;
    const [dd, mm, yyyy] = parts;
    if (!dd || !mm || !yyyy) return undefined;
    const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    if (isNaN(parsed.getTime())) return undefined;
    return parsed;
  };

  // Filtrar apenas pelo intervalo de datas
  const cotacoesFiltradas = useMemo(() => {
    let filtradas = historico;
    if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio);
      inicio.setHours(0, 0, 0, 0);
      const fim = new Date(dataFim);
      fim.setHours(23, 59, 59, 999);
      filtradas = filtradas.filter((c) => {
        const dataC = formatDate(c.data);
        if (!dataC) return false;
        return dataC >= inicio && dataC <= fim;
      });
    }
    return filtradas;
  }, [historico, dataInicio, dataFim]);

  // KPIs: Somente cotações com status aprovado
  const totalCotacoesAprovadas = useMemo(
    () =>
      cotacoesFiltradas.filter((c) =>
        c.transportadoras.some(
          (t) => t.status && t.status.toLowerCase() === "aprovado"
        )
      ).length,
    [cotacoesFiltradas]
  );

  const valorTotalAprovado = useMemo(
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

  // Dados mensais para gráfico: [{ mes: "06/2024", valorAprovado: X }, ...]
  const historicoMensal = useMemo(() => {
    // { 'YYYY-MM': valorTotal }
    const meses: { [key: string]: number } = {};

    cotacoesFiltradas.forEach((cotacao) => {
      // considerar APENAS OS APROVADOS
      const isAprovado = cotacao.transportadoras.some(
        (t) => t.status && t.status.toLowerCase() === "aprovado"
      );
      if (!isAprovado) return;

      const dataCot = formatDate(cotacao.data);
      if (!dataCot) return;
      // chave: AAAA-MM
      const key = format(dataCot, "yyyy-MM");
      // valor aprovado nesta cotação
      const valorCot = cotacao.transportadoras
        .filter((t) => t.status && t.status.toLowerCase() === "aprovado")
        .reduce(
          (soma, t) =>
            soma + (parseFloat(t.propostaFinal || t.valorTotal || "0") || 0),
          0
        );
      meses[key] = (meses[key] || 0) + valorCot;
    });

    // Ordena os meses crescentes e formata para [{ mes: "MM/yyyy", valorAprovado }]
    return Object.keys(meses)
      .sort()
      .map((key) => ({
        mes: format(new Date(key + "-01"), "MM/yyyy"),
        valorAprovado: meses[key],
      }));
  }, [cotacoesFiltradas]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BarChart3 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Relatórios e Análises</h2>
          <p className="text-muted-foreground">KPIs e desempenho de acordo com o período selecionado</p>
        </div>
      </div>

      {/* Filtros: Apenas datas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            Filtros por Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2 w-full sm:w-1/3">
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
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2 w-full sm:w-1/3">
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
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-end w-full sm:w-1/3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setDataInicio(undefined);
                  setDataFim(undefined);
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {valorTotalAprovado.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nova ordem: Desempenho das Transportadoras primeiro */}
      <DesempenhoTransportadoras historico={cotacoesFiltradas} />

      {/* Depois, o gráfico do histórico mensal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            Histórico Mensal do Valor Total Aprovado
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historicoMensal.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">
              Nenhum dado aprovado no período selecionado.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={historicoMensal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis
                  tickFormatter={v => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                />
                <Tooltip 
                  formatter={v => "R$ " + Number(v).toLocaleString("pt-BR", {minimumFractionDigits:2})}
                  labelFormatter={label => `Mês: ${label}`}
                />
                <Bar dataKey="valorAprovado" fill="#22c55e" name="Valor Total Aprovado" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
