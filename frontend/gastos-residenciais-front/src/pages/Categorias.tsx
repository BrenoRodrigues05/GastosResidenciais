import { useState } from 'react'
import type { AxiosError } from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriasService } from '@/services/categoriasService'
import {
  CategoriaListDto,
  CategoriaCreateDto,
  CategoriaUpdateDto,
  FinalidadeCategoria,
  FinalidadeCategoriaText,
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
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

// Estilo para as finalidades separado por cores
const badgeStyle: Record<'Despesa' | 'Receita' | 'Ambas', string> = {
  Despesa: 'bg-red-100 text-red-700 dark:bg-red-900/30',
  Receita: 'bg-green-100 text-green-700 dark:bg-green-900/30',
  Ambas: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30',
}

// Converte texto vindo do GET -> enum numérico esperado no POST/PUT
const finalidadeTextToEnum: Record<FinalidadeCategoriaText, FinalidadeCategoria> = {
  Despesa: FinalidadeCategoria.Despesa,
  Receita: FinalidadeCategoria.Receita,
  Ambas: FinalidadeCategoria.Ambas,
}

// helper que pega mensagens de erros vindas da API
const getApiMessage = (err: unknown) => {
  const axiosErr = err as AxiosError<any>
  return (
    axiosErr?.response?.data?.message ||
    axiosErr?.response?.data?.error ||
    'Ocorreu um erro. Tente novamente.'
  )
}

export default function Categorias() {
  const queryClient = useQueryClient()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [categoriaEditando, setCategoriaEditando] = useState<CategoriaListDto | null>(null)
  const [formData, setFormData] = useState({ descricao: '', finalidade: '1' })

  // erro exibido dentro dos modais
  const [modalError, setModalError] = useState<string | null>(null)

  // modal de exclusão
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState<CategoriaListDto | null>(null)

  const { data: categorias, isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasService.listar,
  })

  const resetForm = () => {
    setFormData({ descricao: '', finalidade: '1' })
    setCategoriaEditando(null)
    setModalError(null)
  }

  const criarMutation = useMutation({
    mutationFn: (dados: CategoriaCreateDto) => categoriasService.criar(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      setIsDialogOpen(false)
      resetForm()
    },
    onError: (err) => {
      setModalError(getApiMessage(err))
    },
  })

  const atualizarMutation = useMutation({
    mutationFn: ({ id, dados }: { id: number; dados: CategoriaUpdateDto }) =>
      categoriasService.atualizar(id, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      setIsDialogOpen(false)
      resetForm()
      setCategoriaEditando(null)
    },
    onError: (err) => {
      setModalError(getApiMessage(err))
    },
  })

  const excluirMutation = useMutation({
    mutationFn: (id: number) => categoriasService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      setIsDeleteDialogOpen(false)
      setCategoriaParaExcluir(null)
      setModalError(null)
    },
    onError: (err) => {
      setModalError(getApiMessage(err))
    },
  })

  const handleOpenDialog = (categoria?: CategoriaListDto) => {
    setModalError(null)

    if (categoria) {
      setCategoriaEditando(categoria)
      setFormData({
        descricao: categoria.descricao,
        finalidade: String(finalidadeTextToEnum[categoria.finalidade]),
      })
    } else {
      resetForm()
    }

    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const dados = {
      descricao: formData.descricao,
      finalidade: parseInt(formData.finalidade) as FinalidadeCategoria,
    }

    if (categoriaEditando) {
      atualizarMutation.mutate({ id: categoriaEditando.id, dados })
    } else {
      criarMutation.mutate(dados)
    }
  }

  const handleExcluir = (categoria: CategoriaListDto) => {
    setModalError(null)
    setCategoriaParaExcluir(categoria)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">Gerencie as categorias de transações</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
          <CardDescription>Todas as categorias cadastradas no sistema</CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : categorias && categorias.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Finalidade</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {categorias.map((categoria) => (
                    <TableRow
                      key={categoria.id}
                      className="h-14 hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-semibold text-lg md:text-xl">
                        {categoria.descricao}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            badgeStyle[categoria.finalidade]
                          }`}
                        >
                          {categoria.finalidade}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(categoria)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleExcluir(categoria)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              Nenhuma categoria cadastrada. Clique em "Nova Categoria" para começar.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dialog criar/editar */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}
      >
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {categoriaEditando ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
              <DialogDescription>
                {categoriaEditando
                  ? 'Atualize os dados da categoria'
                  : 'Preencha os dados para criar uma nova categoria'}
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

              <div className="grid gap-2">
                <Label htmlFor="finalidade">Finalidade</Label>
                <Select
                  id="finalidade"
                  value={formData.finalidade}
                  onChange={(e) => {
                    setModalError(null)
                    setFormData({ ...formData, finalidade: e.target.value })
                  }}
                  required
                >
                  <option value={FinalidadeCategoria.Despesa}>Despesa</option>
                  <option value={FinalidadeCategoria.Receita}>Receita</option>
                  <option value={FinalidadeCategoria.Ambas}>Ambas</option>
                </Select>
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
                disabled={criarMutation.isPending || atualizarMutation.isPending}
              >
                {criarMutation.isPending || atualizarMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : categoriaEditando ? (
                  'Salvar Alterações'
                ) : (
                  'Criar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog excluir */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (excluirMutation.isPending) return
          setIsDeleteDialogOpen(open)
          if (!open) {
            setCategoriaParaExcluir(null)
            setModalError(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Categoria</DialogTitle>
            <DialogDescription>
              {categoriaParaExcluir ? (
                <>
                  Tem certeza que deseja excluir{' '}
                  <span className="font-semibold">
                    {categoriaParaExcluir.descricao}
                  </span>
                  ?
                  <br />
                  Essa ação não pode ser desfeita.
                </>
              ) : (
                'Tem certeza que deseja excluir esta categoria?'
              )}
            </DialogDescription>
          </DialogHeader>

          {modalError && (
            <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {modalError}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={excluirMutation.isPending}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={excluirMutation.isPending || !categoriaParaExcluir}
              onClick={() => {
                if (!categoriaParaExcluir) return
                setModalError(null)
                excluirMutation.mutate(categoriaParaExcluir.id)
              }}
            >
              {excluirMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
