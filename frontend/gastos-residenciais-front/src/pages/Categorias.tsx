import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriasService } from '@/services/categoriasService'
import {
  CategoriaListDto,
  CategoriaCreateDto,
  CategoriaUpdateDto,
  FinalidadeCategoria,
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

export default function Categorias() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [categoriaEditando, setCategoriaEditando] = useState<CategoriaListDto | null>(null)
  const [formData, setFormData] = useState({ descricao: '', finalidade: '1' })

  const { data: categorias, isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasService.listar,
  })

  const criarMutation = useMutation({
    mutationFn: (dados: CategoriaCreateDto) => categoriasService.criar(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      setIsDialogOpen(false)
      resetForm()
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
  })

  const excluirMutation = useMutation({
    mutationFn: (id: number) => categoriasService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    },
  })

  const resetForm = () => {
    setFormData({ descricao: '', finalidade: '1' })
    setCategoriaEditando(null)
  }

  const handleOpenDialog = (categoria?: CategoriaListDto) => {
    if (categoria) {
      setCategoriaEditando(categoria)
      setFormData({
        descricao: categoria.descricao,
        finalidade: categoria.finalidade.toString(),
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

  const handleExcluir = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      excluirMutation.mutate(id)
    }
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
                    {categorias?.map((categoria) => (
                      <TableRow key={categoria.id} className="h-14 hover:bg-muted/30 transition-colors">
                        <TableCell className="font-semibold text-lg md:text-xl">
                            {categoria.descricao}
                          </TableCell>

                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              badgeStyle[categoria.finalidade]
                            }`}>
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
                              onClick={() => handleExcluir(categoria.id)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <div className="grid gap-2">
                <Label htmlFor="finalidade">Finalidade</Label>
                <Select
                  id="finalidade"
                  value={formData.finalidade}
                  onChange={(e) =>
                    setFormData({ ...formData, finalidade: e.target.value })
                  }
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
    </div>
  )
}
