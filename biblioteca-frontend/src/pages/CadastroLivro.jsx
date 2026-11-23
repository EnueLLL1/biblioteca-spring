import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import LivroForm from '../components/forms/LivroForm'
import PageHeader from '../components/ui/PageHeader'
import { useToast } from '../components/ui/toastContext'

export default function CadastrarLivro() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { showToast } = useToast()

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4">
        <Link
          to="/livros"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Voltar para o acervo</span>
        </Link>
      </div>

      <PageHeader
        eyebrow="Circulação · Acervo"
        title={isEditing ? 'Editar livro' : 'Cadastrar novo livro'}
        description={
          isEditing
            ? 'Atualize os metadados editoriais preservando o histórico de circulação.'
            : 'Preencha os metadados bibliográficos para incluir a obra no catálogo.'
        }
      />

      <div className="rounded-2xl border border-edge bg-surface p-6 shadow-xs sm:p-8">
        <LivroForm
          livroId={id ?? null}
          onSuccess={() => {
            showToast({
              type: 'success',
              message: isEditing
                ? 'Livro atualizado com sucesso.'
                : 'Livro cadastrado com sucesso.',
            })
            navigate('/livros')
          }}
          onCancel={() => navigate('/livros')}
        />
      </div>
    </div>
  )
}
