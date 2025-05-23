
import { Card, CardContent } from "@/components/ui/card";
import { ChartBarIcon } from "lucide-react";
import Reports from "@/components/Reports";
import Navigation from "@/components/Navigation";
import { useCotacoes } from "@/hooks/useCotacoes";
import { TruckIcon } from "lucide-react";

const ReportsPage = () => {
  const { cotacoes: historico, loading } = useCotacoes();

  if (loading) {
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
              <div className="text-center py-12">
                <TruckIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50 animate-pulse" />
                <p className="text-muted-foreground">Carregando dados dos relatórios...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
