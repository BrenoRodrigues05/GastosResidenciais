import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '@/api/client'
import { transacoesService } from '@/services/transacoesService'
import { TipoTransacao } from '@/types/api'

vi.mock('@/api/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('transacoesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('listar deve chamar GET /transacoes e mapear camelCase', async () => {
    ;(api.get as any).mockResolvedValue({
      data: [
        {
          id: 1,
          descricao: 'Aluguel',
          valor: 500,
          tipo: TipoTransacao.Despesa,
          categoriaId: 10,
          categoriaDescricao: 'Casa',
          categoriaFinalidade: 'Despesa',
          pessoaId: 2,
          pessoaNome: 'Ana',
          data: '2026-01-15T12:00:00Z',
        },
      ],
    })

    const result = await transacoesService.listar()

    expect(api.get).toHaveBeenCalledWith('/transacoes')
    expect(result[0]).toMatchObject({
      id: 1,
      descricao: 'Aluguel',
      valor: 500,
      tipo: TipoTransacao.Despesa,
      categoriaId: 10,
      categoriaDescricao: 'Casa',
      categoriaFinalidade: 'Despesa',
      pessoaId: 2,
      pessoaNome: 'Ana',
      data: '2026-01-15T12:00:00Z',
    })
  })

  it('listar deve mapear PascalCase e normalizar tipo/finalidade numérica', async () => {
    ;(api.get as any).mockResolvedValue({
      data: [
        {
          Id: 2,
          Descricao: 'Salário',
          Valor: 1000,
          Tipo: 2, // Receita
          CategoriaId: 11,
          CategoriaDescricao: 'Trabalho',
          CategoriaFinalidade: 2, // Receita
          PessoaId: 1,
          PessoaNome: 'Breno',
          Data: '2026-01-10T10:00:00Z',
        },
      ],
    })

    const result = await transacoesService.listar()

    expect(result[0]).toMatchObject({
      id: 2,
      descricao: 'Salário',
      valor: 1000,
      tipo: TipoTransacao.Receita,
      categoriaFinalidade: 'Receita',
      pessoaNome: 'Breno',
    })
  })

  it('listar deve normalizar tipo por texto (Despesa/Receita)', async () => {
    ;(api.get as any).mockResolvedValue({
      data: [
        {
          id: 3,
          descricao: 'Mercado',
          valor: 200,
          tipo: 'Despesa',
          categoriaFinalidade: 'Ambas',
          categoriaId: 1,
          categoriaDescricao: 'Alimentação',
          pessoaId: 1,
          pessoaNome: 'Ana',
        },
      ],
    })

    const result = await transacoesService.listar()

    expect(result[0].tipo).toBe(TipoTransacao.Despesa)
    expect(result[0].categoriaFinalidade).toBe('Ambas')
  })

  it('criar deve chamar POST /transacoes com payload', async () => {
    const payload = {
      descricao: 'Conta',
      valor: 10,
      tipo: TipoTransacao.Despesa,
      categoriaId: 1,
      pessoaId: 2,
      data: '2026-01-01T00:00:00Z',
    } as any

    ;(api.post as any).mockResolvedValue({ data: { id: 100 } })

    const result = await transacoesService.criar(payload)

    expect(api.post).toHaveBeenCalledWith('/transacoes', payload)
    expect(result).toEqual({ id: 100 })
  })
})
