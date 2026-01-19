import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '@/api/client'
import { categoriasService } from '@/services/categoriasService'

vi.mock('@/api/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('categoriasService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('listar deve chamar GET /categorias e mapear camelCase', async () => {
    ;(api.get as any).mockResolvedValue({
      data: [{ id: 1, descricao: 'Casa', finalidade: 'Despesa' }],
    })

    const result = await categoriasService.listar()

    expect(api.get).toHaveBeenCalledWith('/categorias')
    expect(result).toEqual([{ id: 1, descricao: 'Casa', finalidade: 'Despesa' }])
  })

  it('listar deve mapear PascalCase (Id/Descricao/Finalidade)', async () => {
    ;(api.get as any).mockResolvedValue({
      data: [{ Id: 2, Descricao: 'Mercado', Finalidade: 'Ambas' }],
    })

    const result = await categoriasService.listar()

    expect(api.get).toHaveBeenCalledWith('/categorias')
    expect(result).toEqual([{ id: 2, descricao: 'Mercado', finalidade: 'Ambas' }])
  })

  it('buscarPorId deve chamar GET /categorias/:id', async () => {
    ;(api.get as any).mockResolvedValue({ data: { id: 1, descricao: 'Casa', finalidade: 'Despesa' } })

    const result = await categoriasService.buscarPorId(1)

    expect(api.get).toHaveBeenCalledWith('/categorias/1')
    expect(result).toEqual({ id: 1, descricao: 'Casa', finalidade: 'Despesa' })
  })

  it('criar deve chamar POST /categorias com payload', async () => {
    const payload = { descricao: 'Nova', finalidade: 1 } as any
    ;(api.post as any).mockResolvedValue({ data: { id: 10 } })

    const result = await categoriasService.criar(payload)

    expect(api.post).toHaveBeenCalledWith('/categorias', payload)
    expect(result).toEqual({ id: 10 })
  })

  it('atualizar deve chamar PUT /categorias/:id com payload', async () => {
    const payload = { descricao: 'Atualizada', finalidade: 2 } as any
    ;(api.put as any).mockResolvedValue({})

    await categoriasService.atualizar(5, payload)

    expect(api.put).toHaveBeenCalledWith('/categorias/5', payload)
  })

  it('excluir deve chamar DELETE /categorias/:id', async () => {
    ;(api.delete as any).mockResolvedValue({})

    await categoriasService.excluir(7)

    expect(api.delete).toHaveBeenCalledWith('/categorias/7')
  })
})
