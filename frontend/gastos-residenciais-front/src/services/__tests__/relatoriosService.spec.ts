import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '@/api/client'
import { relatoriosService } from '@/services/relatoriosService'

vi.mock('@/api/client', () => ({
  api: {
    get: vi.fn(),
  },
}))

describe('relatoriosService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('obterTotaisPorPessoa deve chamar GET correto e mapear PascalCase', async () => {
    ;(api.get as any).mockResolvedValue({
      data: {
        Pessoas: [
          {
            PessoaId: 1,
            PessoaNome: 'Ana',
            TotalReceitas: 100,
            TotalDespesas: 40,
            Saldo: 60,
          },
        ],
        TotalGeral: { TotalReceitas: 100, TotalDespesas: 40, Saldo: 60 },
      },
    })

    const result = await relatoriosService.obterTotaisPorPessoa()

    expect(api.get).toHaveBeenCalledWith('/relatorios/totais-por-pessoa')
    expect(result).toEqual({
      pessoas: [
        {
          pessoaId: 1,
          pessoaNome: 'Ana',
          totalReceitas: 100,
          totalDespesas: 40,
          saldo: 60,
        },
      ],
      totalGeral: { totalReceitas: 100, totalDespesas: 40, saldo: 60 },
    })
  })

  it('deve mapear camelCase e aplicar defaults', async () => {
    ;(api.get as any).mockResolvedValue({
      data: {
        pessoas: [{ pessoaId: 2, pessoaNome: null, totalReceitas: null }],
        totalGeral: {},
      },
    })

    const result = await relatoriosService.obterTotaisPorPessoa()

    expect(result).toEqual({
      pessoas: [
        {
          pessoaId: 2,
          pessoaNome: '—',
          totalReceitas: 0,
          totalDespesas: 0,
          saldo: 0,
        },
      ],
      totalGeral: { totalReceitas: 0, totalDespesas: 0, saldo: 0 },
    })
  })
})
