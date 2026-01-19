import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderWithClient, createTestQueryClient } from '@/test/render'

import Pessoas from '@/pages/Pessoas'
import { pessoasService } from '@/services/pessoasService'

vi.mock('@/services/pessoasService', () => ({
  pessoasService: {
    listar: vi.fn(),
    criar: vi.fn(),
    atualizar: vi.fn(),
    excluir: vi.fn(),
  },
}))

describe('Pessoas Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve listar pessoas', async () => {
    ;(pessoasService.listar as any).mockResolvedValue([
      { id: 1, nome: 'Ana', idade: 17 },
      { id: 2, nome: 'Bruno', idade: 25 },
    ])

    renderWithClient(<Pessoas />)

    expect(await screen.findByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Bruno')).toBeInTheDocument()
    expect(screen.getByText(/17 anos/i)).toBeInTheDocument()
    expect(screen.getByText(/25 anos/i)).toBeInTheDocument()

    expect(pessoasService.listar).toHaveBeenCalledTimes(1)
  })

  it('deve exibir mensagem quando não houver pessoas', async () => {
    ;(pessoasService.listar as any).mockResolvedValue([])

    renderWithClient(<Pessoas />)

    expect(
      await screen.findByText(/nenhuma pessoa cadastrada/i)
    ).toBeInTheDocument()
  })

  it('deve abrir o dialog e criar uma pessoa', async () => {
    const user = userEvent.setup()
    const client = createTestQueryClient()

    ;(pessoasService.listar as any).mockResolvedValue([])
    ;(pessoasService.criar as any).mockResolvedValue({ id: 10 })

    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')

    renderWithClient(<Pessoas />, client)

    await screen.findByText(/nenhuma pessoa cadastrada/i)

    await user.click(screen.getByRole('button', { name: /nova pessoa/i }))

    const dialog = screen.getByRole('dialog')

    await user.type(within(dialog).getByLabelText(/^nome$/i), 'Carlos')
    await user.type(within(dialog).getByLabelText(/^idade$/i), '30')

    await user.click(within(dialog).getByRole('button', { name: /^criar$/i }))

    expect(pessoasService.criar).toHaveBeenCalledWith({
      nome: 'Carlos',
      idade: 30,
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['pessoas'] })
  })

  it('deve abrir o dialog em modo edição e atualizar a pessoa', async () => {
    const user = userEvent.setup()
    const client = createTestQueryClient()

    ;(pessoasService.listar as any).mockResolvedValue([
      { id: 1, nome: 'Ana', idade: 17 },
    ])
    ;(pessoasService.atualizar as any).mockResolvedValue({})

    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')

    renderWithClient(<Pessoas />, client)

    await screen.findByText('Ana')

    const row = screen.getByText('Ana').closest('tr')!
    const actions = within(row).getAllByRole('button')

    // 0 = editar, 1 = excluir
    await user.click(actions[0])

    const dialog = screen.getByRole('dialog')

    const nomeInput = within(dialog).getByLabelText(/^nome$/i)
    const idadeInput = within(dialog).getByLabelText(/^idade$/i)

    expect(nomeInput).toHaveValue('Ana')
    expect(idadeInput).toHaveValue(17)

    await user.clear(nomeInput)
    await user.type(nomeInput, 'Ana Maria')

    await user.clear(idadeInput)
    await user.type(idadeInput, '18')

    await user.click(
      within(dialog).getByRole('button', { name: /salvar alterações/i })
    )

    expect(pessoasService.atualizar).toHaveBeenCalledWith(1, {
      nome: 'Ana Maria',
      idade: 18,
    })

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['pessoas'] })
  })

  it('deve excluir uma pessoa após confirmação', async () => {
    const user = userEvent.setup()
    const client = createTestQueryClient()

    ;(pessoasService.listar as any).mockResolvedValue([
      { id: 1, nome: 'Ana', idade: 17 },
    ])
    ;(pessoasService.excluir as any).mockResolvedValue({})

    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderWithClient(<Pessoas />, client)

    await screen.findByText('Ana')

    const row = screen.getByText('Ana').closest('tr')!
    const actions = within(row).getAllByRole('button')

    // excluir
    await user.click(actions[1])

    expect(confirmSpy).toHaveBeenCalled()
    expect(pessoasService.excluir).toHaveBeenCalledWith(1)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['pessoas'] })

    confirmSpy.mockRestore()
  })
})
