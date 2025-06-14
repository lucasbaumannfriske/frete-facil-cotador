
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, CheckCircle } from "lucide-react";

interface ReportsKpisProps {
  totalCotacoesAprovadas: number;
  valorTotalAprovado: number;
}

const kpiColors = [
  {
    bg: "bg-green-50",
    circle: "bg-green-100",
    icon: "text-green-600",
    shadow: "shadow-green-100",
    border: "border-green-400",
  },
  {
    bg: "bg-blue-50",
    circle: "bg-blue-100",
    icon: "text-blue-600",
    shadow: "shadow-blue-100",
    border: "border-blue-400",
  },
];

const ReportsKpis = ({
  totalCotacoesAprovadas,
  valorTotalAprovado,
}: ReportsKpisProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">
    {/* KPI - Total de Cotações Aprovadas */}
    <Card className={`rounded-2xl border-0 ${kpiColors[0].bg} ${kpiColors[0].shadow}`}>
      <CardContent className="flex gap-4 items-center p-6">
        <div className={`flex items-center justify-center rounded-full ${kpiColors[0].circle} ${kpiColors[0].border} border-4 w-16 h-16`}>
          <CheckCircle className={`w-9 h-9 ${kpiColors[0].icon}`} />
        </div>
        <div>
          <p className="text-md text-gray-500 font-medium mb-1">Total de Cotações Aprovadas</p>
          <p className="text-4xl font-extrabold text-gray-900">{totalCotacoesAprovadas}</p>
        </div>
      </CardContent>
    </Card>

    {/* KPI - Valor Total Aprovado */}
    <Card className={`rounded-2xl border-0 ${kpiColors[1].bg} ${kpiColors[1].shadow}`}>
      <CardContent className="flex gap-4 items-center p-6">
        <div className={`flex items-center justify-center rounded-full ${kpiColors[1].circle} ${kpiColors[1].border} border-4 w-16 h-16`}>
          <TrendingUp className={`w-9 h-9 ${kpiColors[1].icon}`} />
        </div>
        <div>
          <p className="text-md text-gray-500 font-medium mb-1">Valor Total Aprovado</p>
          <p className="text-4xl font-extrabold text-blue-700">
            R${" "}
            {valorTotalAprovado.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ReportsKpis;

