import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCtes } from "@/hooks/useCtes";
import { FileText, Upload, Download, Trash2, Plus, Paperclip } from "lucide-react";
import { toast } from "sonner";

interface CteManagerProps {
  cotacaoId: string;
  transportadoraId: string;
  transportadoraNome: string;
}

const CteManager: React.FC<CteManagerProps> = ({ 
  cotacaoId, 
  transportadoraId, 
  transportadoraNome 
}) => {
  const { ctes, loading, criarCte, deletarCte, baixarArquivo } = useCtes(cotacaoId, transportadoraId);
  const [numeroCte, setNumeroCte] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroCte.trim()) {
      toast.error("Número do CTE é obrigatório");
      return;
    }

    const sucesso = await criarCte(numeroCte, arquivo || undefined);
    if (sucesso) {
      setNumeroCte("");
      setArquivo(null);
      setDialogOpen(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar se é PDF
      if (file.type !== "application/pdf") {
        toast.error("Apenas arquivos PDF são aceitos");
        e.target.value = "";
        return;
      }
      
      // Verificar tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 10MB");
        e.target.value = "";
        return;
      }
      
      setArquivo(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-sm text-muted-foreground">Carregando CTEs...</div>
      </div>
    );
  }

  return (
    <Card className="mt-3">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            CTEs - {transportadoraNome}
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Adicionar CTE
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo CTE</DialogTitle>
                <DialogDescription>
                  Adicione o número do CTE e opcionalmente anexe o arquivo PDF.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Número do CTE *</label>
                  <Input
                    value={numeroCte}
                    onChange={(e) => setNumeroCte(e.target.value)}
                    placeholder="Ex: 123456789"
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Arquivo PDF (opcional)</label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="mt-1"
                  />
                  {arquivo && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Arquivo selecionado: {arquivo.name}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    <Upload className="h-4 w-4 mr-1" />
                    Salvar CTE
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setDialogOpen(false);
                      setNumeroCte("");
                      setArquivo(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {ctes.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Nenhum CTE adicionado ainda.
          </div>
        ) : (
          <div className="space-y-2">
            {ctes.map((cte) => (
              <div key={cte.id} className="flex items-center justify-between p-2 bg-muted/20 rounded border">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">CTE: {cte.numero_cte}</p>
                    {cte.arquivo_nome && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Paperclip className="h-3 w-3" />
                        {cte.arquivo_nome}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {cte.arquivo_url && cte.arquivo_nome && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => baixarArquivo(cte.arquivo_url!, cte.arquivo_nome!)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deletarCte(cte.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CteManager;