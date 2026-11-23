import { useNavigate } from 'react-router-dom'
import UsuarioForm from '../components/forms/UsuarioForm'
import PageHeader from '../components/ui/PageHeader'
import { useToast } from '../components/ui/toastContext'

export default function CadastroUsuario() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Cadastros"
        title="Novo usuário"
        description="Cadastre um leitor para registrar retiradas e devoluções de livros."
      />
      <div className="rounded-2xl border border-edge bg-surface p-6 shadow-xs sm:p-8">
        <UsuarioForm
          onSuccess={() => {
            showToast({ type: 'success', message: 'Usuário cadastrado com sucesso.' })
            navigate('/usuarios')
          }}
          onCancel={() => navigate('/usuarios')}
        />
      </div>
    </div>
  )
}
