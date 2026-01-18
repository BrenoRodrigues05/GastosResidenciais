import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transacoesService } from '@/services/transacoesService'
import { pessoasService } from '@/services/pessoasService'
import { categoriasService } from '@/services/categoriasService'
import {
  TransacaoCreateDto,
  TipoTransacao,
} from '@/types/api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Loader2, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

// Função para horário aparecer no card
function formatDateTime(value?: string) {
  if (!value) return '—'

  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'

 return new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
}).format(new Date(value))
}

export default function Transacoes() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: TipoTransacao.Despesa.toString(),
    categoriaId: '',
    pessoaId: '',
    data: '',
  })

  const { data: transacoes, isLoading: isLoadingTransacoes } = useQuery({
    queryKey: ['transacoes'],
    queryFn: transacoesService.listar,
  })

  const { data: pessoas } = useQuery({
    queryKey: ['pessoas'],
    queryFn: pessoasService.listar,
  })

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasService.listar,
  })

  // Filtrar categorias compatíveis com o tipo selecionado
  const categoriasDisponiveis = categorias?.filter((cat) => {
  const tipo = parseInt(formData.tipo) as TipoTransacao

  if (tipo === TipoTransacao.Despesa) {
    return cat.finalidade === 'Despesa' || cat.finalidade === 'Ambas'
  }

  return cat.finalidade === 'Receita' || cat.finalidade === 'Ambas'
})

  // Verificar se a pessoa selecionada pode cadastrar receita
  const pessoaSelecionada = pessoas?.find(
    (p) => p.id.toString() === formData.pessoaId
  )
  const podeCadastrarReceita =
    !pessoaSelecionada || pessoaSelecionada.idade >= 18

  const criarMutation = useMutation({
    mutationFn: (dados: TransacaoCreateDto) => transacoesService.criar(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transacoes'] })
      queryClient.invalidateQueries({ queryKey: ['relatorios'] })
      setIsDialogOpen(false)
      resetForm()
      toast('Transação criada com sucesso!')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error || 'Erro ao criar transação'
      toast(message, 'error')
    },
  })

  const resetForm = () => {
    setFormData({
      descricao: '',
      valor: '',
      tipo: TipoTransacao.Despesa.toString(),
      categoriaId: '',
      pessoaId: '',
      data: '',
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const tipo = parseInt(formData.tipo) as TipoTransacao

    // Validação: menores de 18 não podem cadastrar receita
    if (tipo === TipoTransacao.Receita && !podeCadastrarReceita) {
      toast('Menores de 18 anos não podem cadastrar Receita', 'error')
      return
    }

    const dados: TransacaoCreateDto = {
      descricao: formData.descricao,
      valor: parseFloat(formData.valor),
      tipo,
      categoriaId: parseInt(formData.categoriaId),
      pessoaId: parseInt(formData.pessoaId),
      data: formData.data ? new Date(formData.data).toISOString() : undefined,
    }

    criarMutation.mutate(dados)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">
            Gerencie as transações financeiras
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Transações</CardTitle>
          <CardDescription>
            Todas as transações cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTransacoes ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : transacoes && transacoes.length > 0 ? (
            <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Finalidade</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Data/Hora</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Pessoa</TableHead>
                              </TableRow>
                            </TableHeader>

                            <TableBody>
                              {transacoes.map((transacao) => (
                                <TableRow key={transacao.id}>
                                  {/* 1) Descrição */}
                                  <TableCell className="font-semibold text-base md:text-lg">
                                    {transacao.descricao}
                                  </TableCell>

                                  {/* 2) Finalidade */}
                                  <TableCell>
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                      transacao.categoriaFinalidade === 'Despesa'
                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30'
                                        : transacao.categoriaFinalidade === 'Receita'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                                    }`}
                                  >
                                    {transacao.categoriaFinalidade}
                                  </span>
                                </TableCell>

                                  {/* 3) Valor */}
                                  <TableCell
                                      className={
                                        transacao.categoriaFinalidade === 'Ambas'
                                          ? 'text-blue-600 dark:text-blue-400 font-medium'
                                          : transacao.tipo === TipoTransacao.Despesa
                                          ? 'text-red-600 dark:text-red-400 font-medium'
                                          : 'text-green-600 dark:text-green-400 font-medium'
                                      }
                                    >
                                      {transacao.categoriaFinalidade === 'Ambas'
                                        ? ''
                                        : transacao.tipo === TipoTransacao.Despesa
                                        ? '-'
                                        : '+'}
                                      {formatCurrency(transacao.valor)}
                                    </TableCell>
                                  {/* 3.5) Data/Hora */}
                                <TableCell className="text-muted-foreground whitespace-nowrap">
                                  {formatDateTime(transacao.data)}
                                </TableCell>

                                  {/* 4) Categoria */}
                                  <TableCell>{transacao.categoriaDescricao}</TableCell>

                                  {/* 5) Pessoa */}
                                    <TableCell className="font-semibold text-base md:text-lg">
                                    {transacao.pessoaNome || '—'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>

                </div>              
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              Nenhuma transação cadastrada. Clique em "Nova Transação" para começar.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma nova transação financeira
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="valor">Valor</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.valor}
                    onChange={(e) =>
                      setFormData({ ...formData, valor: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    id="tipo"
                    value={formData.tipo}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        tipo: e.target.value,
                        categoriaId: '', // Reset categoria ao mudar tipo
                      })
                    }}
                    required
                  >
                    <option value={TipoTransacao.Despesa}>Despesa</option>
                    <option value={TipoTransacao.Receita}>Receita</option>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="pessoaId">Pessoa</Label>
                <Select
                  id="pessoaId"
                  value={formData.pessoaId}
                  onChange={(e) =>
                    setFormData({ ...formData, pessoaId: e.target.value })
                  }
                  required
                >
                  <option value="">Selecione uma pessoa</option>
                  {pessoas?.map((pessoa) => (
                    <option key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome} ({pessoa.idade} anos)
                    </option>
                  ))}
                </Select>
                {parseInt(formData.tipo) === TipoTransacao.Receita &&
                  !podeCadastrarReceita && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      Menores de 18 anos não podem cadastrar Receita
                    </div>
                  )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="categoriaId">Categoria</Label>
                <Select
                  id="categoriaId"
                  value={formData.categoriaId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoriaId: e.target.value })
                  }
                  required
                  disabled={!formData.tipo}
                >
                  <option value="">
                    {formData.tipo
                      ? 'Selecione uma categoria'
                      : 'Selecione primeiro o tipo'}
                  </option>
                  {categoriasDisponiveis?.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.descricao}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="data">Data (Opcional)</Label>
                <Input
                  id="data"
                  type="datetime-local"
                  value={formData.data}
                  onChange={(e) =>
                    setFormData({ ...formData, data: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  resetForm()
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  criarMutation.isPending ||
                  (parseInt(formData.tipo) === TipoTransacao.Receita &&
                    !podeCadastrarReceita)
                }
              >
                {criarMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
