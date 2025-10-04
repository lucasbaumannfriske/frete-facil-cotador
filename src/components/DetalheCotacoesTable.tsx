import { useMemo } from "react";
import { CotacaoSalva } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface DetalheCotacoesTableProps {
  historico: CotacaoSalva[];
}

interface LinhaTabela {
  data: string;
  transportadora: string;
  origem: string;
  destino: string;
  valorTnLiberado: number;
  volumeEmbarca: number;
  produto: string;
  valorTotal: number;
}

const DetalheCotacoesTable = ({ historico }: DetalheCotacoesTableProps) => {
  const linhasTabela = useMemo(() => {
    const linhas: LinhaTabela[] = [];

    historico.forEach((cotacao) => {
      const transportadorasAprovadas = cotacao.transportadoras.filter(
        (t) => t.status && t.status.toLowerCase() === "aprovado"
      );

      transportadorasAprovadas.forEach((transportadora) => {
        cotacao.produtos.forEach((produto) => {
          const valorUnitario = parseFloat(
            transportadora.propostaFinal || transportadora.valorUnitario || "0"
          );
          const peso = parseFloat(produto.peso || "0");
          const valorTotal = parseFloat(
            transportadora.propostaFinal || transportadora.valorTotal || "0"
          );

          linhas.push({
            data: cotacao.data,
            transportadora: transportadora.nome,
            origem: cotacao.origem || "-",
            destino: cotacao.destino || "-",
            valorTnLiberado: valorUnitario,
            volumeEmbarca: peso,
            produto: produto.nome,
            valorTotal: valorTotal,
          });
        });
      });
    });

    return linhas;
  }, [historico]);

  const totais = useMemo(() => {
    return linhasTabela.reduce(
      (acc, linha) => ({
        volumeTotal: acc.volumeTotal + linha.volumeEmbarca,
        valorTotal: acc.valorTotal + linha.valorTotal,
      }),
      { volumeTotal: 0, valorTotal: 0 }
    );
  }, [linhasTabela]);

  if (linhasTabela.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Detalhamento de Cotações Aprovadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-8">
            Nenhuma cotação aprovada no período selecionado.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5" />
          Detalhamento de Cotações Aprovadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Data da Cotação</TableHead>
                <TableHead className="whitespace-nowrap">Transportadora</TableHead>
                <TableHead className="whitespace-nowrap">Origem</TableHead>
                <TableHead className="whitespace-nowrap">Destino</TableHead>
                <TableHead className="text-right whitespace-nowrap">VL TN Liberado</TableHead>
                <TableHead className="text-right whitespace-nowrap">Volume Embarca</TableHead>
                <TableHead className="whitespace-nowrap">Produto</TableHead>
                <TableHead className="text-right whitespace-nowrap">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linhasTabela.map((linha, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap">{linha.data}</TableCell>
                  <TableCell className="whitespace-nowrap">{linha.transportadora}</TableCell>
                  <TableCell className="whitespace-nowrap">{linha.origem}</TableCell>
                  <TableCell className="whitespace-nowrap">{linha.destino}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    R$ {linha.valorTnLiberado.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {linha.volumeEmbarca.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{linha.produto}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    R$ {linha.valorTotal.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-muted/50">
                <TableCell colSpan={5} className="text-right">
                  TOTAL
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {totais.volumeTotal.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  R$ {totais.valorTotal.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetalheCotacoesTable;
