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
  propostaFinal?: string;
}

const CteManager: React.FC<CteManagerProps> = ({ 
  cotacaoId, 
  transportadoraId, 
  transportadoraNome,
  propostaFinal 
}) => {
  const { ctes, loading, criarCte, deletarCte, baixarArquivo } = useCtes(cotacaoId, transportadoraId);
  const [numeroCte, setNumeroCte] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valorCte, setValorCte] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calcular saldo restante
  const propostaFinalNum = propostaFinal ? parseFloat(propostaFinal.replace(/[^\d,]/g, '').replace(',', '.')) : 0;
  const totalCtes = ctes.reduce((acc, cte) => acc + (cte.valor_cte || 0), 0);
  const saldoRestante = propostaFinalNum - totalCtes;

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseFloat(numbers) / 100;
    return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleValorCteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setValorCte(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroCte.trim()) {
      toast.error("Número do CTE é obrigatório");
      return;
    }

    const quantidadeNum = quantidade ? parseFloat(quantidade.replace(',', '.')) : undefined;
    const valorCteNum = valorCte ? parseFloat(valorCte.replace(/\./g, '').replace(',', '.')) : undefined;

    const sucesso = await criarCte(numeroCte, quantidadeNum, valorCteNum, arquivo || undefined);
    if (sucesso) {
      setNumeroCte("");
      setQuantidade("");
      setValorCte("");
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
                {propostaFinal && (
                  <div className="p-3 bg-muted/30 rounded-md border">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Proposta Final:</span>
                      <span className="font-semibold text-primary">R$ {propostaFinalNum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="font-medium">Saldo Restante:</span>
                      <span className={`font-semibold ${saldoRestante >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {saldoRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                )}
                
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Quantidade</label>
                    <Input
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                      placeholder="Ex: 100"
                      type="number"
                      step="0.01"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Valor CTE</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                      <Input
                        value={valorCte}
                        onChange={handleValorCteChange}
                        placeholder="0,00"
                        className="pl-9"
                      />
                    </div>
                  </div>
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
                      setQuantidade("");
                      setValorCte("");
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
                <div className="flex items-center gap-2 flex-1">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">CTE: {cte.numero_cte}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      {cte.quantidade && (
                        <span>Qtd: {cte.quantidade}</span>
                      )}
                      {cte.valor_cte && (
                        <span className="font-medium text-green-700">R$ {cte.valor_cte.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      )}
                    </div>
                    {cte.arquivo_nome && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
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