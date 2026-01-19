import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderWithClient, createTestQueryClient } from '@/test/render'

import Categorias from '@/pages/Categorias'
import { categoriasService } from '@/services/categoriasService'

vi.mock('@/services/categoriasService', () => ({
  categoriasService: {
    listar: vi.fn(),
    criar: vi.fn(),
    atualizar: vi.fn(),
    excluir: vi.fn(),
  },
}))

describe('Categorias Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve exibir loading e depois listar categorias', async () => {
    ;(categoriasService.listar as any).mockResolvedValue([
      { id: 1, descricao: 'Aluguel', finalidade: 'Despesa' },
      { id: 2, descricao: 'Salário', finalidade: 'Receita' },
    ])

    renderWithClient(<Categorias />)

    expect(await screen.findByText('Aluguel')).toBeInTheDocument()
    expect(screen.getByText('Salário')).toBeInTheDocument()

    expect(categoriasService.listar).toHaveBeenCalledTimes(1)
  })

  it('deve exibir mensagem quando não houver categorias', async () => {
    ;(categoriasService.listar as any).mockResolvedValue([])

    renderWithClient(<Categorias />)

    expect(
      await screen.findByText(/nenhuma categoria cadastrada/i)
    ).toBeInTheDocument()
  })

  it('deve abrir o dialog e criar uma categoria', async () => {
    const user = userEvent.setup()
    const client = createTestQueryClient()

    ;(categoriasService.listar as any).mockResolvedValue([])
    ;(categoriasService.criar as any).mockResolvedValue({ id: 10 })

    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')

    renderWithClient(<Categorias />, client)

    await screen.findByText(/nenhuma categoria cadastrada/i)

    await user.click(screen.getByRole('button', { name: /nova categoria/i }))

    // Seleciona o dialog especificamente
    const dialog = screen.getByRole('dialog')

    await user.type(
      within(dialog).getByLabelText(/descrição/i),
      'Mercado'
    )

    await user.selectOptions(
      within(dialog).getByLabelText(/finalidade/i),
      '2'
    )

    await user.click(
      within(dialog).getByRole('button', { name: /^criar$/i })
    )

    expect(categoriasService.criar).toHaveBeenCalledWith({
      descricao: 'Mercado',
      finalidade: 2,
    })

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['categorias'],
    })
  })

  it('deve abrir o dialog em modo edição e atualizar a categoria', async () => {
    const user = userEvent.setup()
    const client = createTestQueryClient()

    ;(categoriasService.listar as any).mockResolvedValue([
      { id: 1, descricao: 'Aluguel', finalidade: 'Despesa' },
    ])

    ;(categoriasService.atualizar as any).mockResolvedValue({})

    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')

    renderWithClient(<Categorias />, client)

    await screen.findByText('Aluguel')

    const row = screen.getByText('Aluguel').closest('tr')!
    const actions = within(row).getAllByRole('button')

    // botão editar
    await user.click(actions[0])

    const dialog = screen.getByRole('dialog')

    const descricaoInput = within(dialog).getByLabelText(/descrição/i)

    await user.clear(descricaoInput)
    await user.type(descricaoInput, 'Aluguel (Atualizado)')

    await user.click(
      within(dialog).getByRole('button', { name: /salvar alterações/i })
    )

    expect(categoriasService.atualizar).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        descricao: 'Aluguel (Atualizado)',
      })
    )

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['categorias'],
    })
  })

  it('deve excluir uma categoria após confirmação', async () => {
  const user = userEvent.setup()
  const client = createTestQueryClient()

  ;(categoriasService.listar as any).mockResolvedValue([
    { id: 1, descricao: 'Aluguel', finalidade: 'Despesa' },
  ])

  ;(categoriasService.excluir as any).mockResolvedValue({})

  const invalidateSpy = vi.spyOn(client, 'invalidateQueries')

  renderWithClient(<Categorias />, client)

  await screen.findByText('Aluguel')

  const row = screen.getByText('Aluguel').closest('tr')!
  const actions = within(row).getAllByRole('button')

  await user.click(actions[1])

  const dialog = screen.getByRole('dialog')
  await user.click(within(dialog).getByRole('button', { name: /^excluir$/i }))

  expect(categoriasService.excluir).toHaveBeenCalledWith(1)
  expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['categorias'] })
})
})
