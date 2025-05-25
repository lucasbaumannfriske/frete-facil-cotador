
import { useState, useEffect } from 'react'
import { supabase, loginUsuarioLucas } from '@/lib/supabase'
import { CotacaoSalva } from '@/types'
import { toast } from 'sonner'

export const useCotacoes = () => {
  const [cotacoes, setCotacoes] = useState<CotacaoSalva[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  // Verificar autenticação
  const verificarAutenticacao = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Erro ao verificar usuário:', error)
        return false
      }
      
      if (!user) {
        console.log('Usuário não autenticado, fazendo login...')
        try {
          await loginUsuarioLucas()
          setAuthenticated(true)
          return true
        } catch (loginError) {
          console.error('Erro no login:', loginError)
          setAuthenticated(false)
          return false
        }
      } else {
        console.log('Usuário autenticado:', user.email)
        setAuthenticated(true)
        return true
      }
    } catch (error) {
      console.error('Erro na verificação de autenticação:', error)
      setAuthenticated(false)
      return false
    }
  }

  // Carregar cotações
  const carregarCotacoes = async () => {
    try {
      setLoading(true)
      
      // Verificar autenticação primeiro
      const isAuth = await verificarAutenticacao()
      if (!isAuth) {
        console.log('Não foi possível autenticar')
        return
      }
      
      console.log('Carregando cotações...')
      
      const { data: cotacoesData, error } = await supabase
        .from('cotacoes')
        .select(`
          *,
          produtos (*),
          transportadoras (*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar cotações:', error)
        toast.error('Erro ao carregar cotações: ' + error.message)
        return
      }

      console.log('Cotações carregadas:', cotacoesData)

      // Transformar dados
      const cotacoesFormatadas: CotacaoSalva[] = cotacoesData?.map(cotacao => ({
        id: cotacao.id,
        cliente: cotacao.cliente,
        fazenda: cotacao.fazenda || '',
        data: cotacao.data,
        endereco: cotacao.endereco || '',
        cidade: cotacao.cidade || '',
        estado: cotacao.estado || '',
        cep: cotacao.cep || '',
        origem: cotacao.origem || '',
        destino: cotacao.destino || '',
        roteiro: cotacao.roteiro || '',
        observacoes: cotacao.observacoes || '',
        produtos: cotacao.produtos?.map(p => ({
          id: p.id,
          nome: p.nome,
          quantidade: p.quantidade,
          peso: p.peso || ''
        })) || [],
        transportadoras: cotacao.transportadoras?.map(t => ({
          id: t.id,
          nome: t.nome,
          prazo: t.prazo || '',
          valorUnitario: t.valor_unitario || '',
          valorTotal: t.valor_total || '',
          status: t.status,
          propostaFinal: t.proposta_final || ''
        })) || []
      })) || []

      setCotacoes(cotacoesFormatadas)
      toast.success(`${cotacoesFormatadas.length} cotações carregadas`)
    } catch (error) {
      console.error('Erro inesperado:', error)
      toast.error('Erro inesperado ao carregar cotações')
    } finally {
      setLoading(false)
    }
  }

  // Salvar cotação
  const salvarCotacao = async (novaCotacao: Omit<CotacaoSalva, 'id'>) => {
    try {
      console.log('Salvando cotação...')
      
      const { data: { user } } = await supabase.auth.getUser()
           if (!user) {
        toast.error(\'Usuário não autenticado\')
        return false
      }

      // Formatar a data de DD/MM/AAAA para YYYY-MM-DD
      let dataFormatada = novaCotacao.data;
      try {
        const partesData = novaCotacao.data.split('/');
        if (partesData.length === 3) {
          dataFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;
        } else {
          // Se o formato já for ISO ou inválido, tenta usar como está ou loga um aviso
          console.warn('Formato de data inesperado:', novaCotacao.data);
        }
      } catch (e) {
        console.error('Erro ao formatar data:', e);
        // Mantém a data original se a formatação falhar
      }

      // Inserir cotação
      const { data: cotacaoData, error: cotacaoError } = await supabase
        .from('cotacoes')
        .insert({
          cliente: novaCotacao.cliente,
          fazenda: novaCotacao.fazenda,
          data: dataFormatada, // Formatada para YYYY-MM-DD
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
      }

      toast.success('Cotação salva com sucesso!')
      await carregarCotacoes()
      return true
    } catch (error) {
      console.error('Erro ao salvar cotação:', error)
      toast.error('Erro inesperado ao salvar cotação')
      return false
    }
  }

  // Atualizar cotação
  const atualizarCotacao = async (cotacaoAtualizada: CotacaoSalva) => {
    try {
      // Atualizar cotação principal
      const { error: cotacaoError } = await supabase
        .from('cotacoes')
        .update({
          cliente: cotacaoAtualizada.cliente,
          fazenda: cotacaoAtualizada.fazenda,
          endereco: cotacaoAtualizada.endereco,
          cidade: cotacaoAtualizada.cidade,
          estado: cotacaoAtualizada.estado,
          cep: cotacaoAtualizada.cep,
          origem: cotacaoAtualizada.origem,
          destino: cotacaoAtualizada.destino,
          roteiro: cotacaoAtualizada.roteiro,
          observacoes: cotacaoAtualizada.observacoes
        })
        .eq('id', cotacaoAtualizada.id)

      if (cotacaoError) {
        console.error('Erro ao atualizar cotação:', cotacaoError)
        toast.error('Erro ao atualizar cotação: ' + cotacaoError.message)
        return false
      }

      // Deletar e recriar produtos e transportadoras
      await supabase.from('produtos').delete().eq('cotacao_id', cotacaoAtualizada.id)
      await supabase.from('transportadoras').delete().eq('cotacao_id', cotacaoAtualizada.id)

      // Reinserir produtos
      if (cotacaoAtualizada.produtos.length > 0) {
        await supabase.from('produtos').insert(
          cotacaoAtualizada.produtos.map(produto => ({
            nome: produto.nome,
            quantidade: produto.quantidade,
            peso: produto.peso,
            cotacao_id: cotacaoAtualizada.id
          }))
        )
      }

      // Reinserir transportadoras
      if (cotacaoAtualizada.transportadoras.length > 0) {
        const { data: { user } } = await supabase.auth.getUser()
        await supabase.from('transportadoras').insert(
          cotacaoAtualizada.transportadoras.map(transportadora => ({
            nome: transportadora.nome,
            prazo: transportadora.prazo,
            valor_unitario: transportadora.valorUnitario,
            valor_total: transportadora.valorTotal,
            status: transportadora.status,
            proposta_final: transportadora.propostaFinal,
            cotacao_id: cotacaoAtualizada.id,
            user_id: user?.id
          }))
        )
      }

      toast.success('Cotação atualizada com sucesso!')
      await carregarCotacoes()
      return true
    } catch (error) {
      console.error('Erro ao atualizar cotação:', error)
      toast.error('Erro inesperado ao atualizar cotação')
      return false
    }
  }

  // Deletar cotação
  const deletarCotacao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cotacoes')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao deletar cotação:', error)
        toast.error('Erro ao deletar cotação: ' + error.message)
        return false
      }

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
