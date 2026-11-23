import { useNavigate } from 'react-router-dom'
import GeneroForm from '../components/forms/GeneroForm'
import PageHeader from '../components/ui/PageHeader'
import { useToast } from '../components/ui/toastContext'

export default function CadastroGenero() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Cadastros"
        title="Novo gênero"
        description="Adicione um gênero literário para vincular aos livros do catálogo."
      />
      <div className="rounded-2xl border border-edge bg-surface p-6 shadow-xs sm:p-8">
        <GeneroForm
          onSuccess={() => {
            showToast({ type: 'success', message: 'Gênero cadastrado com sucesso.' })
            navigate('/generos')
          }}
          onCancel={() => navigate('/generos')}
        />
      </div>
    </div>
  )
}
