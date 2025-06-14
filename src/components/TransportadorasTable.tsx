
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { useTransportadorasCadastros } from "@/hooks/useTransportadorasCadastros";
import { Transportadora } from "@/types";

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
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Transportadoras</h3>
        <Button type="button" variant="outline" onClick={handleAdd}>Adicionar Transportadora</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border rounded">
          <thead>
            <tr className="bg-muted">
              <th className="px-2 py-1">Transportadora</th>
              <th className="px-2 py-1">Prazo</th>
              <th className="px-2 py-1">Valor Unitário</th>
              <th className="px-2 py-1">Total</th>
              <th className="px-2 py-1">Status</th>
              <th className="px-2 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {transportadoras.map((t, idx) => (
              <tr key={t.id}>
                <td>
                  <Select
                    value={cadastradas.find(c => c.nome === t.nome)?.id || ""}
                    onValueChange={id => handleSelectTransportadora(idx, id)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione"} />
                    </SelectTrigger>
                    <SelectContent>
                      {cadastradas.map(opt => (
                        <SelectItem key={opt.id} value={opt.id}>
                          {opt.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td>
                  <Input
                    value={t.prazo}
                    onChange={e => handleInputChange(idx, "prazo", e.target.value)}
                    placeholder="Prazo"
                  />
                </td>
                <td>
                  <Input
                    value={t.valorUnitario}
                    onChange={e => handleInputChange(idx, "valorUnitario", e.target.value)}
                    placeholder="Valor Unitário"
                    type="number"
                  />
                </td>
                <td>
                  <Input
                    value={t.valorTotal}
                    onChange={e => handleInputChange(idx, "valorTotal", e.target.value)}
                    placeholder="Total"
                    type="number"
                    readOnly
                  />
                </td>
                <td>
                  <Input
                    value={t.status}
                    onChange={e => handleInputChange(idx, "status", e.target.value)}
                    placeholder="Status"
                  />
                </td>
                <td>
                  <Button variant="ghost" size="icon" onClick={() => handleRemove(t.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransportadorasTable;
