
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditLog, useAuditLogs } from "@/hooks/useAuditLogs";
import { 
  FileTextIcon, 
  ActivityIcon,
  UserIcon,
  CalendarIcon,
  DatabaseIcon
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const LogsAuditoria = () => {
  const { logs, loading } = useAuditLogs();

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'Criação';
      case 'UPDATE':
        return 'Atualização';
      case 'DELETE':
        return 'Exclusão';
      default:
        return action;
    }
  };

  const getTableText = (tableName: string) => {
    switch (tableName) {
      case 'cotacoes':
        return 'Cotações';
      case 'produtos':
        return 'Produtos';
      case 'transportadoras':
        return 'Transportadoras';
      default:
        return tableName;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <ActivityIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50 animate-pulse" />
          <p className="text-muted-foreground">Carregando logs de auditoria...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <ActivityIcon className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Logs de Auditoria</h2>
      </div>
      
      <ScrollArea className="h-[600px] pr-4">
        {logs.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
            <FileTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">
              Nenhum log de auditoria encontrado.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              As atividades do sistema aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <Card key={log.id} className="border-l-4 border-l-primary/20 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getActionColor(log.action)}>
                        {getActionText(log.action)}
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <DatabaseIcon className="h-3 w-3" />
                        {getTableText(log.table_name)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarIcon className="h-3 w-3" />
                      {formatDate(log.created_at)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <UserIcon className="h-3 w-3" />
                    <span className="font-medium">{log.user_email || 'Usuário desconhecido'}</span>
                  </div>
                </CardHeader>
                
                {log.description && (
                  <CardContent className="pt-0">
                    <p className="text-sm bg-muted/30 p-3 rounded border-l-2 border-l-primary/30">
                      {log.description}
                    </p>
                  </CardContent>
                )}
                
                {(log.old_data || log.new_data) && (
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {log.old_data && (
                        <div>
                          <h4 className="font-medium text-muted-foreground mb-2">Dados Anteriores:</h4>
                          <pre className="bg-red-50 border border-red-200 p-2 rounded text-xs overflow-auto max-h-32">
                            {JSON.stringify(log.old_data, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {log.new_data && (
                        <div>
                          <h4 className="font-medium text-muted-foreground mb-2">Dados Novos:</h4>
                          <pre className="bg-green-50 border border-green-200 p-2 rounded text-xs overflow-auto max-h-32">
                            {JSON.stringify(log.new_data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default LogsAuditoria;
