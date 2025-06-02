
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CotacaoSalva } from '@/types'
import { toast } from 'sonner'

export const useCotacoes = () => {
  const [cotacoes, setCotacoes] = useState<CotacaoSalva[]>([])
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  // Função para fazer login automático
  const fazerLoginAutomatico = async () => {
    try {
      console.log('Tentando login automático...')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'lucasfriske@agrofarm.net.br',
        password: 'Nexus@4202'
      })
      
      if (error) {
        console.error('Erro no login automático:', error)
        toast.error('Erro de autenticação: ' + error.message)
        return false
      }
      
      console.log('Login automático realizado com sucesso:', data.user?.email)
      setAuthenticated(true)
      return true
    } catch (error) {
      console.error('Erro inesperado no login:', error)
      toast.error('Erro inesperado na autenticação')
      return false
    }
  }

  // Verificar se já está autenticado
  const verificarAutenticacao = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Erro ao verificar usuário:', error)
        return await fazerLoginAutomatico()
      }
      
      if (user) {
        console.log('Usuário já autenticado:', user.email)
        setAuthenticated(true)
        return true
      } else {
        return await fazerLoginAutomatico()
      }
    } catch (error) {
      console.error('Erro na verificação:', error)
      return await fazerLoginAutomatico()
    }
  }

  // Carregar cotações
  const carregarCotacoes = async () => {
    try {
      setLoading(true)
      
      // Verificar autenticação primeiro
      const isAuth = await verificarAutenticacao()
      if (!isAuth) {
        console.log('Falha na autenticação')
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
        produtos: (cotacao.produtos || []).map((p: any) => ({
          id: p.id,
          nome: p.nome || '',
          quantidade: p.quantidade || 1,
          peso: p.peso || ''
        })),
        transportadoras: (cotacao.transportadoras || []).map((t: any) => ({
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
      
      // Verificar autenticação
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Usuário não autenticado:', authError)
        const loginSuccess = await fazerLoginAutomatico()
        if (!loginSuccess) {
          toast.error('Falha na autenticação')
          return false
        }
        // Tentar obter o usuário novamente após login
        const { data: { user: newUser }, error: newAuthError } = await supabase.auth.getUser()
        if (newAuthError || !newUser) {
          toast.error('Ainda não foi possível autenticar')
          return false
        }
      }

      // Verificar novamente para ter certeza que temos o usuário
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        toast.error('Usuário não encontrado após autenticação')
        return false
      }

      console.log('Usuário autenticado para salvamento:', currentUser.email)

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
          user_id: currentUser.id
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
              user_id: currentUser.id
            }))
          )

        if (transportadorasError) {
          console.error('Erro ao salvar transportadoras:', transportadorasError)
          toast.error('Erro ao salvar transportadoras: ' + transportadorasError.message)
          return false
        }
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

      // Verificar autenticação
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Usuário não autenticado:', authError)
        toast.error('Usuário não autenticado')
        return false
      }

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

      // Atualizar produtos (deletar todos e inserir novamente)
      const { error: deleteProdutosError } = await supabase
        .from('produtos')
        .delete()
        .eq('cotacao_id', cotacao.id)

      if (deleteProdutosError) {
        console.error('Erro ao deletar produtos:', deleteProdutosError)
      }

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
      }

      // Atualizar transportadoras (deletar todas e inserir novamente)
      const { error: deleteTransportadorasError } = await supabase
        .from('transportadoras')
        .delete()
        .eq('cotacao_id', cotacao.id)

      if (deleteTransportadorasError) {
        console.error('Erro ao deletar transportadoras:', deleteTransportadorasError)
      }

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
