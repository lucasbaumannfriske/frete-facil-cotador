
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClienteFormProps {
  cliente: string;
  setCliente: (value: string) => void;
  endereco: string;
  setEndereco: (value: string) => void;
  cidade: string;
  setCidade: (value: string) => void;
  estado: string;
  setEstado: (value: string) => void;
  cep: string;
  setCep: (value: string) => void;
  fazenda: string;
  setFazenda: (value: string) => void;
}

const ClienteForm = ({
  cliente,
  setCliente,
  endereco,
  setEndereco,
  cidade,
  setCidade,
  estado,
  setEstado,
  cep,
  setCep,
  fazenda,
  setFazenda,
}: ClienteFormProps) => {
  return (
    <div className="space-y-4">
      <h2>Informações do Cliente</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cliente">Nome do Cliente:</Label>
          <Input
            id="cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Nome do cliente"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fazenda">Nome da Fazenda:</Label>
          <Input
            id="fazenda"
            value={fazenda}
            onChange={(e) => setFazenda(e.target.value)}
            placeholder="Nome da Fazenda"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço:</Label>
          <Input
            id="endereco"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Endereço de entrega"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade:</Label>
          <Input
            id="cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Cidade"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado:</Label>
          <Input
            id="estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            placeholder="Estado"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cep">CEP:</Label>
          <Input
            id="cep"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            placeholder="CEP"
          />
        </div>
      </div>
    </div>
  );
};

export default ClienteForm;
