import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import type { RelatorioTotaisPorPessoaResponse } from "./types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import { Skeleton } from "../../components/ui/skeleton";
import { Badge } from "../../components/ui/badge";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function RelatorioPessoas() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["relatorios", "totais-por-pessoa"],
    queryFn: async () => {
      const r = await api.get<RelatorioTotaisPorPessoaResponse>(
        "/relatorios/totais-por-pessoa"
      );
      return r.data;
    },
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <Card className="border-zinc-200/70">
        <CardHeader className="flex flex-col gap-2">
          <CardTitle className="text-xl md:text-2xl">
            Totais por pessoa
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">React Query</Badge>
            <Badge variant="secondary">Axios</Badge>
            <Badge variant="secondary">shadcn/ui</Badge>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-40 w-full" />
            </div>
          )}

          {isError && (
            <div className="rounded-md border p-4 text-sm">
              <div className="font-medium">Não consegui carregar o relatório.</div>
              <div className="text-zinc-600 mt-1">
                {(error as any)?.message ?? "Erro desconhecido"}
              </div>
              <div className="text-zinc-600 mt-1">
                Dica: confirme se a API está rodando em{" "}
                <b>{import.meta.env.VITE_API_URL}</b> e se o endpoint existe.
              </div>
            </div>
          )}

          {data && (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-right">Receitas</TableHead>
                    <TableHead className="text-right">Despesas</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.pessoas.map((p) => (
                    <TableRow key={p.pessoaId}>
                      <TableCell className="font-medium">{p.nome}</TableCell>
                      <TableCell className="text-right">
                        {formatBRL(p.totalReceitas)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatBRL(p.totalDespesas)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatBRL(p.saldo)}
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow className="bg-zinc-50/60">
                    <TableCell className="font-semibold">Total geral</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatBRL(data.totalGeral.totalReceitas)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatBRL(data.totalGeral.totalDespesas)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatBRL(data.totalGeral.saldo)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
