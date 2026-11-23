import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Generos from './Generos'
import { ToastProvider } from '../components/ui/ToastProvider'
import { generosAPI } from '../services/api'

vi.mock('../services/api', () => ({
  generosAPI: {
    listarTodos: vi.fn(),
    criar: vi.fn(),
    deletar: vi.fn(),
  },
}))

function renderGeneros() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <Generos />
      </ToastProvider>
    </MemoryRouter>
  )
}

describe('Generos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve listar os gêneros retornados pela API', async () => {
    generosAPI.listarTodos.mockResolvedValue([
      { idGenero: 1, nomeGenero: 'Ficção Científica' },
      { idGenero: 2, nomeGenero: 'Fantasia' },
    ])

    renderGeneros()

    expect(await screen.findByText('Ficção Científica')).toBeInTheDocument()
    expect(screen.getByText('Fantasia')).toBeInTheDocument()
  })

  it('deve exibir mensagem quando não houver gêneros cadastrados', async () => {
    generosAPI.listarTodos.mockResolvedValue([])

    renderGeneros()

    expect(
      await screen.findByText('Nenhum gênero cadastrado. Crie o primeiro!')
    ).toBeInTheDocument()
  })

  it('deve deletar o gênero quando o usuário confirmar no dialog', async () => {
    const user = userEvent.setup()
    generosAPI.listarTodos
      .mockResolvedValueOnce([{ idGenero: 1, nomeGenero: 'Drama' }])
      .mockResolvedValueOnce([])
    generosAPI.deletar.mockResolvedValue(null)

    renderGeneros()

    await screen.findByText('Drama')
    await user.click(screen.getByRole('button', { name: 'Deletar Drama' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Deletar gênero?')).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Deletar' }))

    await waitFor(() => {
      expect(generosAPI.deletar).toHaveBeenCalledWith(1)
    })
    expect(
      await screen.findByText('Nenhum gênero cadastrado. Crie o primeiro!')
    ).toBeInTheDocument()
  })
})
