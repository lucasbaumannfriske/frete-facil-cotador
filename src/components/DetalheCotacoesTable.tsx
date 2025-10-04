import { useMemo, useState, useRef } from "react";
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
  const [columnWidths, setColumnWidths] = useState({
    data: 100,
    transportadora: 150,
    produto: 150,
    origem: 120,
    destino: 120,
    valorTn: 110,
    volume: 110,
    valorTotal: 120,
  });

  const resizingRef = useRef<{
    column: keyof typeof columnWidths;
    startX: number;
    startWidth: number;
  } | null>(null);

  const handleMouseDown = (column: keyof typeof columnWidths, e: React.MouseEvent) => {
    e.preventDefault();
    resizingRef.current = {
      column,
      startX: e.clientX,
      startWidth: columnWidths[column],
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;
      const diff = e.clientX - resizingRef.current.startX;
      const newWidth = Math.max(60, resizingRef.current.startWidth + diff);
      
      setColumnWidths(prev => ({
        ...prev,
        [resizingRef.current!.column]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      resizingRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

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
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
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
                <TableHead 
                  style={{ width: `${columnWidths.data}px`, minWidth: `${columnWidths.data}px`, position: 'relative' }}
                  className="whitespace-nowrap text-xs h-9 px-2"
                >
                  Data
                  <div 
                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 active:bg-primary"
                    onMouseDown={(e) => handleMouseDown('data', e)}
                  />
                </TableHead>
                <TableHead 
                  style={{ width: `${columnWidths.transportadora}px`, minWidth: `${columnWidths.transportadora}px`, position: 'relative' }}
                  className="whitespace-nowrap text-xs h-9 px-2"
                >
                  Transportadora
                  <div 
                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 active:bg-primary"
                    onMouseDown={(e) => handleMouseDown('transportadora', e)}
                  />
                </TableHead>
                <TableHead 
                  style={{ width: `${columnWidths.produto}px`, minWidth: `${columnWidths.produto}px`, position: 'relative' }}
                  className="whitespace-nowrap text-xs h-9 px-2"
                >
                  Produto
                  <div 
                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 active:bg-primary"
                    onMouseDown={(e) => handleMouseDown('produto', e)}
                  />
                </TableHead>
                <TableHead 
                  style={{ width: `${columnWidths.origem}px`, minWidth: `${columnWidths.origem}px`, position: 'relative' }}
                  className="whitespace-nowrap text-xs h-9 px-2"
                >
                  Origem
                  <div 
                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 active:bg-primary"
                    onMouseDown={(e) => handleMouseDown('origem', e)}
                  />
                </TableHead>
                <TableHead 
                  style={{ width: `${columnWidths.destino}px`, minWidth: `${columnWidths.destino}px`, position: 'relative' }}
                  className="whitespace-nowrap text-xs h-9 px-2"
                >
                  Destino
                  <div 
                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 active:bg-primary"
                    onMouseDown={(e) => handleMouseDown('destino', e)}
                  />
                </TableHead>
                <TableHead 
                  style={{ width: `${columnWidths.valorTn}px`, minWidth: `${columnWidths.valorTn}px`, position: 'relative' }}
                  className="text-right whitespace-nowrap text-xs h-9 px-2"
                >
                  VL TN Lib.
                  <div 
                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 active:bg-primary"
                    onMouseDown={(e) => handleMouseDown('valorTn', e)}
                  />
                </TableHead>
                <TableHead 
                  style={{ width: `${columnWidths.volume}px`, minWidth: `${columnWidths.volume}px`, position: 'relative' }}
                  className="text-right whitespace-nowrap text-xs h-9 px-2"
                >
                  Vol. Embarc.
                  <div 
                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 active:bg-primary"
                    onMouseDown={(e) => handleMouseDown('volume', e)}
                  />
                </TableHead>
                <TableHead 
                  style={{ width: `${columnWidths.valorTotal}px`, minWidth: `${columnWidths.valorTotal}px` }}
                  className="text-right whitespace-nowrap text-xs h-9 px-2"
                >
                  Valor Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linhasTabela.map((linha, index) => (
                <TableRow key={index} className="hover:bg-muted/30">
                  <TableCell style={{ width: `${columnWidths.data}px` }} className="whitespace-nowrap text-xs py-2 px-2">{linha.data}</TableCell>
                  <TableCell style={{ width: `${columnWidths.transportadora}px` }} className="whitespace-nowrap text-xs py-2 px-2">{linha.transportadora}</TableCell>
                  <TableCell style={{ width: `${columnWidths.produto}px` }} className="whitespace-nowrap text-xs py-2 px-2">{linha.produto}</TableCell>
                  <TableCell style={{ width: `${columnWidths.origem}px` }} className="whitespace-nowrap text-xs py-2 px-2">{linha.origem}</TableCell>
                  <TableCell style={{ width: `${columnWidths.destino}px` }} className="whitespace-nowrap text-xs py-2 px-2">{linha.destino}</TableCell>
                  <TableCell style={{ width: `${columnWidths.valorTn}px` }} className="text-right whitespace-nowrap text-xs py-2 px-2">
                    R$ {linha.valorTnLiberado.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell style={{ width: `${columnWidths.volume}px` }} className="text-right whitespace-nowrap text-xs py-2 px-2">
                    {linha.volumeEmbarca.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell style={{ width: `${columnWidths.valorTotal}px` }} className="text-right whitespace-nowrap text-xs py-2 px-2">
                    R$ {linha.valorTotal.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-semibold bg-muted border-t-2">
                <TableCell colSpan={6} className="text-right text-xs py-2 px-2">
                  TOTAL
                </TableCell>
                <TableCell className="text-right whitespace-nowrap text-xs py-2 px-2">
                  {totais.volumeTotal.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
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
