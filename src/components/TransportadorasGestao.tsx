
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTransportadorasCadastros, TransportadoraCadastro } from "@/hooks/useTransportadorasCadastros";
import { Edit, Trash2, Plus } from "lucide-react";

const initialForm: Omit<TransportadoraCadastro, "id" | "created_at" | "updated_at"> = {
  nome: "",
  email1: "",
  email2: "",
  telefone1: "",
  telefone2: "",
  cnpj: "",
};

// Função utilitária para aplicar a máscara ao digitar telefone
function maskTelefone(valor: string) {
  // Remove tudo que não seja dígito
  const digits = valor.replace(/\D/g, "");
  if (digits.length === 0) return "";
  // Celular: 11 dígitos, Fixo: 10 dígitos
  if (digits.length <= 10) {
    // (00) 0000-0000 (permite digitação progressiva)
    return digits
      .replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*/, function (_, ddd, p1, p2) {
        let out = "";
        if (ddd) out += `(${ddd}`;
        if (ddd && ddd.length === 2) out += ") ";
        if (p1) out += p1;
        if (p1 && p1.length === 4) out += "-";
        if (p2) out += p2;
        return out;
      });
  } else {
    // (00) 00000-0000
    return digits
      .replace(/^(\d{0,2})(\d{0,5})(\d{0,4}).*/, function (_, ddd, p1, p2) {
        let out = "";
        if (ddd) out += `(${ddd}`;
        if (ddd && ddd.length === 2) out += ") ";
        if (p1) out += p1;
        if (p1 && p1.length === 5) out += "-";
        if (p2) out += p2;
        return out;
      });
  }
}

// Função utilitária para aplicar a máscara ao digitar CNPJ
function maskCNPJ(valor: string) {
  // Remove tudo que não seja dígito
  const digits = valor.replace(/\D/g, "");
  if (digits.length === 0) return "";
  // CNPJ: 00.000.000/0000-00
  return digits
    .replace(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2}).*/, function (_, p1, p2, p3, p4, p5) {
      let out = "";
      if (p1) out += p1;
      if (p1 && p1.length === 2) out += ".";
      if (p2) out += p2;
      if (p2 && p2.length === 3) out += ".";
      if (p3) out += p3;
      if (p3 && p3.length === 3) out += "/";
      if (p4) out += p4;
      if (p4 && p4.length === 4) out += "-";
      if (p5) out += p5;
      return out;
    });
}

export default function TransportadorasGestao() {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  const {
    transportadoras,
    isLoading,
    addTransportadora,
    updateTransportadora,
    deleteTransportadora
  } = useTransportadorasCadastros();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Se for telefone, aplicar máscara
    if (name === "telefone1" || name === "telefone2") {
      setForm({ ...form, [name]: maskTelefone(value) });
    } else if (name === "cnpj") {
      setForm({ ...form, [name]: maskCNPJ(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome) return;
    if (!editing) {
      await addTransportadora(form);
      setForm(initialForm);
    } else {
      await updateTransportadora({ id: editing, ...form });
      setForm(initialForm);
      setEditing(null);
    }
  };

  const startEdit = (t: TransportadoraCadastro) => {
    setForm({
      nome: t.nome,
      email1: t.email1 || "",
      email2: t.email2 || "",
      telefone1: t.telefone1 || "",
      telefone2: t.telefone2 || "",
      cnpj: t.cnpj || "",
    });
    setEditing(t.id);
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(initialForm);
  };

  // Função utilitária para formatar telefone no display final
  function formatTelefone(telefone: string) {
    if (!telefone) return "";
    const digits = telefone.replace(/\D/g, "");
    if (digits.length === 11) {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (digits.length === 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return telefone;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold text-xl mb-4">{editing ? "Editar Transportadora" : "Cadastrar Transportadora"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="nome" value={form.nome} onChange={handleChange} required placeholder="Nome da transportadora" />
            <Input name="cnpj" value={form.cnpj} onChange={handleChange} placeholder="CNPJ" maxLength={18} />
            <div className="flex gap-2">
              <Input name="email1" type="email" value={form.email1} onChange={handleChange} placeholder="E-mail 1" />
              <Input name="email2" type="email" value={form.email2} onChange={handleChange} placeholder="E-mail 2" />
            </div>
            <div className="flex gap-2">
              <Input name="telefone1" value={form.telefone1} onChange={handleChange} placeholder="Telefone 1" maxLength={15} />
              <Input name="telefone2" value={form.telefone2} onChange={handleChange} placeholder="Telefone 2" maxLength={15} />
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editing ? "Salvar" : "Cadastrar"}</Button>
              {editing && <Button type="button" variant="outline" onClick={cancelEdit}>Cancelar</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-10">
        <h3 className="font-semibold mb-2">Transportadoras Cadastradas</h3>
        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <div className="space-y-2">
            {transportadoras.length === 0 && (<div>Nenhuma transportadora cadastrada.</div>)}
            {transportadoras.map(t => (
              <Card key={t.id} className="flex items-center gap-4 p-4 justify-between">
                <div className="flex-1">
                  <div className="font-bold">{t.nome}</div>
                  {t.cnpj && <div className="text-sm text-muted-foreground">CNPJ: {t.cnpj}</div>}
                  <div className="text-xs text-muted-foreground">
                    {t.email1} {t.email2 && <>&bull; {t.email2}</>}
                    {(t.telefone1 || t.telefone2) && (
                      <>
                        <br />
                        {t.telefone1 && <>{formatTelefone(t.telefone1)}</>}
                        {t.telefone2 && <>&nbsp;{formatTelefone(t.telefone2)}</>}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(t)}><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" variant="destructive" onClick={() => deleteTransportadora(t.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
