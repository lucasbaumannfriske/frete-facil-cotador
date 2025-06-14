
import { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface AuditLogFiltersProps {
  logs: { user_email: string | null }[];
  selectedUser: string;
  setSelectedUser: (value: string) => void;
  selectedAction: string;
  setSelectedAction: (value: string) => void;
}

const actionTypes = [
  { value: "all", label: "Todas as Ações" },
  { value: "CREATE", label: "Criação" },
  { value: "UPDATE", label: "Edição" },
  { value: "DELETE", label: "Exclusão" },
];

const AuditLogFilters = ({
  logs,
  selectedUser,
  setSelectedUser,
  selectedAction,
  setSelectedAction,
}: AuditLogFiltersProps) => {
  const userOptions = useMemo(() => {
    const emails = new Set<string>();
    logs.forEach((log) => {
      if (log.user_email) emails.add(log.user_email);
    });
    return Array.from(emails);
  }, [logs]);

  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end mb-5">
      <div className="flex-1 min-w-[180px]">
        <label className="text-xs text-muted-foreground mb-1 block">Usuário</label>
        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por usuário" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os usuários</SelectItem>
            {userOptions.map((email) => (
              <SelectItem value={email} key={email}>
                {email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[160px]">
        <label className="text-xs text-muted-foreground mb-1 block">Ação</label>
        <Select value={selectedAction} onValueChange={setSelectedAction}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {actionTypes.map(({ value, label }) => (
              <SelectItem value={value} key={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {(selectedUser !== "all" || selectedAction !== "all") && (
        <Button
          variant="outline"
          className="mt-1 md:mt-0"
          onClick={() => {
            setSelectedUser("all");
            setSelectedAction("all");
          }}
        >
          Limpar filtros
        </Button>
      )}
    </div>
  );
};

export default AuditLogFilters;
