import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPessoa, deletePessoa, listPessoas, type PessoaCreateDto } from "./api";

export function usePessoas() {
  return useQuery({
    queryKey: ["pessoas"],
    queryFn: listPessoas,
  });
}

export function useCreatePessoa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: PessoaCreateDto) => createPessoa(dto),
    onSuccess: async () => {
      toast.success("Pessoa cadastrada com sucesso!");
      await qc.invalidateQueries({ queryKey: ["pessoas"] });
    },
    onError: (err: any) => {
      toast.error(err?.friendlyMessage ?? "Não foi possível cadastrar a pessoa.");
    },
  });
}

export function useDeletePessoa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePessoa(id),
    onSuccess: async () => {
      toast.success("Pessoa removida com sucesso!");
      await qc.invalidateQueries({ queryKey: ["pessoas"] });
    },
    onError: (err: any) => {
      toast.error(err?.friendlyMessage ?? "Não foi possível remover a pessoa.");
    },
  });
}
