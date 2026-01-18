import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { relatoriosService } from '@/services/relatoriosService'
import { transacoesService } from '@/services/transacoesService'
import { TipoTransacao, TransacaoListDto } from '@/types/api'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Loader2, TrendingUp, TrendingDown, DollarSign, Eye } from 'lucide-react'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDateTime(value?: string) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d)
}

export default function Relatorios() {
  const { data: relatorio, isLoading } = useQuery({
    queryKey: ['relatorios', 'totais-por-pessoa'],
    queryFn: relatoriosService.obterTotaisPorPessoa,
  })

  // Dialog: controlar pessoa selecionada
  const [pessoaSelecionada, setPessoaSelecionada] = useState<{
    pessoaId: number
    pessoaNome: string
  } | null>(null)

  const isDialogOpen = !!pessoaSelecionada

  // Busca transações só quando abrir o dialog (economiza request)
  const { data: transacoes, isLoading: isLoadingTransacoes } = useQuery({
    queryKey: ['transacoes'],
    queryFn: transacoesService.listar,
    enabled: isDialogOpen,
  })

  // Filtra transações da pessoa
  const transacoesDaPessoa: TransacaoListDto[] = useMemo(() => {
    if (!pessoaSelecionada || !transacoes) return []
    return transacoes.filter((t) => t.pessoaId === pessoaSelecionada.pessoaId)
  }, [pessoaSelecionada, transacoes])

  // Totais da pessoa (calculados em cima das transações)
  const totaisPessoa = useMemo(() => {
    const totalReceitas = transacoesDaPessoa
      .filter((t) => t.tipo === TipoTransacao.Receita)
      .reduce((acc, t) => acc + (t.valor ?? 0), 0)

    const totalDespesas = transacoesDaPessoa
      .filter((t) => t.tipo === TipoTransacao.Despesa)
      .reduce((acc, t) => acc + (t.valor ?? 0), 0)

    return {
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas,
    }
  }, [transacoesDaPessoa])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Visualize os totais financeiros por pessoa
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ) : relatorio ? (
        <>
          {/* Cards de Resumo Geral */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Receitas
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(relatorio.totalGeral.totalReceitas)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Despesas
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(relatorio.totalGeral.totalDespesas)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Geral</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    relatorio.totalGeral.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(relatorio.totalGeral.saldo)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Totais por Pessoa */}
          <Card>
            <CardHeader>
              <CardTitle>Totais por Pessoa</CardTitle>
              <CardDescription>
                Resumo financeiro individual de cada pessoa
              </CardDescription>
            </CardHeader>
            <CardContent>
              {relatorio.pessoas.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pessoa</TableHead>
                        <TableHead className="text-right">Total Receitas</TableHead>
                        <TableHead className="text-right">Total Despesas</TableHead>
                        <TableHead className="text-right">Saldo</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {relatorio.pessoas.map((pessoa) => (
                        <TableRow key={pessoa.pessoaId}>
                          {/* Nome + Botão */}
                          <TableCell className="font-medium">
                            <div className="flex items-center justify-between gap-3">
                              <span className="truncate">{pessoa.pessoaNome}</span>

                              <Button
                                size="sm"
                                onClick={() =>
                                  setPessoaSelecionada({
                                    pessoaId: pessoa.pessoaId,
                                    pessoaNome: pessoa.pessoaNome,
                                  })
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver transações
                              </Button>
                            </div>
                          </TableCell>

                          <TableCell className="text-right text-green-600">
                            {formatCurrency(pessoa.totalReceitas)}
                          </TableCell>

                          <TableCell className="text-right text-red-600">
                            {formatCurrency(pessoa.totalDespesas)}
                          </TableCell>

                          <TableCell
                            className={`text-right font-semibold ${
                              pessoa.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {formatCurrency(pessoa.saldo)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="py-8 text-center text-muted-foreground">
                  Nenhum dado disponível. Cadastre transações para ver os relatórios.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Dialog com transações da pessoa */}
          <Dialog open={isDialogOpen} onOpenChange={() => setPessoaSelecionada(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  Transações — {pessoaSelecionada?.pessoaNome}
                </DialogTitle>
                <DialogDescription>
                  Lista completa + totais de receitas e despesas
                </DialogDescription>
              </DialogHeader>

              {isLoadingTransacoes ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Totais */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Receitas</CardTitle>
                      </CardHeader>
                      <CardContent className="text-2xl font-bold text-green-600">
                        {formatCurrency(totaisPessoa.totalReceitas)}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Despesas</CardTitle>
                      </CardHeader>
                      <CardContent className="text-2xl font-bold text-red-600">
                        {formatCurrency(totaisPessoa.totalDespesas)}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Saldo</CardTitle>
                      </CardHeader>
                      <CardContent
                        className={`text-2xl font-bold ${
                          totaisPessoa.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(totaisPessoa.saldo)}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Lista */}
                  {transacoesDaPessoa.length === 0 ? (
                    <p className="py-8 text-center text-muted-foreground">
                      Essa pessoa ainda não tem transações.
                    </p>
                  ) : (
                   <div className="max-h-[360px] overflow-y-auto relative">
                        <Table className="border-separate border-spacing-0">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="sticky top-0 z-20 bg-background border-b border-border">
                                Descrição
                              </TableHead>
                              <TableHead className="sticky top-0 z-20 bg-background border-b border-border">
                                Categoria
                              </TableHead>
                              <TableHead className="sticky top-0 z-20 bg-background border-b border-border">
                                Finalidade
                              </TableHead>
                              <TableHead className="sticky top-0 z-20 bg-background border-b border-border">
                                Data/Hora
                              </TableHead>
                              <TableHead className="sticky top-0 z-20 bg-background border-b border-border text-right">
                                Valor
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                        <TableBody>
                          {transacoesDaPessoa.map((t) => (
                            <TableRow key={t.id}>
                              <TableCell className="font-medium">
                                {t.descricao}
                              </TableCell>

                              <TableCell>{t.categoriaDescricao}</TableCell>

                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    t.categoriaFinalidade === 'Despesa'
                                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30'
                                      : t.categoriaFinalidade === 'Receita'
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                                  }`}
                                >
                                  {t.categoriaFinalidade}
                                </span>
                              </TableCell>

                              <TableCell className="text-muted-foreground whitespace-nowrap">
                                {formatDateTime(t.data)}
                              </TableCell>

                              <TableCell
                                className={`text-right font-medium ${
                                  t.categoriaFinalidade === 'Ambas'
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : t.tipo === TipoTransacao.Despesa
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-green-600 dark:text-green-400'
                                }`}
                              >
                                {t.categoriaFinalidade === 'Ambas'
                                  ? ''
                                  : t.tipo === TipoTransacao.Despesa
                                  ? '-'
                                  : '+'}
                                {formatCurrency(t.valor)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setPessoaSelecionada(null)}>
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Não foi possível carregar os relatórios.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
