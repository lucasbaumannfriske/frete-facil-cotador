
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transportadora } from "@/types";

interface TransportadorasTableProps {
  transportadoras: Transportadora[];
  setTransportadoras: (transportadoras: Transportadora[]) => void;
  calcularTotal: (id: string, valor: string) => void;
}

const TransportadorasTable = ({
  transportadoras,
  setTransportadoras,
  calcularTotal,
}: TransportadorasTableProps) => {
  const adicionarTransportadora = () => {
    setTransportadoras([
      ...transportadoras,
      {
        id: Date.now().toString(),
        nome: "",
        prazo: "",
        valorUnitario: "",
        valorTotal: "",
        status: "Pendente",
      },
    ]);
  };

  const removerTransportadora = (id: string) => {
    setTransportadoras(transportadoras.filter((t) => t.id !== id));
  };

  const atualizarTransportadora = (
    id: string,
    campo: keyof Transportadora,
    valor: string
  ) => {
    setTransportadoras(
      transportadoras.map((transp) =>
        transp.id === id ? { ...transp, [campo]: valor } : transp
      )
    );
    
    if (campo === "valorUnitario") {
      calcularTotal(id, valor);
    }
  };

  return (
    <div className="space-y-4">
      <h2>Cotação de Frete</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transportadora</TableHead>
              <TableHead>Prazo Estimado (dias)</TableHead>
              <TableHead>Valor Unitário (R$)</TableHead>
              <TableHead>Valor Total (R$)</TableHead>
              <TableHead className="w-[100px]">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transportadoras.map((transp) => (
              <TableRow key={transp.id}>
                <TableCell>
                  <Input
                    className="min-w-[200px]"
                    value={transp.nome}
                    onChange={(e) =>
                      atualizarTransportadora(transp.id, "nome", e.target.value)
                    }
                    placeholder="Nome da transportadora"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={transp.prazo}
                    onChange={(e) =>
                      atualizarTransportadora(transp.id, "prazo", e.target.value)
                    }
                    min="1"
                    placeholder="Prazo em dias"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={transp.valorUnitario}
                    onChange={(e) =>
                      atualizarTransportadora(transp.id, "valorUnitario", e.target.value)
                    }
                    min="0"
                    step="0.01"
                    placeholder="Valor unitário"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={transp.valorTotal}
                    readOnly
                    className="bg-gray-50"
                    placeholder="Valor total"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removerTransportadora(transp.id)}
                  >
                    Remover
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button onClick={adicionarTransportadora} className="mt-2">
        Adicionar Transportadora
      </Button>
    </div>
  );
};

export default TransportadorasTable;
