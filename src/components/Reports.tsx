
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { CotacaoSalva } from "@/types";
import ReportsKpis from "./ReportsKpis";
import ReportsFiltros from "./ReportsFiltros";
import DesempenhoTransportadoras from "./DesempenhoTransportadoras";
import DetalheCotacoesTable from "./DetalheCotacoesTable";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface ReportsProps {
  historico: CotacaoSalva[];
}

const Reports = ({ historico }: ReportsProps) => {
  const today = new Date();
  const [draftDataInicio, setDraftDataInicio] = useState<Date | undefined>(today);
  const [draftDataFim, setDraftDataFim] = useState<Date | undefined>(today);
  const [dataInicio, setDataInicio] = useState<Date | undefined>(today);
  const [dataFim, setDataFim] = useState<Date | undefined>(today);

  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [yyyy, mm, dd] = dateString.split("-");
      const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      if (isNaN(parsed.getTime())) return undefined;
      return parsed;
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [dd, mm, yyyy] = dateString.split("/");
      const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      if (isNaN(parsed.getTime())) return undefined;
      return parsed;
    }
    return undefined;
  };

  const cotacoesFiltradas = useMemo(() => {
    let filtradas = historico;
    if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio);
      inicio.setHours(0, 0, 0, 0);
      const fim = new Date(dataFim);
      fim.setHours(23, 59, 59, 999);
      filtradas = filtradas.filter((c) => {
        const dataC = parseDate(c.data);
        if (!dataC) return false;
        return dataC >= inicio && dataC <= fim;
      });
    }
    return filtradas;
  }, [historico, dataInicio, dataFim]);

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

  const historicoMensal = useMemo(() => {
    const meses: { [key: string]: number } = {};
    cotacoesFiltradas.forEach((cotacao) => {
      const isAprovado = cotacao.transportadoras.some(
        (t) => t.status && t.status.toLowerCase() === "aprovado"
      );
      if (!isAprovado) return;
      const dataCot = parseDate(cotacao.data);
      if (!dataCot) return;
      const key = `${dataCot.getFullYear()}-${String(dataCot.getMonth() + 1).padStart(2, '0')}`;
      const valorCot = cotacao.transportadoras
        .filter((t) => t.status && t.status.toLowerCase() === "aprovado")
        .reduce(
          (soma, t) =>
            soma + (parseFloat(t.propostaFinal || t.valorTotal || "0") || 0),
          0
        );
      meses[key] = (meses[key] || 0) + valorCot;
    });
    return Object.keys(meses)
      .sort()
      .map((key) => ({
        mes: key.slice(5, 7) + "/" + key.slice(0, 4),
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

      {/* Filtros Modulares */}
      <ReportsFiltros
        draftDataInicio={draftDataInicio}
        draftDataFim={draftDataFim}
        setDraftDataInicio={setDraftDataInicio}
        setDraftDataFim={setDraftDataFim}
        onAplicarFiltros={() => {
          setDataInicio(draftDataInicio);
          setDataFim(draftDataFim);
        }}
        onLimparFiltros={() => {
          setDraftDataInicio(undefined);
          setDraftDataFim(undefined);
          setDataInicio(undefined);
          setDataFim(undefined);
        }}
      />

      {/* KPIs */}
      <ReportsKpis
        totalCotacoesAprovadas={totalCotacoesAprovadas}
        valorTotalAprovado={valorTotalAprovado}
      />

      {/* Tabela detalhada de cotações aprovadas */}
      <DetalheCotacoesTable historico={cotacoesFiltradas} />

      {/* Desempenho das Transportadoras */}
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
