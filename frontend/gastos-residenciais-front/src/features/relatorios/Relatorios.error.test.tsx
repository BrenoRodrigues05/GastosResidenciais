import { screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderWithClient } from '@/test/render'
import Relatorios from '@/pages/Relatorios'
import { relatoriosService } from '@/services/relatoriosService'

vi.mock('@/services/relatoriosService', () => ({
  relatoriosService: { obterTotaisPorPessoa: vi.fn() },
}))

describe('Relatorios - Erros', () => {
  beforeEach(() => vi.clearAllMocks())

  it('deve exibir fallback quando não conseguir carregar relatórios', async () => {
    ;(relatoriosService.obterTotaisPorPessoa as any).mockRejectedValue(new Error('Falha'))

    renderWithClient(<Relatorios />)

    expect(
      await screen.findByText(/não foi possível carregar os relatórios/i)
    ).toBeInTheDocument()
  })
})
