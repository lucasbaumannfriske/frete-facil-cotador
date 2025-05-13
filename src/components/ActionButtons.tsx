
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Send, FilePlus } from "lucide-react";

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
      <Button onClick={handleSalvar} className="shadow-sm">
        <Save className="mr-2 h-4 w-4" />
        Salvar Cotação
      </Button>
      <Button onClick={exportarEmail} variant="outline" className="shadow-sm">
        <Send className="mr-2 h-4 w-4" />
        Gerar Email
      </Button>
      <Button onClick={limparFormulario} variant="secondary" className="shadow-sm">
        <FilePlus className="mr-2 h-4 w-4" />
        Nova Cotação
      </Button>
    </div>
  );
};

export default ActionButtons;
