import { useState } from 'react'
import type { AxiosError } from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transacoesService } from '@/services/transacoesService'
import { pessoasService } from '@/services/pessoasService'
import { categoriasService } from '@/services/categoriasService'
import { TransacaoCreateDto, TipoTransacao } from '@/types/api'
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
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(value))
}

const getApiMessage = (err: unknown) => {
  const axiosErr = err as AxiosError<any>
  return (
    axiosErr?.response?.data?.message ||
    axiosErr?.response?.data?.error ||
    'Erro ao criar transação.'
  )
}

type SuccessInfo = {
  descricao: string
  valor: number
  tipo: 'Despesa' | 'Receita'
  pessoa: string
  categoria: string
  data: string
}

export default function Transacoes() {
  const queryClient = useQueryClient()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [successInfo, setSuccessInfo] = useState<SuccessInfo | null>(null)

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

  const categoriasDisponiveis = categorias?.filter((cat) => {
    const tipo = parseInt(formData.tipo) as TipoTransacao

    if (tipo === TipoTransacao.Despesa) {
      return cat.finalidade === 'Despesa' || cat.finalidade === 'Ambas'
    }

    return cat.finalidade === 'Receita' || cat.finalidade === 'Ambas'
  })

  const pessoaSelecionada = pessoas?.find((p) => p.id.toString() === formData.pessoaId)
  const podeCadastrarReceita = !pessoaSelecionada || pessoaSelecionada.idade >= 18

  const resetForm = () => {
    setFormData({
      descricao: '',
      valor: '',
      tipo: TipoTransacao.Despesa.toString(),
      categoriaId: '',
      pessoaId: '',
      data: '',
    })
    setModalError(null)
  }

  const criarMutation = useMutation({
    mutationFn: (dados: TransacaoCreateDto) => transacoesService.criar(dados),
    onSuccess: () => {
      const tipoNum = parseInt(formData.tipo) as TipoTransacao
      const pessoaNome =
        pessoas?.find((p) => p.id.toString() === formData.pessoaId)?.nome ?? '—'
      const categoriaNome =
        categorias?.find((c) => c.id.toString() === formData.categoriaId)?.descricao ?? '—'

      setSuccessInfo({
        descricao: formData.descricao,
        valor: Number(formData.valor || 0),
        tipo: tipoNum === TipoTransacao.Despesa ? 'Despesa' : 'Receita',
        pessoa: pessoaNome,
        categoria: categoriaNome,
        data: formData.data ? formData.data : 'Agora',
      })

      queryClient.invalidateQueries({ queryKey: ['transacoes'] })
      queryClient.invalidateQueries({ queryKey: ['relatorios'] })

      setIsDialogOpen(false)
      resetForm()
      setIsSuccessDialogOpen(true)
    },
    onError: (error: unknown) => {
      const message = getApiMessage(error)
      setModalError(message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const tipo = parseInt(formData.tipo) as TipoTransacao

    if (tipo === TipoTransacao.Receita && !podeCadastrarReceita) {
      const msg = 'Menores de 18 anos não podem cadastrar Receita'
      setModalError(msg)
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
          <p className="text-muted-foreground">Gerencie as transações financeiras</p>
        </div>

        <Button
          onClick={() => {
            setModalError(null)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Transações</CardTitle>
          <CardDescription>Todas as transações cadastradas no sistema</CardDescription>
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
                      <TableCell className="font-semibold text-base md:text-lg">
                        {transacao.descricao}
                      </TableCell>

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

                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {formatDateTime(transacao.data)}
                      </TableCell>

                      <TableCell>{transacao.categoriaDescricao}</TableCell>

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

      {/* Modal de criar transação */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}
      >
        <DialogContent className="max-w-2xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma nova transação financeira
              </DialogDescription>
            </DialogHeader>

            {modalError && (
              <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {modalError}
              </div>
            )}

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => {
                    setModalError(null)
                    setFormData({ ...formData, descricao: e.target.value })
                  }}
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
                    onChange={(e) => {
                      setModalError(null)
                      setFormData({ ...formData, valor: e.target.value })
                    }}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    id="tipo"
                    value={formData.tipo}
                    onChange={(e) => {
                      setModalError(null)
                      setFormData({
                        ...formData,
                        tipo: e.target.value,
                        categoriaId: '',
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
                  onChange={(e) => {
                    setModalError(null)
                    setFormData({ ...formData, pessoaId: e.target.value })
                  }}
                  required
                >
                  <option value="">Selecione uma pessoa</option>
                  {pessoas?.map((pessoa) => (
                    <option key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome} ({pessoa.idade} anos)
                    </option>
                  ))}
                </Select>

                {parseInt(formData.tipo) === TipoTransacao.Receita && !podeCadastrarReceita && (
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
                  onChange={(e) => {
                    setModalError(null)
                    setFormData({ ...formData, categoriaId: e.target.value })
                  }}
                  required
                  disabled={!formData.tipo}
                >
                  <option value="">
                    {formData.tipo ? 'Selecione uma categoria' : 'Selecione primeiro o tipo'}
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
                  onChange={(e) => {
                    setModalError(null)
                    setFormData({ ...formData, data: e.target.value })
                  }}
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
                  (parseInt(formData.tipo) === TipoTransacao.Receita && !podeCadastrarReceita)
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

      {/* Modal de sucesso */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transação criada ✅</DialogTitle>
            <DialogDescription>Sua transação foi registrada com sucesso.</DialogDescription>
          </DialogHeader>

          {successInfo && (
            <div className="mt-2 rounded-md border bg-muted/30 p-4 text-sm space-y-2">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Descrição</span>
                <span className="font-medium text-right">{successInfo.descricao}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Tipo</span>
                <span className="font-medium">{successInfo.tipo}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Valor</span>
                <span className="font-medium">{formatCurrency(successInfo.valor)}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Pessoa</span>
                <span className="font-medium text-right">{successInfo.pessoa}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Categoria</span>
                <span className="font-medium text-right">{successInfo.categoria}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Data</span>
                <span className="font-medium text-right">{successInfo.data}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                setIsSuccessDialogOpen(false)
                setSuccessInfo(null)
              }}
            >
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
