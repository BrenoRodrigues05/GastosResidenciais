import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '@/api/client'
import { pessoasService } from '@/services/pessoasService'

vi.mock('@/api/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('pessoasService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('listar deve chamar GET /pessoas', async () => {
    ;(api.get as any).mockResolvedValue({
      data: [{ id: 1, nome: 'Ana', idade: 20 }],
    })

    const result = await pessoasService.listar()

    expect(api.get).toHaveBeenCalledWith('/pessoas')
    expect(result).toEqual([{ id: 1, nome: 'Ana', idade: 20 }])
  })

  it('buscarPorId deve chamar GET /pessoas/:id', async () => {
    ;(api.get as any).mockResolvedValue({
      data: { id: 2, nome: 'João', idade: 16 },
    })

    const result = await pessoasService.buscarPorId(2)

    expect(api.get).toHaveBeenCalledWith('/pessoas/2')
    expect(result).toEqual({ id: 2, nome: 'João', idade: 16 })
  })

  it('criar deve chamar POST /pessoas com payload', async () => {
    const payload = { nome: 'Maria', idade: 30 } as any
    ;(api.post as any).mockResolvedValue({ data: { id: 10 } })

    const result = await pessoasService.criar(payload)

    expect(api.post).toHaveBeenCalledWith('/pessoas', payload)
    expect(result).toEqual({ id: 10 })
  })

  it('atualizar deve chamar PUT /pessoas/:id com payload', async () => {
    const payload = { nome: 'Maria', idade: 31 } as any
    ;(api.put as any).mockResolvedValue({})

    await pessoasService.atualizar(10, payload)

    expect(api.put).toHaveBeenCalledWith('/pessoas/10', payload)
  })

  it('excluir deve chamar DELETE /pessoas/:id', async () => {
    ;(api.delete as any).mockResolvedValue({})

    await pessoasService.excluir(99)

    expect(api.delete).toHaveBeenCalledWith('/pessoas/99')
  })
})
