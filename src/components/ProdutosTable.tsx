
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
import { Produto } from "@/types";

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
  const adicionarProduto = () => {
    setProdutos([
      ...produtos,
      {
        id: Date.now().toString(),
        nome: "",
        quantidade: 1,
        peso: "",
        embalagem: "",
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
