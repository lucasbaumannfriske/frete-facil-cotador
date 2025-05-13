
export interface Produto {
  id: string;
  nome: string;
  quantidade: number;
  peso: string;
}

export interface Transportadora {
  id: string;
  nome: string;
  prazo: string;
  valorUnitario: string;
  valorTotal: string;
  status: string;
}

export interface CotacaoSalva {
  id: string;
  cliente: string;
  fazenda: string;
  data: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  origem?: string;
  destino?: string;
  roteiro?: string;
  produtos: Produto[];
  transportadoras: Transportadora[];
  observacoes: string;
}
