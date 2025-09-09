
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Produto } from "@/types";
import { useSafras } from "@/hooks/useSafras";
import { useGrupos } from "@/hooks/useGrupos";

interface ProdutosTableProps {
  produtos: Produto[];
  setProdutos: (produtos: Produto[]) => void;
  atualizarTotais: () => void;
}

const ProdutosTable = ({
  produtos,
  setProdutos,
  atualizarTotais,
}: ProdutosTableProps) => {
  const { safras } = useSafras();
  const { grupos } = useGrupos();
  const adicionarProduto = () => {
    setProdutos([
      ...produtos,
      {
        id: Date.now().toString(),
        nome: "",
        quantidade: 1,
        peso: "",
        embalagem: "",
        safra_id: "",
        grupo_id: "",
      },
    ]);
  };

  const removerProduto = (id: string) => {
    setProdutos(produtos.filter((produto) => produto.id !== id));
    atualizarTotais();
  };

  const atualizarProduto = (id: string, campo: keyof Produto, valor: string | number) => {
    setProdutos(
      produtos.map((produto) =>
        produto.id === id ? { ...produto, [campo]: valor } : produto
      )
    );
    
    if (campo === "quantidade") {
      atualizarTotais();
    }
  };

  return (
    <div className="space-y-4">
      <h2>Produtos e Quantidades</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Safra</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Peso (kg)</TableHead>
              <TableHead>Embalagem</TableHead>
              <TableHead className="w-[100px]">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtos.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>
                  <Input
                    className="min-w-[200px]"
                    value={produto.nome}
                    onChange={(e) =>
                      atualizarProduto(produto.id, "nome", e.target.value)
                    }
                    placeholder="Nome do produto"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={produto.safra_id}
                    onValueChange={(value) =>
                      atualizarProduto(produto.id, "safra_id", value)
                    }
                  >
                    <SelectTrigger className="min-w-[120px]">
                      <SelectValue placeholder="Selecionar safra" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhuma</SelectItem>
                      {safras.map((safra) => (
                        <SelectItem key={safra.id} value={safra.id}>
                          {safra.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={produto.grupo_id}
                    onValueChange={(value) =>
                      atualizarProduto(produto.id, "grupo_id", value)
                    }
                  >
                    <SelectTrigger className="min-w-[120px]">
                      <SelectValue placeholder="Selecionar grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {grupos.map((grupo) => (
                        <SelectItem key={grupo.id} value={grupo.id}>
                          {grupo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={produto.quantidade}
                    onChange={(e) =>
                      atualizarProduto(produto.id, "quantidade", Number(e.target.value))
                    }
                    min="1"
                    step="1"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={produto.peso}
                    onChange={(e) =>
                      atualizarProduto(produto.id, "peso", e.target.value)
                    }
                    min="0"
                    step="0.1"
                    placeholder="Peso em kg"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={produto.embalagem}
                    onChange={(e) =>
                      atualizarProduto(produto.id, "embalagem", e.target.value)
                    }
                    placeholder="Tipo de embalagem"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removerProduto(produto.id)}
                  >
                    Remover
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button onClick={adicionarProduto} className="mt-2">
        Adicionar Produto
      </Button>
    </div>
  );
};

export default ProdutosTable;
