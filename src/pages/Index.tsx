import { useState } from "react";
import ClienteForm from "@/components/ClienteForm";
import ProdutosTable from "@/components/ProdutosTable";
import TransportadorasTable from "@/components/TransportadorasTable";
import Observacoes from "@/components/Observacoes";
import ActionButtons from "@/components/ActionButtons";
import EmailPreview from "@/components/EmailPreview";
import HistoricoCotacoes from "@/components/HistoricoCotacoes";
import LogsAuditoria from "@/components/LogsAuditoria";
import { Produto, Transportadora } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { PackageIcon, TruckIcon } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { useCotacoes } from "@/hooks/useCotacoes";

const getDataLocalFormat = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const Index = () => {
  // Hook para gerenciar cotações no Supabase
  const { cotacoes, loading, salvarCotacao: salvarCotacaoSupabase } = useCotacoes();

  // Estado para informações do cliente/tomador
  const [cliente, setCliente] = useState("");
  const [cidade, setCidade] = useState("");
  
  // Estado para detalhes do frete
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [roteiro, setRoteiro] = useState("");
  
  // Campos originais mantidos para compatibilidade
  const [endereco, setEndereco] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");
  const [fazenda, setFazenda] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Estado para produtos e transportadoras
  const [produtos, setProdutos] = useState<Produto[]>([
    { id: "1", nome: "", quantidade: 1, peso: "", embalagem: "" },
  ]);
  const [transportadoras, setTransportadoras] = useState<Transportadora[]>([
    { id: "1", nome: "", prazo: "", valorUnitario: "", valorTotal: "", status: "Pendente", propostaFinal: "" },
  ]);

  // Estado para preview de email
  const [emailAberto, setEmailAberto] = useState(false);
  
  // Estado para controlar a guia ativa
  const [activeTab, setActiveTab] = useState("nova-cotacao");

  // Função para calcular o total de cada transportadora
  const calcularTotal = (id: string, valorUnitarioStr: string) => {
    const valorUnitario = parseFloat(valorUnitarioStr) || 0;

    // Calcular a soma total de quantidades de produtos
    const qtdTotal = produtos.reduce(
      (total, produto) => total + (produto.quantidade || 0),
      0
    );

    const valorTotal = valorUnitario * qtdTotal;

    setTransportadoras(
      transportadoras.map((transp) =>
        transp.id === id
          ? { ...transp, valorTotal: valorTotal.toFixed(2) }
          : transp
      )
    );
  };

  // Atualizar todos os totais quando mudar a quantidade de produtos
  const atualizarTotais = () => {
    transportadoras.forEach((transp) => {
      if (transp.valorUnitario) {
        calcularTotal(transp.id, transp.valorUnitario);
      }
    });
  };

  // Salvar cotação no Supabase
  const salvarCotacao = async () => {
    if (!cliente) {
      toast.error("Por favor, informe o nome do cliente");
      return;
    }

    // Filtrar produtos e transportadoras vazios
    const produtosValidos = produtos.filter((p) => p.nome.trim() !== "");
    const transportadorasValidas = transportadoras.filter((t) => t.nome.trim() !== "");

    if (produtosValidos.length === 0) {
      toast.error("Adicione pelo menos um produto");
      return;
    }

    if (transportadorasValidas.length === 0) {
      toast.error("Adicione pelo menos uma transportadora");
      return;
    }

    const novaCotacao = {
      cliente,
      fazenda,
      // Corrigido: salvar a data local (YYYY-MM-DD)
      data: getDataLocalFormat(),
      endereco,
      cidade,
      estado,
      cep,
      origem,
      destino,
      roteiro,
      produtos: produtosValidos,
      transportadoras: transportadorasValidas,
      observacoes,
    };

    const sucesso = await salvarCotacaoSupabase(novaCotacao);
    
    if (sucesso) {
      // Limpar formulário após salvar com sucesso
      limparFormulario();
    }
  };

  // Limpar formulário para nova cotação
  const limparFormulario = () => {
    setCliente("");
    setCidade("");
    setOrigem("");
    setDestino("");
    setRoteiro("");
    setEndereco("");
    setEstado("");
    setCep("");
    setFazenda("");
    setObservacoes("");
    setProdutos([{ id: "1", nome: "", quantidade: 1, peso: "", embalagem: "" }]);
    setTransportadoras([
      { id: "1", nome: "", prazo: "", valorUnitario: "", valorTotal: "", status: "Pendente", propostaFinal: "" },
    ]);
    toast.info("Formulário limpo");
  };

  // Exibir preview do email
  const exportarEmail = () => {
    if (!cliente) {
      toast.error("Por favor, informe o nome do cliente");
      return;
    }

    setEmailAberto(true);
  };

  return (
    <div>
      <Navigation />
      <div className="container max-w-6xl py-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <TruckIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-center">Planilha de Cotação de Frete</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="nova-cotacao" className="text-base">Nova Cotação</TabsTrigger>
            <TabsTrigger value="historico" className="text-base">Histórico de Cotações</TabsTrigger>
          </TabsList>

          <TabsContent value="nova-cotacao">
            <Card className="border-t-4 border-t-primary shadow-md">
              <CardContent className="p-6 space-y-8">
                <div className="flex items-center gap-2 pb-2 mb-4 border-b">
                  <PackageIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Nova Cotação</h2>
                </div>
                
                <ClienteForm
                  cliente={cliente}
                  setCliente={setCliente}
                  cidade={cidade}
                  setCidade={setCidade}
                  origem={origem}
                  setOrigem={setOrigem}
                  destino={destino}
                  setDestino={setDestino}
                  roteiro={roteiro}
                  setRoteiro={setRoteiro}
                  endereco={endereco}
                  setEndereco={setEndereco}
                  estado={estado}
                  setEstado={setEstado}
                  cep={cep}
                  setCep={setCep}
                  fazenda={fazenda}
                  setFazenda={setFazenda}
                />

                <ProdutosTable
                  produtos={produtos}
                  setProdutos={setProdutos}
                  atualizarTotais={atualizarTotais}
                />

                <TransportadorasTable
                  transportadoras={transportadoras}
                  setTransportadoras={setTransportadoras}
                  calcularTotal={calcularTotal}
                />

                <Observacoes
                  observacoes={observacoes}
                  setObservacoes={setObservacoes}
                />

                <ActionButtons
                  salvarCotacao={salvarCotacao}
                  exportarEmail={exportarEmail}
                  limparFormulario={limparFormulario}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="historico" className="mt-0">
            <Card className="border-t-4 border-t-primary shadow-md">
              <CardContent className="p-6">
                <HistoricoCotacoes 
                  cotacoes={cotacoes} 
                  loading={loading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <EmailPreview
          open={emailAberto}
          setOpen={setEmailAberto}
          cliente={cliente}
          endereco={endereco}
          cidade={cidade}
          estado={estado}
          cep={cep}
          fazenda={fazenda}
          origem={origem}
          destino={destino}
          roteiro={roteiro}
          produtos={produtos}
          observacoes={observacoes}
        />
      </div>
    </div>
  );
};

export default Index;
