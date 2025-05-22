
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChartBarIcon } from "lucide-react";
import Reports from "@/components/Reports";
import { CotacaoSalva } from "@/types";
import Navigation from "@/components/Navigation";

const ReportsPage = () => {
  const [historico, setHistorico] = useState<CotacaoSalva[]>([]);

  // Carregar histórico salvo ao iniciar
  useEffect(() => {
    const historicoSalvo = localStorage.getItem("cotacoes");
    if (historicoSalvo) {
      try {
        const cotacoesParsed = JSON.parse(historicoSalvo);
        setHistorico(cotacoesParsed);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        localStorage.removeItem("cotacoes");
      }
    }
  }, []);

  return (
    <div>
      <Navigation />
      <div className="container max-w-6xl py-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <ChartBarIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-center">Relatórios e Análises</h1>
        </div>

        <Card className="border-t-4 border-t-primary shadow-md">
          <CardContent className="p-6">
            <Reports historico={historico} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
