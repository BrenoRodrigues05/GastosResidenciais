import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderWithClient, createTestQueryClient } from '@/test/render'

import Transacoes from '@/pages/Transacoes'
import { transacoesService } from '@/services/transacoesService'
import { pessoasService } from '@/services/pessoasService'
import { categoriasService } from '@/services/categoriasService'
import { TipoTransacao } from '@/types/api'

// Mock do toast (hook)
const toastMock = vi.fn()
vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ toast: toastMock }),
}))

vi.mock('@/services/transacoesService', () => ({
  transacoesService: {
    listar: vi.fn(),
    criar: vi.fn(),
  },
}))

vi.mock('@/services/pessoasService', () => ({
  pessoasService: {
    listar: vi.fn(),
  },
}))

vi.mock('@/services/categoriasService', () => ({
  categoriasService: {
    listar: vi.fn(),
  },
}))

describe('Transacoes Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    toastMock.mockClear()
  })

  it('deve listar transações', async () => {
    ;(transacoesService.listar as any).mockResolvedValue([
      {
        id: 1,
        descricao: 'Aluguel',
        valor: 500,
        tipo: TipoTransacao.Despesa,
        data: '2026-01-15T12:00:00Z',
        categoriaDescricao: 'Casa',
        categoriaFinalidade: 'Despesa',
        pessoaNome: 'Ana',
      },
    ])
    ;(pessoasService.listar as any).mockResolvedValue([])
    ;(categoriasService.listar as any).mockResolvedValue([])

    renderWithClient(<Transacoes />)

    expect(await screen.findByText('Aluguel')).toBeInTheDocument()
    expect(screen.getByText('Casa')).toBeInTheDocument()
    expect(screen.getByText('Ana')).toBeInTheDocument()
  })

  it('deve exibir mensagem quando não houver transações', async () => {
    ;(transacoesService.listar as any).mockResolvedValue([])
    ;(pessoasService.listar as any).mockResolvedValue([])
    ;(categoriasService.listar as any).mockResolvedValue([])

    renderWithClient(<Transacoes />)

    expect(
      await screen.findByText(/nenhuma transação cadastrada/i)
    ).toBeInTheDocument()
  })

  it('deve abrir o dialog e criar transação (sucesso) invalidando queries e chamando toast', async () => {
    const user = userEvent.setup()
    const client = createTestQueryClient()

    ;(transacoesService.listar as any).mockResolvedValue([])
    ;(pessoasService.listar as any).mockResolvedValue([
      { id: 1, nome: 'Ana', idade: 25 },
    ])
    ;(categoriasService.listar as any).mockResolvedValue([
      { id: 10, descricao: 'Casa', finalidade: 'Despesa' },
      { id: 11, descricao: 'Salário', finalidade: 'Receita' },
      { id: 12, descricao: 'Ambas', finalidade: 'Ambas' },
    ])

    ;(transacoesService.criar as any).mockResolvedValue({ id: 100 })

    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')

    renderWithClient(<Transacoes />, client)

    await user.click(screen.getByRole('button', { name: /nova transação/i }))

    const dialog = screen.getByRole('dialog')

    await user.type(within(dialog).getByLabelText(/descrição/i), 'Conta de luz')
    await user.type(within(dialog).getByLabelText(/valor/i), '99.90')

    // Tipo default é Despesa (do state inicial). Seleciona pessoa e categoria.
    await user.selectOptions(within(dialog).getByLabelText(/^pessoa$/i), '1')

    // Categoria deve permitir Despesa + Ambas
    await user.selectOptions(within(dialog).getByLabelText(/^categoria$/i), '10')

    await user.click(within(dialog).getByRole('button', { name: /^criar$/i }))

    expect(transacoesService.criar).toHaveBeenCalledWith(
      expect.objectContaining({
        descricao: 'Conta de luz',
        valor: 99.9,
        tipo: TipoTransacao.Despesa,
        categoriaId: 10,
        pessoaId: 1,
      })
    )

    // invalida transacoes e relatorios
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['transacoes'] })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['relatorios'] })

    expect(toastMock).toHaveBeenCalledWith('Transação criada com sucesso!')
  })

  it('deve bloquear Receita para menor de 18 (mostra alerta e desabilita o botão Criar)', async () => {
    const user = userEvent.setup()

    ;(transacoesService.listar as any).mockResolvedValue([])
    ;(pessoasService.listar as any).mockResolvedValue([
      { id: 1, nome: 'João', idade: 16 },
    ])
    ;(categoriasService.listar as any).mockResolvedValue([
      { id: 20, descricao: 'Bico', finalidade: 'Receita' },
      { id: 21, descricao: 'Ambas', finalidade: 'Ambas' },
    ])

    renderWithClient(<Transacoes />)

    await user.click(screen.getByRole('button', { name: /nova transação/i }))
    const dialog = screen.getByRole('dialog')

    await user.type(within(dialog).getByLabelText(/descrição/i), 'Dinheiro')
    await user.type(within(dialog).getByLabelText(/valor/i), '10')

    await user.selectOptions(within(dialog).getByLabelText(/^pessoa$/i), '1')

    // Muda tipo para Receita
    await user.selectOptions(
      within(dialog).getByLabelText(/^tipo$/i),
      String(TipoTransacao.Receita)
    )

    // Deve mostrar aviso
    expect(
      within(dialog).getByText(/menores de 18 anos não podem cadastrar receita/i)
    ).toBeInTheDocument()

    const botaoCriar = within(dialog).getByRole('button', { name: /^criar$/i })
    expect(botaoCriar).toBeDisabled()

    // Não deve chamar criar nem toast, porque submit não acontece com botão disabled
    expect(transacoesService.criar).toHaveBeenCalledTimes(0)
    expect(toastMock).toHaveBeenCalledTimes(0)
  })

  it('deve filtrar categorias de acordo com o tipo selecionado', async () => {
    const user = userEvent.setup()

    ;(transacoesService.listar as any).mockResolvedValue([])
    ;(pessoasService.listar as any).mockResolvedValue([
      { id: 1, nome: 'Ana', idade: 25 },
    ])
    ;(categoriasService.listar as any).mockResolvedValue([
      { id: 10, descricao: 'DespesaCat', finalidade: 'Despesa' },
      { id: 11, descricao: 'ReceitaCat', finalidade: 'Receita' },
      { id: 12, descricao: 'AmbasCat', finalidade: 'Ambas' },
    ])

    renderWithClient(<Transacoes />)

    await user.click(screen.getByRole('button', { name: /nova transação/i }))
    const dialog = screen.getByRole('dialog')

    // Default: Despesa => deve mostrar DespesaCat e AmbasCat, NÃO ReceitaCat
    const categoriaSelect = within(dialog).getByLabelText(/^categoria$/i)

    expect(within(categoriaSelect).queryByText('DespesaCat')).toBeInTheDocument()
    expect(within(categoriaSelect).queryByText('AmbasCat')).toBeInTheDocument()
    expect(within(categoriaSelect).queryByText('ReceitaCat')).not.toBeInTheDocument()

    // Muda para Receita => deve mostrar ReceitaCat e AmbasCat, NÃO DespesaCat
    await user.selectOptions(
      within(dialog).getByLabelText(/^tipo$/i),
      String(TipoTransacao.Receita)
    )

    expect(within(categoriaSelect).queryByText('ReceitaCat')).toBeInTheDocument()
    expect(within(categoriaSelect).queryByText('AmbasCat')).toBeInTheDocument()
    expect(within(categoriaSelect).queryByText('DespesaCat')).not.toBeInTheDocument()
  })
})
