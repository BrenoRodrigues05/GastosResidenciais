import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderWithClient } from '@/test/render'
import Transacoes from '@/pages/Transacoes'
import { transacoesService } from '@/services/transacoesService'
import { pessoasService } from '@/services/pessoasService'
import { categoriasService } from '@/services/categoriasService'
import { TipoTransacao } from '@/types/api'

const toastMock = vi.fn()
vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ toast: toastMock }),
}))

vi.mock('@/services/transacoesService', () => ({
  transacoesService: { listar: vi.fn(), criar: vi.fn() },
}))
vi.mock('@/services/pessoasService', () => ({
  pessoasService: { listar: vi.fn() },
}))
vi.mock('@/services/categoriasService', () => ({
  categoriasService: { listar: vi.fn() },
}))

describe('Transacoes - Erros', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    toastMock.mockClear()
  })

  it('deve mostrar toast de erro com mensagem do backend ao falhar criar', async () => {
    const user = userEvent.setup()

    ;(transacoesService.listar as any).mockResolvedValue([])
    ;(pessoasService.listar as any).mockResolvedValue([{ id: 1, nome: 'Ana', idade: 25 }])
    ;(categoriasService.listar as any).mockResolvedValue([{ id: 10, descricao: 'Casa', finalidade: 'Despesa' }])

    ;(transacoesService.criar as any).mockRejectedValue({
      response: { data: { error: 'Categoria inválida' } },
    })

    renderWithClient(<Transacoes />)

    await user.click(screen.getByRole('button', { name: /nova transação/i }))
    const dialog = screen.getByRole('dialog')

    await user.type(within(dialog).getByLabelText(/descrição/i), 'Teste')
    await user.type(within(dialog).getByLabelText(/valor/i), '10')
    await user.selectOptions(within(dialog).getByLabelText(/^pessoa$/i), '1')
    await user.selectOptions(within(dialog).getByLabelText(/^categoria$/i), '10')

    // tipo default: despesa
    expect(within(dialog).getByLabelText(/^tipo$/i)).toHaveValue(String(TipoTransacao.Despesa))

    await user.click(within(dialog).getByRole('button', { name: /^criar$/i }))

    expect(toastMock).toHaveBeenCalledWith('Categoria inválida', 'error')
  })

  it('deve usar fallback genérico quando erro não tiver payload', async () => {
    const user = userEvent.setup()

    ;(transacoesService.listar as any).mockResolvedValue([])
    ;(pessoasService.listar as any).mockResolvedValue([{ id: 1, nome: 'Ana', idade: 25 }])
    ;(categoriasService.listar as any).mockResolvedValue([{ id: 10, descricao: 'Casa', finalidade: 'Despesa' }])

    ;(transacoesService.criar as any).mockRejectedValue(new Error('boom'))

    renderWithClient(<Transacoes />)

    await user.click(screen.getByRole('button', { name: /nova transação/i }))
    const dialog = screen.getByRole('dialog')

    await user.type(within(dialog).getByLabelText(/descrição/i), 'Teste')
    await user.type(within(dialog).getByLabelText(/valor/i), '10')
    await user.selectOptions(within(dialog).getByLabelText(/^pessoa$/i), '1')
    await user.selectOptions(within(dialog).getByLabelText(/^categoria$/i), '10')

    await user.click(within(dialog).getByRole('button', { name: /^criar$/i }))

    expect(toastMock).toHaveBeenCalledWith('Erro ao criar transação', 'error')
  })
})
