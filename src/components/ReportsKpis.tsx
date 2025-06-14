
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, CheckCircle } from "lucide-react";

interface ReportsKpisProps {
  totalCotacoesAprovadas: number;
  valorTotalAprovado: number;
}

const ReportsKpis = ({
  totalCotacoesAprovadas,
  valorTotalAprovado,
}: ReportsKpisProps) => (
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
            <p className="text-2xl font-bold">{totalCotacoesAprovadas}</p>
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
);

export default ReportsKpis;
