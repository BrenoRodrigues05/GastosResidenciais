import { api } from '@/api/client'
import {
  TransacaoCreateDto,
  TransacaoListDto,
  TransacaoCreateResponse,
  TipoTransacao,
} from '@/types/api'

const toTipoTransacao = (v: any): TipoTransacao => {
  if (v === TipoTransacao.Despesa || v === 1) return TipoTransacao.Despesa
  if (v === TipoTransacao.Receita || v === 2) return TipoTransacao.Receita
  if (v === 'Despesa') return TipoTransacao.Despesa
  if (v === 'Receita') return TipoTransacao.Receita
  return v as TipoTransacao
}

const toFinalidadeText = (v: any): 'Despesa' | 'Receita' | 'Ambas' => {
  if (v === 'Despesa' || v === 1) return 'Despesa'
  if (v === 'Receita' || v === 2) return 'Receita'
  if (v === 'Ambas' || v === 3) return 'Ambas'
  return v as any
}

export const transacoesService = {
  async listar(): Promise<TransacaoListDto[]> {
    const res = await api.get('/transacoes')
    const d: any[] = res.data ?? []

    return d.map((t: any) => ({
      id: t.id ?? t.Id,
      descricao: t.descricao ?? t.Descricao,
      valor: t.valor ?? t.Valor,

      // ✅ aqui corrige de vez
      tipo: toTipoTransacao(t.tipo ?? t.Tipo),

      categoriaId: t.categoriaId ?? t.CategoriaId,
      categoriaDescricao: t.categoriaDescricao ?? t.CategoriaDescricao,
      categoriaFinalidade: toFinalidadeText(t.categoriaFinalidade ?? t.CategoriaFinalidade),

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
