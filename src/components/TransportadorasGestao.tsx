
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
};

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
    setForm({ ...form, [e.target.name]: e.target.value });
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
    });
    setEditing(t.id);
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(initialForm);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold text-xl mb-4">{editing ? "Editar Transportadora" : "Cadastrar Transportadora"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="nome" value={form.nome} onChange={handleChange} required placeholder="Nome da transportadora" />
            <div className="flex gap-2">
              <Input name="email1" type="email" value={form.email1} onChange={handleChange} placeholder="E-mail 1" />
              <Input name="email2" type="email" value={form.email2} onChange={handleChange} placeholder="E-mail 2" />
            </div>
            <div className="flex gap-2">
              <Input name="telefone1" value={form.telefone1} onChange={handleChange} placeholder="Telefone 1" />
              <Input name="telefone2" value={form.telefone2} onChange={handleChange} placeholder="Telefone 2" />
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
                  <div className="text-xs text-muted-foreground">
                    {t.email1} {t.email2 && <>&bull; {t.email2}</>}
                    {t.telefone1 && (<><br />{t.telefone1}</>)}
                    {t.telefone2 && (<>&nbsp;{t.telefone2}</>)}
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
