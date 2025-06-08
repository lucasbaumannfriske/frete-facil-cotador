
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CotacaoSalva } from '@/types'
import { toast } from 'sonner'

export const useCotacoes = () => {
  const [cotacoes, setCotacoes] = useState<CotacaoSalva[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  // Verificar se o usuário está autenticado
  const verificarAutenticacao = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.log('Erro ao verificar usuário:', error)
        setAuthenticated(false)
        return null
      }
      
      if (user) {
        console.log('Usuário autenticado:', user.email)
        setAuthenticated(true)
        return user
      } else {
        console.log('Usuário não autenticado')
        setAuthenticated(false)
        return null
      }
    } catch (error) {
      console.error('Erro na verificação de autenticação:', error)
      setAuthenticated(false)
      return null
    }
  }

  // Função para criar log de auditoria
  const criarLogAuditoria = async (action: string, tableName: string, recordId?: string, oldData?: any, newData?: any, description?: string) => {
    try {
      const user = await verificarAutenticacao()
      if (!user) return

      await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          user_email: user.email,
          action,
          table_name: tableName,
          record_id: recordId,
          old_data: oldData,
          new_data: newData,
          description
        })

      console.log(`Log de auditoria criado: ${action} em ${tableName}`)
    } catch (error) {
      console.error('Erro ao criar log de auditoria:', error)
    }
  }

  // Carregar cotações (apenas não deletadas)
  const carregarCotacoes = async () => {
    try {
      setLoading(true)
      
      // Verificar se o usuário está autenticado
      const user = await verificarAutenticacao()
      if (!user) {
        console.log('Usuário não autenticado - não é possível carregar cotações')
        setLoading(false)
        return
      }
      
      console.log('Carregando cotações do Supabase...')
      
      const { data: cotacoesData, error } = await supabase
        .from('cotacoes')
        .select(`
          *,
          produtos (*),
          transportadoras (*)
        `)
        .is('deleted_at', null) // Apenas cotações não deletadas
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar cotações:', error)
        toast.error('Erro ao carregar cotações: ' + error.message)
        setCotacoes([])
        return
      }

      console.log('Dados carregados:', cotacoesData)

      // Transformar dados para o formato esperado
      const cotacoesFormatadas: CotacaoSalva[] = (cotacoesData || []).map(cotacao => ({
        id: cotacao.id,
        cliente: cotacao.cliente || '',
        fazenda: cotacao.fazenda || '',
        data: cotacao.data || '',
        endereco: cotacao.endereco || '',
        cidade: cotacao.cidade || '',
        estado: cotacao.estado || '',
        cep: cotacao.cep || '',
        origem: cotacao.origem || '',
        destino: cotacao.destino || '',
        roteiro: cotacao.roteiro || '',
        observacoes: cotacao.observacoes || '',
        produtos: (cotacao.produtos || [])
          .filter((p: any) => !p.deleted_at) // Filtrar produtos não deletados
          .map((p: any) => ({
            id: p.id,
            nome: p.nome || '',
            quantidade: p.quantidade || 1,
            peso: p.peso || ''
          })),
        transportadoras: (cotacao.transportadoras || [])
          .filter((t: any) => !t.deleted_at) // Filtrar transportadoras não deletadas
          .map((t: any) => ({
            id: t.id,
            nome: t.nome || '',
            prazo: t.prazo || '',
            valorUnitario: t.valor_unitario || '',
            valorTotal: t.valor_total || '',
            status: t.status || 'Pendente',
            propostaFinal: t.proposta_final || ''
          }))
      }))

      setCotacoes(cotacoesFormatadas)
      toast.success(`${cotacoesFormatadas.length} cotações carregadas com sucesso`)
      
    } catch (error) {
      console.error('Erro inesperado ao carregar cotações:', error)
      toast.error('Erro inesperado ao carregar cotações')
      setCotacoes([])
    } finally {
      setLoading(false)
    }
  }

  // Salvar cotação
  const salvarCotacao = async (novaCotacao: Omit<CotacaoSalva, 'id'>) => {
    try {
      console.log('Iniciando salvamento da cotação...')
      
      // Verificar se o usuário está autenticado
      const user = await verificarAutenticacao()
      if (!user) {
        toast.error('Usuário não autenticado')
        return false
      }

      console.log('Usuário autenticado para salvamento:', user.email, 'ID:', user.id)

      // Inserir cotação principal
      const { data: cotacaoData, error: cotacaoError } = await supabase
        .from('cotacoes')
        .insert({
          cliente: novaCotacao.cliente,
          fazenda: novaCotacao.fazenda,
          data: novaCotacao.data,
          endereco: novaCotacao.endereco,
          cidade: novaCotacao.cidade,
          estado: novaCotacao.estado,
          cep: novaCotacao.cep,
          origem: novaCotacao.origem,
          destino: novaCotacao.destino,
          roteiro: novaCotacao.roteiro,
          observacoes: novaCotacao.observacoes,
          user_id: user.id
        })
        .select()
        .single()

      if (cotacaoError) {
        console.error('Erro ao salvar cotação:', cotacaoError)
        toast.error('Erro ao salvar cotação: ' + cotacaoError.message)
        return false
      }

      console.log('Cotação salva:', cotacaoData)

      // Log de auditoria para criação da cotação
      await criarLogAuditoria('CREATE', 'cotacoes', cotacaoData.id, null, cotacaoData, `Cotação criada para cliente: ${novaCotacao.cliente}`)

      // Inserir produtos
      if (novaCotacao.produtos.length > 0) {
        const { error: produtosError } = await supabase
          .from('produtos')
          .insert(
            novaCotacao.produtos.map(produto => ({
              nome: produto.nome,
              quantidade: produto.quantidade,
              peso: produto.peso,
              cotacao_id: cotacaoData.id
            }))
          )

        if (produtosError) {
          console.error('Erro ao salvar produtos:', produtosError)
          toast.error('Erro ao salvar produtos: ' + produtosError.message)
          return false
        }

        // Log de auditoria para produtos
        await criarLogAuditoria('CREATE', 'produtos', cotacaoData.id, null, novaCotacao.produtos, `${novaCotacao.produtos.length} produtos adicionados`)
      }

      // Inserir transportadoras
      if (novaCotacao.transportadoras.length > 0) {
        const { error: transportadorasError } = await supabase
          .from('transportadoras')
          .insert(
            novaCotacao.transportadoras.map(transportadora => ({
              nome: transportadora.nome,
              prazo: transportadora.prazo,
              valor_unitario: transportadora.valorUnitario,
              valor_total: transportadora.valorTotal,
              status: transportadora.status,
              proposta_final: transportadora.propostaFinal,
              cotacao_id: cotacaoData.id,
              user_id: user.id
            }))
          )

        if (transportadorasError) {
          console.error('Erro ao salvar transportadoras:', transportadorasError)
          toast.error('Erro ao salvar transportadoras: ' + transportadorasError.message)
          return false
        }

        // Log de auditoria para transportadoras
        await criarLogAuditoria('CREATE', 'transportadoras', cotacaoData.id, null, novaCotacao.transportadoras, `${novaCotacao.transportadoras.length} transportadoras adicionadas`)
      }

      toast.success('Cotação salva com sucesso!')
      await carregarCotacoes() // Recarregar dados
      return true
      
    } catch (error) {
      console.error('Erro inesperado ao salvar:', error)
      toast.error('Erro inesperado ao salvar cotação')
      return false
    }
  }

  // Atualizar cotação
  const atualizarCotacao = async (cotacao: CotacaoSalva) => {
    try {
      console.log('Atualizando cotação:', cotacao.id)

      // Verificar se o usuário está autenticado
      const user = await verificarAutenticacao()
      if (!user) {
        toast.error('Usuário não autenticado')
        return false
      }

      // Buscar dados antigos para o log
      const { data: cotacaoAntiga } = await supabase
        .from('cotacoes')
        .select('*')
        .eq('id', cotacao.id)
        .single()

      // Atualizar cotação principal
      const { error: cotacaoError } = await supabase
        .from('cotacoes')
        .update({
          cliente: cotacao.cliente,
          fazenda: cotacao.fazenda,
          data: cotacao.data,
          endereco: cotacao.endereco,
          cidade: cotacao.cidade,
          estado: cotacao.estado,
          cep: cotacao.cep,
          origem: cotacao.origem,
          destino: cotacao.destino,
          roteiro: cotacao.roteiro,
          observacoes: cotacao.observacoes
        })
        .eq('id', cotacao.id)

      if (cotacaoError) {
        console.error('Erro ao atualizar cotação:', cotacaoError)
        toast.error('Erro ao atualizar cotação: ' + cotacaoError.message)
        return false
      }

      // Log de auditoria para atualização da cotação
      await criarLogAuditoria('UPDATE', 'cotacoes', cotacao.id, cotacaoAntiga, cotacao, `Cotação atualizada para cliente: ${cotacao.cliente}`)

      // Atualizar produtos (soft delete dos antigos e inserir novos)
      await supabase
        .from('produtos')
        .update({ deleted_at: new Date().toISOString() })
        .eq('cotacao_id', cotacao.id)

      if (cotacao.produtos.length > 0) {
        const { error: produtosError } = await supabase
          .from('produtos')
          .insert(
            cotacao.produtos.map(produto => ({
              nome: produto.nome,
              quantidade: produto.quantidade,
              peso: produto.peso,
              cotacao_id: cotacao.id
            }))
          )

        if (produtosError) {
          console.error('Erro ao atualizar produtos:', produtosError)
          toast.error('Erro ao atualizar produtos: ' + produtosError.message)
          return false
        }

        await criarLogAuditoria('UPDATE', 'produtos', cotacao.id, null, cotacao.produtos, `Produtos atualizados: ${cotacao.produtos.length} itens`)
      }

      // Atualizar transportadoras (soft delete das antigas e inserir novas)
      await supabase
        .from('transportadoras')
        .update({ deleted_at: new Date().toISOString() })
        .eq('cotacao_id', cotacao.id)

      if (cotacao.transportadoras.length > 0) {
        const { error: transportadorasError } = await supabase
          .from('transportadoras')
          .insert(
            cotacao.transportadoras.map(transportadora => ({
              nome: transportadora.nome,
              prazo: transportadora.prazo,
              valor_unitario: transportadora.valorUnitario,
              valor_total: transportadora.valorTotal,
              status: transportadora.status,
              proposta_final: transportadora.propostaFinal,
              cotacao_id: cotacao.id,
              user_id: user.id
            }))
          )

        if (transportadorasError) {
          console.error('Erro ao atualizar transportadoras:', transportadorasError)
          toast.error('Erro ao atualizar transportadoras: ' + transportadorasError.message)
          return false
        }

        await criarLogAuditoria('UPDATE', 'transportadoras', cotacao.id, null, cotacao.transportadoras, `Transportadoras atualizadas: ${cotacao.transportadoras.length} itens`)
      }

      toast.success('Cotação atualizada com sucesso!')
      await carregarCotacoes() // Recarregar dados
      return true

    } catch (error) {
      console.error('Erro inesperado ao atualizar:', error)
      toast.error('Erro inesperado ao atualizar cotação')
      return false
    }
  }

  // Soft delete de cotação
  const deletarCotacao = async (id: string) => {
    try {
      // Verificar se o usuário está autenticado
      const user = await verificarAutenticacao()
      if (!user) {
        toast.error('Usuário não autenticado')
        return false
      }

      // Buscar dados da cotação para o log
      const { data: cotacaoData } = await supabase
        .from('cotacoes')
        .select('*')
        .eq('id', id)
        .single()

      // Soft delete da cotação
      const { error } = await supabase
        .from('cotacoes')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) {
        console.error('Erro ao deletar cotação:', error)
        toast.error('Erro ao deletar cotação: ' + error.message)
        return false
      }

      // Soft delete dos produtos e transportadoras relacionados
      await supabase
        .from('produtos')
        .update({ deleted_at: new Date().toISOString() })
        .eq('cotacao_id', id)

      await supabase
        .from('transportadoras')
        .update({ deleted_at: new Date().toISOString() })
        .eq('cotacao_id', id)

      // Log de auditoria
      await criarLogAuditoria('DELETE', 'cotacoes', id, cotacaoData, null, `Cotação removida (soft delete) para cliente: ${cotacaoData?.cliente}`)

      toast.success('Cotação removida com sucesso!')
      await carregarCotacoes()
      return true
    } catch (error) {
      console.error('Erro ao deletar cotação:', error)
      toast.error('Erro inesperado ao deletar cotação')
      return false
    }
  }

  useEffect(() => {
    carregarCotacoes()
  }, [])

  return {
    cotacoes,
    loading,
    authenticated,
    salvarCotacao,
    atualizarCotacao,
    deletarCotacao,
    carregarCotacoes
  }
}
