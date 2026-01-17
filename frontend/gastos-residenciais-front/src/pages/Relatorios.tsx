import { useQuery } from '@tanstack/react-query'
import { relatoriosService } from '@/services/relatoriosService'
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
import { Loader2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function Relatorios() {
  const { data: relatorio, isLoading } = useQuery({
    queryKey: ['relatorios', 'totais-por-pessoa'],
    queryFn: relatoriosService.obterTotaisPorPessoa,
  })

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
                    relatorio.totalGeral.saldo >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
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
                          <TableCell className="font-medium">
                            {pessoa.pessoaNome}
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
