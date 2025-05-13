
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ObservacoesProps {
  observacoes: string;
  setObservacoes: (value: string) => void;
}

const Observacoes = ({ observacoes, setObservacoes }: ObservacoesProps) => {
  return (
    <div className="space-y-4">
      <h2>Observações</h2>
      <div className="space-y-2">
        <Textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Informações adicionais ou observações específicas"
          rows={4}
        />
      </div>
    </div>
  );
};

export default Observacoes;
