import { useNavigate } from 'react-router-dom'
import CategoriaForm from '../components/forms/CategoriaForm'
import PageHeader from '../components/ui/PageHeader'
import { useToast } from '../components/ui/toastContext'

export default function CadastroCategoria() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Cadastros"
        title="Nova categoria"
        description="Defina uma categoria temática para classificar os livros."
      />
      <div className="rounded-2xl border border-edge bg-surface p-6 shadow-xs sm:p-8">
        <CategoriaForm
          onSuccess={() => {
            showToast({ type: 'success', message: 'Categoria cadastrada com sucesso.' })
            navigate('/categorias')
          }}
          onCancel={() => navigate('/categorias')}
        />
      </div>
    </div>
  )
}
