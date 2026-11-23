import { describe, it, expect, vi, beforeEach } from 'vitest'
import { emprestimosAPI, generosAPI, livrosAPI } from './api'

describe('api.jsx', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('deve retornar JSON quando response.ok for true', async () => {
    const mockLivros = [{ idLivro: 1, tituloLivro: 'Clean Code' }]
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockLivros,
    })

    const resultado = await livrosAPI.listarTodos()

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/livros', {})
    expect(resultado).toEqual(mockLivros)
  })

  it('deve lançar erro com status e message quando response.ok for false', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ status: 400, message: 'Livro indisponível' }),
    })

    await expect(
      emprestimosAPI.criar({ livroId: 1, usuarioId: 2 })
    ).rejects.toMatchObject({
      message: 'Livro indisponível',
      status: 400,
      response: { status: 400 },
    })
  })

  it('deve retornar null no DELETE quando status for 204 No Content', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      json: vi.fn(),
    })

    const resultado = await generosAPI.deletar(5)

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/generos/5', {
      method: 'DELETE',
    })
    expect(resultado).toBeNull()
  })
})
