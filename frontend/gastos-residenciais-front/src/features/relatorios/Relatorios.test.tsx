import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderWithClient } from '@/test/render'

import Relatorios from '@/pages/Relatorios'
import { relatoriosService } from '@/services/relatoriosService'
import { transacoesService } from '@/services/transacoesService'
import { TipoTransacao } from '@/types/api'

vi.mock('@/services/relatoriosService', () => ({
  relatoriosService: {
    obterTotaisPorPessoa: vi.fn(),
  },
}))

vi.mock('@/services/transacoesService', () => ({
  transacoesService: {
    listar: vi.fn(),
  },
}))

describe('Relatorios Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve exibir os cards gerais e a tabela de totais por pessoa', async () => {
    ;(relatoriosService.obterTotaisPorPessoa as any).mockResolvedValue({
      totalGeral: { totalReceitas: 1000, totalDespesas: 400, saldo: 600 },
      pessoas: [
        {
          pessoaId: 1,
          pessoaNome: 'Ana',
          totalReceitas: 800,
          totalDespesas: 200,
          saldo: 600,
        },
      ],
    })

    // Não deve buscar transações enquanto o dialog não abrir
    ;(transacoesService.listar as any).mockResolvedValue([])

    renderWithClient(<Relatorios />)

    expect(await screen.findByText(/totais por pessoa/i)).toBeInTheDocument()

    // Cards gerais (valida pelo texto, sem depender do formato da moeda)
    expect(screen.getByText(/total de receitas/i)).toBeInTheDocument()
    expect(screen.getByText(/total de despesas/i)).toBeInTheDocument()
    expect(screen.getByText(/saldo geral/i)).toBeInTheDocument()

    // Nome na tabela
    expect(screen.getByText('Ana')).toBeInTheDocument()

    // Confere que transações ainda não foram buscadas (enabled: false)
    expect(transacoesService.listar).toHaveBeenCalledTimes(0)
  })

  it('ao clicar em "Ver transações" deve abrir o dialog, buscar transações, filtrar pela pessoa e calcular totais', async () => {
    const user = userEvent.setup()

    ;(relatoriosService.obterTotaisPorPessoa as any).mockResolvedValue({
      totalGeral: { totalReceitas: 1000, totalDespesas: 400, saldo: 600 },
      pessoas: [
        {
          pessoaId: 1,
          pessoaNome: 'Ana',
          totalReceitas: 800,
          totalDespesas: 200,
          saldo: 600,
        },
        {
          pessoaId: 2,
          pessoaNome: 'Bruno',
          totalReceitas: 200,
          totalDespesas: 200,
          saldo: 0,
        },
      ],
    })

    // Lista geral de transações (vai filtrar pela pessoaId selecionada)
    ;(transacoesService.listar as any).mockResolvedValue([
      // Ana: 1 receita + 1 despesa
      {
        id: 1,
        descricao: 'Salário',
        valor: 1000,
        tipo: TipoTransacao.Receita,
        pessoaId: 1,
        categoriaDescricao: 'Trabalho',
        categoriaFinalidade: 'Receita',
        data: '2026-01-15T12:00:00Z',
      },
      {
        id: 2,
        descricao: 'Aluguel',
        valor: 400,
        tipo: TipoTransacao.Despesa,
        pessoaId: 1,
        categoriaDescricao: 'Casa',
        categoriaFinalidade: 'Despesa',
        data: '2026-01-16T12:00:00Z',
      },
      // Bruno: não deve aparecer no dialog da Ana
      {
        id: 3,
        descricao: 'Mercado',
        valor: 200,
        tipo: TipoTransacao.Despesa,
        pessoaId: 2,
        categoriaDescricao: 'Compras',
        categoriaFinalidade: 'Despesa',
        data: '2026-01-17T12:00:00Z',
      },
    ])

    renderWithClient(<Relatorios />)

    // Espera a tabela
    expect(await screen.findByText('Ana')).toBeInTheDocument()

    // Clica no botão "Ver transações" da Ana
    const rowAna = screen.getByText('Ana').closest('tr')!
    await user.click(within(rowAna).getByRole('button', { name: /ver transações/i }))

    // Abriu dialog
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(/transações/i)).toBeInTheDocument()
    expect(within(dialog).getByText(/ana/i)).toBeInTheDocument()

    // Agora sim buscou transações (enabled: true)
    expect(transacoesService.listar).toHaveBeenCalledTimes(1)

    // Deve mostrar apenas transações da Ana
    expect(await within(dialog).findByText('Salário')).toBeInTheDocument()
    expect(within(dialog).getByText('Aluguel')).toBeInTheDocument()
    expect(within(dialog).queryByText('Mercado')).not.toBeInTheDocument()

    // Totais calculados (não valida valor formatado exato, só presença dos blocos)
    expect(within(dialog).getByText(/total receitas/i)).toBeInTheDocument()
    expect(within(dialog).getByText(/total despesas/i)).toBeInTheDocument()
    expect(within(dialog).getByText(/^saldo$/i)).toBeInTheDocument()

    // Fecha
    await user.click(within(dialog).getByRole('button', { name: /fechar/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('se a pessoa não tiver transações, deve mostrar mensagem no dialog', async () => {
    const user = userEvent.setup()

    ;(relatoriosService.obterTotaisPorPessoa as any).mockResolvedValue({
      totalGeral: { totalReceitas: 0, totalDespesas: 0, saldo: 0 },
      pessoas: [
        { pessoaId: 1, pessoaNome: 'Ana', totalReceitas: 0, totalDespesas: 0, saldo: 0 },
      ],
    })

    ;(transacoesService.listar as any).mockResolvedValue([
      // Só transações de outra pessoa
      {
        id: 99,
        descricao: 'Qualquer',
        valor: 10,
        tipo: TipoTransacao.Despesa,
        pessoaId: 2,
        categoriaDescricao: 'X',
        categoriaFinalidade: 'Despesa',
        data: '2026-01-15T12:00:00Z',
      },
    ])

    renderWithClient(<Relatorios />)

    const rowAna = (await screen.findByText('Ana')).closest('tr')!
    await user.click(within(rowAna).getByRole('button', { name: /ver transações/i }))

    const dialog = screen.getByRole('dialog')

    expect(
      await within(dialog).findByText(/essa pessoa ainda não tem transações/i)
    ).toBeInTheDocument()
  })
})
