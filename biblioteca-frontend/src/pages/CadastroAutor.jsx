import { useNavigate } from 'react-router-dom'
import AutorForm from '../components/forms/AutorForm'
import PageHeader from '../components/ui/PageHeader'
import { useToast } from '../components/ui/toastContext'

export default function CadastroAutor() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Cadastros"
        title="Novo autor"
        description="Adicione um novo escritor para associar aos livros do catálogo."
      />
      <div className="rounded-2xl border border-edge bg-surface p-6 shadow-xs sm:p-8">
        <AutorForm
          onSuccess={() => {
            showToast({ type: 'success', message: 'Autor cadastrado com sucesso.' })
            navigate('/autores')
          }}
          onCancel={() => navigate('/autores')}
        />
      </div>
    </div>
  )
}
