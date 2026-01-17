import { api } from '@/api/client'
import {
  CategoriaCreateDto,
  CategoriaListDto,
  CategoriaUpdateDto,
  CategoriaCreateResponse,
} from '@/types/api'

export const categoriasService = {
  async listar(): Promise<CategoriaListDto[]> {
  const res = await api.get('/categorias')
   console.log("GET /categorias ->", res.data)
  return res.data.map((c: any) => ({
    id: c.id ?? c.Id,
    descricao: c.descricao ?? c.Descricao,
    finalidade: c.finalidade ?? c.Finalidade,
  }))
},

  async buscarPorId(id: number): Promise<CategoriaListDto> {
    const response = await api.get<CategoriaListDto>(`/categorias/${id}`)
    return response.data
  },

  async criar(dados: CategoriaCreateDto): Promise<CategoriaCreateResponse> {
    const response = await api.post<CategoriaCreateResponse>('/categorias', dados)
    return response.data
  },

  async atualizar(id: number, dados: CategoriaUpdateDto): Promise<void> {
    await api.put(`/categorias/${id}`, dados)
  },

  async excluir(id: number): Promise<void> {
    await api.delete(`/categorias/${id}`)
  },
}
