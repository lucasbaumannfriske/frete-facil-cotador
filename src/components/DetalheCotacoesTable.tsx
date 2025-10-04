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
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="h-4 w-4" />
          Detalhamento de Cotações Aprovadas
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-md border overflow-auto max-h-[500px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="whitespace-nowrap text-xs h-9 px-2">Data</TableHead>
                <TableHead className="whitespace-nowrap text-xs h-9 px-2">Transportadora</TableHead>
                <TableHead className="whitespace-nowrap text-xs h-9 px-2">Origem</TableHead>
                <TableHead className="whitespace-nowrap text-xs h-9 px-2">Destino</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs h-9 px-2">VL TN Lib.</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs h-9 px-2">Vol. Embarc.</TableHead>
                <TableHead className="whitespace-nowrap text-xs h-9 px-2">Produto</TableHead>
                <TableHead className="text-right whitespace-nowrap text-xs h-9 px-2">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linhasTabela.map((linha, index) => (
                <TableRow key={index} className="hover:bg-muted/30">
                  <TableCell className="whitespace-nowrap text-xs py-2 px-2">{linha.data}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs py-2 px-2">{linha.transportadora}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs py-2 px-2">{linha.origem}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs py-2 px-2">{linha.destino}</TableCell>
                  <TableCell className="text-right whitespace-nowrap text-xs py-2 px-2">
                    R$ {linha.valorTnLiberado.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap text-xs py-2 px-2">
                    {linha.volumeEmbarca.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs py-2 px-2">{linha.produto}</TableCell>
                  <TableCell className="text-right whitespace-nowrap text-xs py-2 px-2">
                    R$ {linha.valorTotal.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-semibold bg-muted border-t-2">
                <TableCell colSpan={5} className="text-right text-xs py-2 px-2">
                  TOTAL
                </TableCell>
                <TableCell className="text-right whitespace-nowrap text-xs py-2 px-2">
                  {totais.volumeTotal.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-xs py-2 px-2"></TableCell>
                <TableCell className="text-right whitespace-nowrap text-xs py-2 px-2">
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
