import { api } from '@/api/client'
import {
  PessoaCreateDto,
  PessoaListDto,
  PessoaUpdateDto,
  PessoaCreateResponse,
} from '@/types/api'

export const pessoasService = {
  async listar(): Promise<PessoaListDto[]> {
    const response = await api.get<PessoaListDto[]>('/pessoas')
    return response.data
  },

  async buscarPorId(id: number): Promise<PessoaListDto> {
    const response = await api.get<PessoaListDto>(`/pessoas/${id}`)
    return response.data
  },

  async criar(dados: PessoaCreateDto): Promise<PessoaCreateResponse> {
    const response = await api.post<PessoaCreateResponse>('/pessoas', dados)
    return response.data
  },

  async atualizar(id: number, dados: PessoaUpdateDto): Promise<void> {
    await api.put(`/pessoas/${id}`, dados)
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/pessoas/${id}`)
  },
}
