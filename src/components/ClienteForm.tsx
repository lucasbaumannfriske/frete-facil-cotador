
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  origem: string;
  setOrigem: (value: string) => void;
  destino: string;
  setDestino: (value: string) => void;
  roteiro: string;
  setRoteiro: (value: string) => void;
}

const ClienteForm = ({
  cliente,
  setCliente,
  cidade,
  setCidade,
  origem,
  setOrigem,
  destino,
  setDestino,
  roteiro,
  setRoteiro,
  ...props
}: ClienteFormProps) => {
  return (
    <>
      {/* Tomador do Serviço */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-blue-600">Tomador do Serviço</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cliente">Nome do Tomador:</Label>
            <Input
              id="cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Nome do tomador do serviço"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade:</Label>
            <Input
              id="cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Cidade do tomador"
            />
          </div>
        </div>
      </div>

      {/* Detalhes do Frete */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-600">Detalhes do Frete</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="origem">Origem:</Label>
            <Input
              id="origem"
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
              placeholder="Local de origem da carga"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destino">Destino:</Label>
            <Input
              id="destino"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              placeholder="Local de destino da carga"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roteiro">Roteiro Detalhado:</Label>
            <Textarea
              id="roteiro"
              value={roteiro}
              onChange={(e) => setRoteiro(e.target.value)}
              placeholder="Descrição detalhada do roteiro"
              rows={4}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClienteForm;
