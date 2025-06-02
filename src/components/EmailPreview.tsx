
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Produto, Transportadora } from "@/types";
import { toast } from "sonner";

interface EmailPreviewProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  cliente: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  fazenda: string;
  origem: string;
  destino: string;
  produtos: Produto[];
  observacoes: string;
}

const EmailPreview = ({
  open,
  setOpen,
  cliente,
  endereco,
  cidade,
  estado,
  origem,
  destino,
  produtos,
  observacoes,
}: EmailPreviewProps) => {
  const copiarEmail = () => {
    const emailConteudo = document.getElementById("email-conteudo");
    if (emailConteudo) {
      const range = document.createRange();
      range.selectNode(emailConteudo);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      try {
        document.execCommand("copy");
        toast.success("Conteúdo do email copiado para a área de transferência!");
      } catch (err) {
        toast.error("Não foi possível copiar o email. Por favor, selecione e copie manualmente.");
      }

      window.getSelection()?.removeAllRanges();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prévia do Email</DialogTitle>
        </DialogHeader>
        <div id="email-conteudo" className="text-left">
          <p>Prezado(a) Transportador(a),</p>

          <p className="my-4">Solicito cotação para o seguinte frete:</p>

          <Card className="mb-4">
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p><strong>Cliente:</strong> {cliente}</p>
                  <p><strong>Endereço de entrega:</strong> {endereco}</p>
                  <p><strong>Cidade:</strong> {cidade}</p>
                </div>
                <div>
                  <p><strong>Origem:</strong> {origem || "N/A"}</p>
                  <p><strong>Destino:</strong> {destino || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Produtos:</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Produto</th>
                    <th className="text-left py-2">Quantidade</th>
                    <th className="text-left py-2">Peso (kg)</th>
                    <th className="text-left py-2">Embalagem</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.filter(p => p.nome).map((produto, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{produto.nome}</td>
                      <td className="py-2">{produto.quantidade}</td>
                      <td className="py-2">{produto.peso || "N/A"}</td>
                      <td className="py-2">{produto.embalagem || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Por favor, preencha as informações de frete:</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Prazo de Entrega (dias)</th>
                    <th className="text-left py-2">Valor Unitário (R$)</th>
                    <th className="text-left py-2">Valor Total (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">[Prazo]</td>
                    <td className="py-2">[Valor Unitário]</td>
                    <td className="py-2">[Valor Total]</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {observacoes && (
            <p className="mb-4">
              <strong>Observações:</strong> {observacoes}
            </p>
          )}

          <p className="my-4">Agradeço a atenção e aguardo a sua cotação.</p>
          <p>Atenciosamente,</p>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={copiarEmail} variant="outline">
            Copiar Email
          </Button>
          <Button onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailPreview;
