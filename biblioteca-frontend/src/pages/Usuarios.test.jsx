import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Usuarios from './Usuarios'
import { ToastProvider } from '../components/ui/ToastProvider'
import { usuariosAPI } from '../services/api'

vi.mock('../services/api', () => ({
  usuariosAPI: {
    listarTodos: vi.fn(),
    criar: vi.fn(),
    deletar: vi.fn(),
  },
}))

function renderUsuarios() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <Usuarios />
      </ToastProvider>
    </MemoryRouter>
  )
}

describe('Usuarios', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lista usuários, cria novo leitor via modal e exibe erro inline ao falhar exclusão', async () => {
    const user = userEvent.setup()
    const maria = {
      id: 1,
      nome: 'Maria Souza',
      email: 'maria@exemplo.com',
      telefone: '11999990000',
    }
    const lucas = {
      id: 2,
      nome: 'Lucas Lima',
      email: 'lucas@exemplo.com',
      telefone: '',
    }

    usuariosAPI.listarTodos
      .mockResolvedValueOnce([maria])
      .mockResolvedValueOnce([maria, lucas])
    usuariosAPI.criar.mockResolvedValue(lucas)
    usuariosAPI.deletar.mockRejectedValue(
      new Error('Não é possível excluir usuário com empréstimos vinculados.')
    )

    renderUsuarios()

    expect(await screen.findByText('Maria Souza')).toBeInTheDocument()
    expect(screen.getByText('maria@exemplo.com')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Novo usuário' }))
    const createDialog = screen.getByRole('dialog')

    await user.type(within(createDialog).getByLabelText(/Nome completo/i), 'Lucas Lima')
    await user.type(within(createDialog).getByLabelText(/E-mail/i), 'lucas@exemplo.com')
    await user.click(within(createDialog).getByRole('button', { name: 'Salvar usuário' }))

    await waitFor(() => {
      expect(usuariosAPI.criar).toHaveBeenCalledWith({
        nome: 'Lucas Lima',
        email: 'lucas@exemplo.com',
        telefone: '',
      })
    })

    expect(await screen.findByText('Lucas Lima')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Excluir Maria Souza' }))
    const deleteDialog = screen.getByRole('dialog')
    await user.click(within(deleteDialog).getByRole('button', { name: 'Excluir' }))

    await waitFor(() => {
      expect(
        within(deleteDialog).getByText(
          'Não é possível excluir usuário com empréstimos vinculados.'
        )
      ).toBeInTheDocument()
    })
  })
})
