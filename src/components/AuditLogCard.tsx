
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  UserIcon,
  CalendarIcon,
  DatabaseIcon,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AuditLog } from "@/hooks/useAuditLogs";

interface AuditLogCardProps {
  log: AuditLog;
  formatChanges: (oldData: any, newData: any, tableName: string) => string | null;
  getActionColor: (action: string) => string;
  getActionText: (action: string) => string;
  getTableText: (tableName: string) => string;
  formatDate: (dateString: string) => string;
}

const AuditLogCard = ({
  log,
  formatChanges,
  getActionColor,
  getActionText,
  getTableText,
  formatDate,
}: AuditLogCardProps) => {
  const changes =
    log.action === "UPDATE"
      ? formatChanges(log.old_data, log.new_data, log.table_name)
      : null;

  return (
    <Card
      key={log.id}
      className="border-l-4 border-l-primary/20 shadow-sm overflow-x-auto"
      style={{ maxWidth: "100%", wordBreak: "break-word" }}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getActionColor(log.action)}>
              {getActionText(log.action)}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <DatabaseIcon className="h-3 w-3" />
              <span className="truncate max-w-[110px]">{getTableText(log.table_name)}</span>
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
            <CalendarIcon className="h-3 w-3" />
            {formatDate(log.created_at)}
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1 whitespace-pre-line break-all">
          <UserIcon className="h-3 w-3" />
          <span className="font-medium truncate max-w-[220px]">{log.user_email || "Usuário desconhecido"}</span>
        </div>
      </CardHeader>

      {log.description && (
        <CardContent className="pt-0">
          <p className="text-sm bg-muted/40 p-3 rounded border-l-2 border-l-primary/30 max-w-full break-words whitespace-pre-line">
            {log.description}
          </p>
        </CardContent>
      )}

      {changes && (
        <CardContent className="pt-0">
          <div className="text-sm">
            <h4 className="font-medium text-muted-foreground mb-2">
              Alterações:
            </h4>
            <p className="bg-blue-50 border border-blue-200 p-3 rounded text-xs max-w-full break-words whitespace-pre-line">
              {changes}
            </p>
          </div>
        </CardContent>
      )}

      {log.action === "CREATE" && log.new_data && (
        <CardContent className="pt-0">
          <div className="text-sm">
            <h4 className="font-medium text-muted-foreground mb-2">
              Registro Criado:
            </h4>
            <p className="bg-green-50 border border-green-200 p-3 rounded text-xs max-w-full break-words whitespace-pre-line">
              {log.table_name === "cotacoes" &&
                `Cliente: ${log.new_data.cliente}`}
              {log.table_name === "transportadoras" &&
                `Transportadora: ${log.new_data.nome}`}
              {log.table_name === "produtos" &&
                `Produto: ${log.new_data.nome}`}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AuditLogCard;
