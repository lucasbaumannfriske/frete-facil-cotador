
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTransportadorasCadastros } from "@/hooks/useTransportadorasCadastros";
import { Transportadora } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransportadoraCombobox } from "./TransportadoraCombobox";

interface Props {
  transportadoras: Transportadora[];
  setTransportadoras: (v: Transportadora[]) => void;
  calcularTotal: (id: string, valorUnitario: string) => void;
}

const TransportadorasTable = ({ transportadoras, setTransportadoras, calcularTotal }: Props) => {
  const { transportadoras: cadastradas, isLoading } = useTransportadorasCadastros();

  // Ao trocar o nome pelo dropdown, preenche os campos referentes à transportadora cadastrada
  const handleSelectTransportadora = (index: number, id: string) => {
    const cadastro = cadastradas.find(t => t.id === id);
    setTransportadoras(transportadoras.map((t, i) => {
      if (i !== index) return t;
      return {
        ...t,
        nome: cadastro?.nome || "",
        // Aqui pode-se adicionar campos de e-mail/telefone se desejar no futuro
      };
    }));
  };

  const handleInputChange = (index: number, field: keyof Transportadora, value: string) => {
    const updated = transportadoras.map((t, i) => (i === index ? { ...t, [field]: value } : t));
    setTransportadoras(updated);
    // Se mudar valor unitário, recalcula o total
    if (field === "valorUnitario") {
      calcularTotal(transportadoras[index].id, value);
    }
  };

  const handleRemove = (id: string) => {
    setTransportadoras(transportadoras.filter(t => t.id !== id));
  };

  const handleAdd = () => {
    setTransportadoras([
      ...transportadoras,
      {
        id: Math.random().toString(),
        nome: "",
        prazo: "",
        valorUnitario: "",
        valorTotal: "",
        status: "Pendente",
        propostaFinal: "",
      },
    ]);
  };

  return (
    <div className="space-y-4">
      <h2>Transportadoras</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transportadora</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead>Valor Unitário</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transportadoras.map((t, idx) => (
              <TableRow key={t.id}>
                <TableCell>
                  <TransportadoraCombobox
                    value={cadastradas.find(c => c.nome === t.nome)?.id || ""}
                    onChange={id => handleSelectTransportadora(idx, id)}
                    options={cadastradas}
                    disabled={isLoading}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={t.prazo}
                    onChange={e => handleInputChange(idx, "prazo", e.target.value)}
                    placeholder="Prazo"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={t.valorUnitario}
                    onChange={e => handleInputChange(idx, "valorUnitario", e.target.value)}
                    placeholder="Valor Unitário"
                    type="number"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={t.valorTotal}
                    onChange={e => handleInputChange(idx, "valorTotal", e.target.value)}
                    placeholder="Total"
                    type="number"
                    readOnly
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={t.status}
                    onChange={e => handleInputChange(idx, "status", e.target.value)}
                    placeholder="Status"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => handleRemove(t.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button onClick={handleAdd} className="mt-2">
        Adicionar Transportadora
      </Button>
    </div>
  );
};

export default TransportadorasTable;
