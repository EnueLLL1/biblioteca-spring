import { Bookmark } from 'lucide-react'
import GeneroForm from '../components/forms/GeneroForm'
import SimpleCatalogPage from '../components/ui/SimpleCatalogPage'
import { generosAPI } from '../services/api'

export default function Generos() {
  return (
    <SimpleCatalogPage
      eyebrow="Cadastros"
      title="Gêneros"
      description="Classifique as obras por gênero literário ou editorial."
      singular="Gênero"
      article="o"
      newButtonLabel="Novo gênero"
      modalTitle="Cadastrar novo gênero"
      searchPlaceholder="Buscar gêneros..."
      emptyTitle="Nenhum gênero cadastrado. Crie o primeiro!"
      emptyDescription="Use gêneros como Romance, Suspense, Biografia ou Ficção Científica."
      deleteConfirmTitle="Deletar gênero?"
      deleteErrorFallback="Não foi possível deletar este gênero. Verifique se há livros associados."
      icon={Bookmark}
      api={generosAPI}
      getId={g => g.idGenero}
      getName={g => g.nomeGenero}
      FormComponent={GeneroForm}
    />
  )
}
