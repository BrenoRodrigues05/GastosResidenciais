import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pessoasService } from '@/services/pessoasService'
import { PessoaListDto, PessoaCreateDto, PessoaUpdateDto } from '@/types/api'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

export default function Pessoas() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [pessoaEditando, setPessoaEditando] = useState<PessoaListDto | null>(null)
  const [formData, setFormData] = useState({ nome: '', idade: '' })

  const { data: pessoas, isLoading } = useQuery({
    queryKey: ['pessoas'],
    queryFn: pessoasService.listar,
  })

  const criarMutation = useMutation({
    mutationFn: (dados: PessoaCreateDto) => pessoasService.criar(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pessoas'] })
      setIsDialogOpen(false)
      resetForm()
    },
  })

  const atualizarMutation = useMutation({
    mutationFn: ({ id, dados }: { id: number; dados: PessoaUpdateDto }) =>
      pessoasService.atualizar(id, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pessoas'] })
      setIsDialogOpen(false)
      resetForm()
      setPessoaEditando(null)
    },
  })

  const excluirMutation = useMutation({
    mutationFn: (id: number) => pessoasService.excluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pessoas'] })
    },
  })

  const resetForm = () => {
    setFormData({ nome: '', idade: '' })
    setPessoaEditando(null)
  }

  const handleOpenDialog = (pessoa?: PessoaListDto) => {
    if (pessoa) {
      setPessoaEditando(pessoa)
      setFormData({ nome: pessoa.nome, idade: pessoa.idade.toString() })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dados = {
      nome: formData.nome,
      idade: parseInt(formData.idade),
    }

    if (pessoaEditando) {
      atualizarMutation.mutate({ id: pessoaEditando.id, dados })
    } else {
      criarMutation.mutate(dados)
    }
  }

  const handleExcluir = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta pessoa?')) {
      excluirMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pessoas</h1>
          <p className="text-muted-foreground">Gerencie as pessoas do sistema</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Pessoa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pessoas</CardTitle>
          <CardDescription>Todas as pessoas cadastradas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : pessoas && pessoas.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pessoas.map((pessoa) => (
                    <TableRow key={pessoa.id} className="h-14">
                      <TableCell className="font-semibold text-lg md:text-xl tracking-tight">{pessoa.nome}</TableCell>
                       <TableCell>
                            <span
                              className={`px-2 py-1 rounded-md text-sm font-medium ${
                                pessoa.idade < 18
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              }`}
                            >
                              {pessoa.idade} anos
                            </span>
                          </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(pessoa)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleExcluir(pessoa.id)}
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
              Nenhuma pessoa cadastrada. Clique em "Nova Pessoa" para começar.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {pessoaEditando ? 'Editar Pessoa' : 'Nova Pessoa'}
              </DialogTitle>
              <DialogDescription>
                {pessoaEditando
                  ? 'Atualize os dados da pessoa'
                  : 'Preencha os dados para criar uma nova pessoa'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  min="0"
                  value={formData.idade}
                  onChange={(e) =>
                    setFormData({ ...formData, idade: e.target.value })
                  }
                  required
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
                disabled={criarMutation.isPending || atualizarMutation.isPending}
              >
                {criarMutation.isPending || atualizarMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : pessoaEditando ? (
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
