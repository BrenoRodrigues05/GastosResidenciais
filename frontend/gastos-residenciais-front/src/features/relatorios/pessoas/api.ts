import { api } from "@/api/client";
import type { Pessoa } from "@/shared/types";

export type PessoaCreateDto = {
  nome: string;
  idade: number;
};

export async function listPessoas(): Promise<Pessoa[]> {
  const r = await api.get<Pessoa[]>("/pessoas");
  return r.data;
}

export async function createPessoa(dto: PessoaCreateDto): Promise<{ id: number }> {
  const r = await api.post<{ id: number }>("/pessoas", dto);
  return r.data;
}

export async function deletePessoa(id: number): Promise<void> {
  await api.delete(`/pessoas/${id}`);
}
