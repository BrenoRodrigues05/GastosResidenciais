import { api } from '@/api/client'
import { RelatorioTotaisPorPessoaResponseDto } from '@/types/api'

export const relatoriosService = {
  async obterTotaisPorPessoa(): Promise<RelatorioTotaisPorPessoaResponseDto> {
    const response = await api.get('/relatorios/totais-por-pessoa')
    const d: any = response.data

    return {
      pessoas: (d.Pessoas ?? d.pessoas ?? []).map((p: any) => ({
        pessoaId: p.PessoaId ?? p.pessoaId,
        pessoaNome: p.PessoaNome ?? p.pessoaNome ?? '—',
        totalReceitas: p.TotalReceitas ?? p.totalReceitas ?? 0,
        totalDespesas: p.TotalDespesas ?? p.totalDespesas ?? 0,
        saldo: p.Saldo ?? p.saldo ?? 0,
      })),
      totalGeral: {
        totalReceitas: d.TotalGeral?.TotalReceitas ?? d.totalGeral?.totalReceitas ?? 0,
        totalDespesas: d.TotalGeral?.TotalDespesas ?? d.totalGeral?.totalDespesas ?? 0,
        saldo: d.TotalGeral?.Saldo ?? d.totalGeral?.saldo ?? 0,
      },
    }
  },
}
