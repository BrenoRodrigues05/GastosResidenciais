import { api } from '@/api/client'
import { TransacaoCreateDto, TransacaoListDto, TransacaoCreateResponse } from '@/types/api'

export const transacoesService = {
  async listar(): Promise<TransacaoListDto[]> {
    const res = await api.get('/transacoes')
    const d: any[] = res.data ?? []
    return d.map((t: any) => ({
      id: t.id ?? t.Id,
      descricao: t.descricao ?? t.Descricao,
      valor: t.valor ?? t.Valor,
      tipo: t.tipo ?? t.Tipo,

      categoriaId: t.categoriaId ?? t.CategoriaId,
      categoriaDescricao: t.categoriaDescricao ?? t.CategoriaDescricao,
      categoriaFinalidade: t.categoriaFinalidade ?? t.CategoriaFinalidade, 

      pessoaId: t.pessoaId ?? t.PessoaId,
      pessoaNome: t.pessoaNome ?? t.PessoaNome,

      data: t.data ?? t.Data, 
    })) as TransacaoListDto[]
  },

  async criar(dados: TransacaoCreateDto): Promise<TransacaoCreateResponse> {
    const response = await api.post<TransacaoCreateResponse>('/transacoes', dados)
    return response.data
  },
}
