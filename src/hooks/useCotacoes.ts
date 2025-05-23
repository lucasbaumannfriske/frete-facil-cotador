
import { useState, useEffect } from 'react'
import { supabase, loginUsuarioLucas } from '@/lib/supabase'
import { CotacaoSalva } from '@/types'
import { toast } from 'sonner'

export const useCotacoes = () => {
  const [cotacoes, setCotacoes] = useState<CotacaoSalva[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  // Verificar e fazer login automático
  const verificarAutenticacao = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.log('Usuário não autenticado, fazendo login automático...')
        const loginSuccess = await loginUsuarioLucas()
        
        if (loginSuccess) {
          setAuthenticated(true)
          console.log('Login automático realizado com sucesso')
        } else {
          console.error('Falha no login automático')
          toast.error('Erro na autenticação')
          setAuthenticated(false)
        }
      } else {
        console.log('Usuário já autenticado:', user.email)
        setAuthenticated(true)
      }
    } catch (error) {
      console.error('Erro na verificação de autenticação:', error)
      setAuthenticated(false)
    }
  }

  // Carregar cotações do Supabase
  const carregarCotacoes = async () => {
    try {
      setLoading(true)
      
      // Verificar autenticação primeiro
      if (!authenticated) {
        await verificarAutenticacao()
      }
      
      // Buscar cotações com produtos e transportadoras
      const { data: cotacoesData, error: cotacoesError } = await supabase
        .from('cotacoes')
        .select(`
          *,
          produtos (*),
          transportadoras (*)
        `)
        .order('created_at', { ascending: false })

      if (cotacoesError) {
        console.error('Erro ao carregar cotações:', cotacoesError)
        toast.error('Erro ao carregar cotações: ' + cotacoesError.message)
        return
      }

      console.log('Cotações carregadas:', cotacoesData)

      // Transformar dados do Supabase para o formato do frontend
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
      console.error('Erro ao carregar cotações:', error)
      toast.error('Erro inesperado ao carregar cotações')
    } finally {
      setLoading(false)
    }
  }

  // Salvar nova cotação
  const salvarCotacao = async (novaCotacao: Omit<CotacaoSalva, 'id'>) => {
    try {
      console.log('Iniciando salvamento da cotação...')
      
      // Verificar autenticação
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.log('Usuário não autenticado, tentando login automático...')
        const loginSuccess = await loginUsuarioLucas()
        
        if (!loginSuccess) {
          toast.error('Erro na autenticação')
          return false
        }
      }

      console.log('Usuário autenticado, salvando cotação...')

      // Inserir cotação
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
          user_id: user?.id
        })
        .select()
        .single()

      if (cotacaoError) {
        console.error('Erro ao salvar cotação:', cotacaoError)
        toast.error('Erro ao salvar cotação: ' + cotacaoError.message)
        return false
      }

      console.log('Cotação salva:', cotacaoData)

      // Inserir produtos
      if (novaCotacao.produtos.length > 0) {
        const produtosParaInserir = novaCotacao.produtos.map(produto => ({
          nome: produto.nome,
          quantidade: produto.quantidade,
          peso: produto.peso,
          cotacao_id: cotacaoData.id
        }))

        const { error: produtosError } = await supabase
          .from('produtos')
          .insert(produtosParaInserir)

        if (produtosError) {
          console.error('Erro ao salvar produtos:', produtosError)
          toast.error('Erro ao salvar produtos: ' + produtosError.message)
          return false
        }
        console.log('Produtos salvos com sucesso')
      }

      // Inserir transportadoras
      if (novaCotacao.transportadoras.length > 0) {
        const transportadorasParaInserir = novaCotacao.transportadoras.map(transportadora => ({
          nome: transportadora.nome,
          prazo: transportadora.prazo,
          valor_unitario: transportadora.valorUnitario,
          valor_total: transportadora.valorTotal,
          status: transportadora.status,
          proposta_final: transportadora.propostaFinal,
          cotacao_id: cotacaoData.id,
          user_id: user?.id
        }))

        const { error: transportadorasError } = await supabase
          .from('transportadoras')
          .insert(transportadorasParaInserir)

        if (transportadorasError) {
          console.error('Erro ao salvar transportadoras:', transportadorasError)
          toast.error('Erro ao salvar transportadoras: ' + transportadorasError.message)
          return false
        }
        console.log('Transportadoras salvas com sucesso')
      }

      toast.success('Cotação salva com sucesso no Supabase!')
      await carregarCotacoes() // Recarregar a lista
      return true
    } catch (error) {
      console.error('Erro inesperado ao salvar cotação:', error)
      toast.error('Erro inesperado ao salvar cotação')
      return false
    }
  }

  // Atualizar cotação existente
  const atualizarCotacao = async (cotacaoAtualizada: CotacaoSalva) => {
    try {
      console.log('Atualizando cotação:', cotacaoAtualizada.id)
      
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

      // Deletar produtos e transportadoras existentes
      await supabase.from('produtos').delete().eq('cotacao_id', cotacaoAtualizada.id)
      await supabase.from('transportadoras').delete().eq('cotacao_id', cotacaoAtualizada.id)

      // Inserir produtos atualizados
      if (cotacaoAtualizada.produtos.length > 0) {
        const produtosParaInserir = cotacaoAtualizada.produtos.map(produto => ({
          nome: produto.nome,
          quantidade: produto.quantidade,
          peso: produto.peso,
          cotacao_id: cotacaoAtualizada.id
        }))

        await supabase.from('produtos').insert(produtosParaInserir)
      }

      // Inserir transportadoras atualizadas
      if (cotacaoAtualizada.transportadoras.length > 0) {
        const { data: { user } } = await supabase.auth.getUser()
        const transportadorasParaInserir = cotacaoAtualizada.transportadoras.map(transportadora => ({
          nome: transportadora.nome,
          prazo: transportadora.prazo,
          valor_unitario: transportadora.valorUnitario,
          valor_total: transportadora.valorTotal,
          status: transportadora.status,
          proposta_final: transportadora.propostaFinal,
          cotacao_id: cotacaoAtualizada.id,
          user_id: user?.id
        }))

        await supabase.from('transportadoras').insert(transportadorasParaInserir)
      }

      toast.success('Cotação atualizada com sucesso!')
      await carregarCotacoes() // Recarregar a lista
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
      console.log('Deletando cotação:', id)
      
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
      await carregarCotacoes() // Recarregar a lista
      return true
    } catch (error) {
      console.error('Erro ao deletar cotação:', error)
      toast.error('Erro inesperado ao deletar cotação')
      return false
    }
  }

  useEffect(() => {
    verificarAutenticacao().then(() => {
      carregarCotacoes()
    })
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
