import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LivroForm from './LivroForm'
import { ToastProvider } from '../ui/ToastProvider'
import {
  autoresAPI,
  categoriasAPI,
  generosAPI,
  livrosAPI,
} from '../../services/api'
import { CriarLivroDTOValidator, validarISBN } from '../../services/validation'

vi.mock('../../services/api', () => ({
  livrosAPI: {
    buscarPorId: vi.fn(),
    criar: vi.fn(),
    atualizar: vi.fn(),
  },
  autoresAPI: {
    listarTodos: vi.fn(),
    criar: vi.fn(),
  },
  categoriasAPI: {
    listarTodos: vi.fn(),
    criar: vi.fn(),
  },
  generosAPI: {
    listarTodos: vi.fn(),
    criar: vi.fn(),
  },
}))

describe('LivroForm & validação ISBN', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('valida ISBN-10 e ISBN-13 e evita converter ano vazio em zero', () => {
    expect(validarISBN('0-13-235088-2')).toBeNull()
    expect(validarISBN('978-85-359-1166-4')).toBeNull()
    expect(validarISBN('9788535911669')).toMatch(/inválido/i)

    const limpos = CriarLivroDTOValidator.limparDados({
      tituloLivro: 'Livro Teste',
      editoraLivro: 'Editora',
      anoPublicado: '',
      descricaoLivro: 'Descrição',
      isbnLivro: '0132350882',
      idAutor: '1',
    })
    const validator = new CriarLivroDTOValidator()
    expect(validator.validar(limpos)).toBe(false)
    expect(validator.getErrors().anoPublicado).toMatch(/número válido/i)
  })

  it('na edição preserva disponivel=false e mapeia ids pelo nome original', async () => {
    const user = userEvent.setup()
    autoresAPI.listarTodos.mockResolvedValue([
      { idAutor: 7, autorLivro: 'Machado de Assis', autorNacionalidade: 'Brasileira' },
    ])
    categoriasAPI.listarTodos.mockResolvedValue([
      { idCategoria: 3, nomeCategoria: 'Clássicos' },
    ])
    generosAPI.listarTodos.mockResolvedValue([
      { idGenero: 9, nomeGenero: 'Romance' },
    ])
    livrosAPI.buscarPorId.mockResolvedValue({
      idLivro: 42,
      tituloLivro: 'Dom Casmurro',
      editoraLivro: 'Garnier',
      anoPublicado: 1899,
      descricaoLivro: 'Clássico.',
      isbnLivro: '9788520923252',
      disponivel: false,
      autorLivro: 'Machado de Assis',
      categorias: ['Clássicos'],
      generos: ['Romance'],
    })
    livrosAPI.atualizar.mockResolvedValue({ idLivro: 42 })

    const onSuccess = vi.fn()
    render(
      <MemoryRouter>
        <ToastProvider>
          <LivroForm livroId="42" onSuccess={onSuccess} />
        </ToastProvider>
      </MemoryRouter>
    )

    expect(await screen.findByDisplayValue('Dom Casmurro')).toBeInTheDocument()
    expect(screen.getByText('Emprestado no momento')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    await waitFor(() => {
      expect(livrosAPI.atualizar).toHaveBeenCalledWith(
        '42',
        expect.objectContaining({
          disponivel: false,
          idAutor: 7,
          idCategorias: [3],
          idGeneros: [9],
        })
      )
    })
    expect(onSuccess).toHaveBeenCalled()
  })

  it('bloqueia o envio da edição se o autor original não for encontrado', async () => {
    autoresAPI.listarTodos.mockResolvedValue([])
    categoriasAPI.listarTodos.mockResolvedValue([])
    generosAPI.listarTodos.mockResolvedValue([])
    livrosAPI.buscarPorId.mockResolvedValue({
      idLivro: 42,
      tituloLivro: 'Dom Casmurro',
      editoraLivro: 'Garnier',
      anoPublicado: 1899,
      descricaoLivro: 'Clássico.',
      isbnLivro: '9788520923252',
      disponivel: true,
      autorLivro: 'Machado de Assis',
      categorias: [],
      generos: [],
    })

    render(
      <MemoryRouter>
        <ToastProvider>
          <LivroForm livroId="42" />
        </ToastProvider>
      </MemoryRouter>
    )

    expect(
      await screen.findByText(/Não foi possível mapear com segurança o autor/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeDisabled()
  })
})
