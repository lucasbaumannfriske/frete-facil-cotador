
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ActionButtonsProps {
  salvarCotacao: () => void;
  exportarEmail: () => void;
  limparFormulario: () => void;
}

const ActionButtons = ({ 
  salvarCotacao, 
  exportarEmail, 
  limparFormulario 
}: ActionButtonsProps) => {
  const handleSalvar = () => {
    salvarCotacao();
    toast.success("Cotação salva com sucesso!");
  };
  
  return (
    <div className="flex flex-wrap gap-3 mt-6">
      <Button onClick={handleSalvar}>
        Salvar Cotação
      </Button>
      <Button onClick={exportarEmail} variant="outline">
        Gerar Email
      </Button>
      <Button onClick={limparFormulario} variant="secondary">
        Nova Cotação
      </Button>
    </div>
  );
};

export default ActionButtons;
