import * as React from "react";
import { Users, Trash2, Search } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useDeletePessoa, usePessoas } from "./hooks";
import { PessoaCreateDialog } from "./PessoaCreateDialog";

export function PessoasPage() {
  const { data, isLoading, isError, error } = usePessoas();
  const del = useDeletePessoa();

  const [q, setQ] = React.useState("");
  const pessoas = (data ?? []).filter((p) =>
    p.nome.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Hero / Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-zinc-900">
            <div className="h-9 w-9 rounded-xl bg-white border border-zinc-200 grid place-items-center">
              <Users className="h-5 w-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold">Pessoas</h1>
          </div>
          <p className="text-sm text-zinc-600 mt-1">
            Cadastre pessoas para vincular transações e gerar relatórios consolidados.
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary">CRUD</Badge>
            <Badge variant="secondary">React Query</Badge>
            <Badge variant="secondary">shadcn/ui</Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative">
            <Search className="h-4 w-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome..."
              className="pl-9 w-full sm:w-[260px] bg-white"
            />
          </div>
          <PessoaCreateDialog />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Kpi title="Total de pessoas" value={(data ?? []).length} />
        <Kpi
          title="Maiores de idade"
          value={(data ?? []).filter((p) => p.idade >= 18).length}
        />
        <Kpi
          title="Menores de idade"
          value={(data ?? []).filter((p) => p.idade < 18).length}
        />
      </div>

      {/* Content */}
      <Card className="shadow-sm border-zinc-200/70">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-600">
              Mostrando <b className="text-zinc-900">{pessoas.length}</b> de{" "}
              <b className="text-zinc-900">{(data ?? []).length}</b>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-44 w-full" />
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertTitle>Não consegui carregar as pessoas</AlertTitle>
              <AlertDescription>
                {(error as any)?.friendlyMessage ?? (error as any)?.message ?? "Erro desconhecido"}
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !isError && (data ?? []).length === 0 && (
            <EmptyState />
          )}

          {!isLoading && !isError && (data ?? []).length > 0 && (
            <div className="overflow-x-auto rounded-xl border bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-50">
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-right">Idade</TableHead>
                    <TableHead className="text-right w-[160px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pessoas.map((p) => (
                    <TableRow key={p.id} className="hover:bg-zinc-50/70">
                      <TableCell className="font-medium">{p.nome}</TableCell>
                      <TableCell className="text-right">
                        <span className={p.idade < 18 ? "text-amber-700 font-medium" : ""}>
                          {p.idade}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={del.isPending}
                          onClick={() => {
                            const ok = confirm(
                              `Remover "${p.nome}"?\n\nRegra: ao deletar uma pessoa, todas as transações dela serão apagadas.`
                            );
                            if (ok) del.mutate(p.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {pessoas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-sm text-zinc-500 py-10">
                        Nenhum resultado para “{q}”.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="text-xs text-zinc-500">
            Observação: a regra de cascata (deletar pessoa apaga transações) é aplicada no back-end.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ title, value }: { title: string; value: number }) {
  return (
    <Card className="border-zinc-200/70 shadow-sm">
      <CardContent className="p-4">
        <div className="text-xs text-zinc-500">{title}</div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border bg-white p-8 text-center">
      <div className="text-lg font-semibold">Comece cadastrando uma pessoa</div>
      <div className="text-sm text-zinc-600 mt-1">
        Pessoas são usadas para vincular transações e gerar relatórios por pessoa.
      </div>
      <div className="text-xs text-zinc-500 mt-3">
        Dica: cadastre menores de idade para validar a regra de “apenas despesas”.
      </div>
    </div>
  );
}
