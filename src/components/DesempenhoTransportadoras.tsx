
import React, { useMemo } from "react";
import { CotacaoSalva } from "@/types";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Truck } from "lucide-react";

interface DesempenhoProps {
  historico: CotacaoSalva[];
}

/*
  Calcular para cada transportadora:
  - solicitadas: nº de cotações onde foi convidada
  - respondidas: nº de respostas com valor preenchido
  - aprovadas: nº de cotações aprovadas
  - soma dos valores aprovados
  - valor médio aprovado
*/

interface TransportadoraStats {
  nome: string;
  solicitadas: number;
  respondidas: number;
  aprovadas: number;
  somaAprovados: number;
  mediaAprovados: number | null;
}

function calcularDesempenhoTransportadoras(historico: CotacaoSalva[]): TransportadoraStats[] {
  // Map: nome -> {stats}
  const statsMap: Record<string, TransportadoraStats> = {};

  historico.forEach(cotacao => {
    cotacao.transportadoras.forEach(transportadora => {
      const nome = transportadora.nome;
      if (!statsMap[nome]) {
        statsMap[nome] = {
          nome,
          solicitadas: 0,
          respondidas: 0,
          aprovadas: 0,
          somaAprovados: 0,
          mediaAprovados: null,
        };
      }
      statsMap[nome].solicitadas += 1;
      if (transportadora.valorTotal || transportadora.propostaFinal) {
        statsMap[nome].respondidas += 1;
      }
      if (transportadora.status && transportadora.status.toLowerCase() === "aprovado") {
        statsMap[nome].aprovadas += 1;
        const valor =
          parseFloat(transportadora.propostaFinal || transportadora.valorTotal || "0") || 0;
        statsMap[nome].somaAprovados += valor;
      }
    });
  });

  // Calcular médias
  Object.values(statsMap).forEach(s => {
    if (s.aprovadas > 0) {
      s.mediaAprovados = s.somaAprovados / s.aprovadas;
    }
  });

  // Ordenar por nome (A-Z)
  return Object.values(statsMap).sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
  );
}

const DesempenhoTransportadoras: React.FC<DesempenhoProps> = ({ historico }) => {
  const dados = useMemo(() => calcularDesempenhoTransportadoras(historico), [historico]);

  return (
    <div className="bg-white rounded-xl border px-4 py-6 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="text-primary" size={20} />
        <span className="font-bold text-lg">Desempenho das Transportadoras</span>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60">
              <TableHead>TRANSPORTADORA</TableHead>
              <TableHead>SOLICITADAS</TableHead>
              <TableHead>RESPONDIDAS</TableHead>
              <TableHead>APROVADAS</TableHead>
              <TableHead>SOMA VALORES APROVADOS (R$)</TableHead>
              <TableHead>VALOR MÉDIO APROVADO (R$)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dados.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  Nenhum dado de desempenho disponível.
                </TableCell>
              </TableRow>
            )}
            {dados.map((stat) => (
              <TableRow key={stat.nome}>
                <TableCell className="font-medium">{stat.nome}</TableCell>
                <TableCell>{stat.solicitadas}</TableCell>
                <TableCell>{stat.respondidas}</TableCell>
                <TableCell>{stat.aprovadas}</TableCell>
                <TableCell>
                  {"R$ " + stat.somaAprovados.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  {stat.mediaAprovados !== null
                    ? "R$ " +
                      stat.mediaAprovados.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DesempenhoTransportadoras;

