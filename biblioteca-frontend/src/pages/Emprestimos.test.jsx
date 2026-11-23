import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Emprestimos from './Emprestimos'
import { ToastProvider } from '../components/ui/ToastProvider'
import { emprestimosAPI } from '../services/api'

vi.mock('../services/api', () => ({
  emprestimosAPI: {
    listarAtivos: vi.fn(),
    listarAtrasados: vi.fn(),
    devolver: vi.fn(),
  },
}))

function renderEmprestimos() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <Emprestimos />
      </ToastProvider>
    </MemoryRouter>
  )
}

describe('Emprestimos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lista empréstimos com datas formatadas, troca para aba Em atraso e registra devolução', async () => {
    const user = userEvent.setup()
    const ativo = {
      idEmprestimo: 10,
      tituloLivro: 'Clean Architecture',
      isbnLivro: '9780134494166',
      nomeUsuario: 'Ana Silva',
      emailUsuario: 'ana@email.com',
      dataEmprestimo: '2026-11-20',
      dataDevolucao: '2026-11-27',
    }
    const atrasado = {
      idEmprestimo: 11,
      tituloLivro: 'Refactoring',
      isbnLivro: '9780134757599',
      nomeUsuario: 'João Costa',
      emailUsuario: 'joao@email.com',
      dataEmprestimo: '2026-11-01',
      dataDevolucao: '2026-11-08',
    }

    emprestimosAPI.listarAtivos
      .mockResolvedValueOnce([ativo, atrasado])
      .mockResolvedValueOnce([atrasado])
    emprestimosAPI.listarAtrasados
      .mockResolvedValueOnce([atrasado])
      .mockResolvedValueOnce([atrasado])
    emprestimosAPI.devolver.mockResolvedValue({ ...ativo, status: 'DEVOLVIDO' })

    renderEmprestimos()

    expect(await screen.findByText('Clean Architecture')).toBeInTheDocument()
    expect(screen.getByText('20/11/2026')).toBeInTheDocument()
    expect(screen.getByText('27/11/2026')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: /Em atraso/i }))
    expect(screen.getByText('Refactoring')).toBeInTheDocument()
    expect(screen.queryByText('Clean Architecture')).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: /Ativos/i }))
    await user.click(screen.getByRole('button', { name: 'Devolver Clean Architecture' }))

    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Confirmar devolução' }))

    await waitFor(() => {
      expect(emprestimosAPI.devolver).toHaveBeenCalledWith(10)
    })
  })
})
