import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Livros from './Livros'
import { ToastProvider } from '../components/ui/ToastProvider'
import { livrosAPI } from '../services/api'

vi.mock('../services/api', () => ({
  livrosAPI: {
    listarTodos: vi.fn(),
    deletar: vi.fn(),
  },
}))

const MOCK_LIVROS = [
  {
    idLivro: 1,
    tituloLivro: 'Ficção Moderna',
    editoraLivro: 'Editora Alfa',
    anoPublicado: 2021,
    descricaoLivro: 'Coletânea de ensaios.',
    isbnLivro: '9788535911664',
    disponivel: true,
    autorLivro: 'Clarice Lispector',
    categorias: ['Literatura'],
    generos: ['Ensaio'],
  },
  {
    idLivro: 2,
    tituloLivro: 'Dom Casmurro',
    editoraLivro: 'Garnier',
    anoPublicado: 1899,
    descricaoLivro: 'Clássico brasileiro.',
    isbnLivro: '9788520923252',
    disponivel: false,
    autorLivro: 'Machado de Assis',
    categorias: ['Clássicos'],
    generos: ['Romance'],
  },
]

function renderLivros() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <Livros />
      </ToastProvider>
    </MemoryRouter>
  )
}

describe('Livros', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('filtra livros ignorando acentos e caixa alta/baixa e bloqueia exclusão de livro emprestado', async () => {
    const user = userEvent.setup()
    livrosAPI.listarTodos.mockResolvedValue(MOCK_LIVROS)

    renderLivros()

    expect(await screen.findByText('Ficção Moderna')).toBeInTheDocument()
    expect(screen.getByText('Dom Casmurro')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Excluir Dom Casmurro' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Excluir Ficção Moderna' })).toBeEnabled()

    const searchInput = screen.getByLabelText('Busca rápida')
    await user.type(searchInput, 'ficcao')

    expect(screen.getByText('Ficção Moderna')).toBeInTheDocument()
    expect(screen.queryByText('Dom Casmurro')).not.toBeInTheDocument()
  })

  it('exibe mensagem explicativa quando exclusão retorna HTTP 500 por histórico de empréstimo', async () => {
    const user = userEvent.setup()
    livrosAPI.listarTodos.mockResolvedValue([MOCK_LIVROS[0]])
    const err = new Error('Erro interno inesperado no servidor.')
    err.status = 500
    livrosAPI.deletar.mockRejectedValue(err)

    renderLivros()

    await screen.findByText('Ficção Moderna')
    await user.click(screen.getByRole('button', { name: 'Excluir Ficção Moderna' }))

    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Excluir' }))

    await waitFor(() => {
      expect(
        within(dialog).getByText(
          /possui histórico de empréstimos vinculado no sistema/i
        )
      ).toBeInTheDocument()
    })
  })
})
