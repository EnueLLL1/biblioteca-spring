import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Generos from './Generos'
import { generosAPI } from '../services/api'

vi.mock('../services/api', () => ({
  generosAPI: {
    listarTodos: vi.fn(),
    deletar: vi.fn(),
  },
}))

describe('Generos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve listar os gêneros retornados pela API', async () => {
    generosAPI.listarTodos.mockResolvedValue([
      { idGenero: 1, nomeGenero: 'Ficção Científica' },
      { idGenero: 2, nomeGenero: 'Fantasia' },
    ])

    render(
      <MemoryRouter>
        <Generos />
      </MemoryRouter>
    )

    expect(await screen.findByText('Ficção Científica')).toBeInTheDocument()
    expect(screen.getByText('Fantasia')).toBeInTheDocument()
  })

  it('deve exibir mensagem quando não houver gêneros cadastrados', async () => {
    generosAPI.listarTodos.mockResolvedValue([])

    render(
      <MemoryRouter>
        <Generos />
      </MemoryRouter>
    )

    expect(
      await screen.findByText('Nenhum gênero cadastrado. Crie o primeiro!')
    ).toBeInTheDocument()
  })

  it('deve deletar o gênero quando o usuário confirmar', async () => {
    const user = userEvent.setup()
    generosAPI.listarTodos
      .mockResolvedValueOnce([{ idGenero: 1, nomeGenero: 'Drama' }])
      .mockResolvedValueOnce([])
    generosAPI.deletar.mockResolvedValue(null)
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <MemoryRouter>
        <Generos />
      </MemoryRouter>
    )

    await screen.findByText('Drama')
    await user.click(screen.getByRole('button', { name: 'Deletar' }))

    await waitFor(() => {
      expect(generosAPI.deletar).toHaveBeenCalledWith(1)
    })
    expect(
      await screen.findByText('Nenhum gênero cadastrado. Crie o primeiro!')
    ).toBeInTheDocument()
  })
})
