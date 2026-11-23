import { FolderOpen } from 'lucide-react'
import CategoriaForm from '../components/forms/CategoriaForm'
import SimpleCatalogPage from '../components/ui/SimpleCatalogPage'
import { categoriasAPI } from '../services/api'

export default function Categorias() {
  return (
    <SimpleCatalogPage
      eyebrow="Cadastros"
      title="Categorias"
      description="Agrupe o acervo por áreas temáticas e coleções."
      singular="Categoria"
      article="a"
      newButtonLabel="Nova categoria"
      modalTitle="Cadastrar nova categoria"
      searchPlaceholder="Buscar categorias..."
      emptyTitle="Nenhuma categoria cadastrada. Crie a primeira!"
      emptyDescription="Categorias facilitam a organização e filtragem do catálogo."
      deleteConfirmTitle="Deletar categoria?"
      deleteErrorFallback="Não foi possível deletar esta categoria. Verifique se há livros associados."
      icon={FolderOpen}
      api={categoriasAPI}
      getId={c => c.idCategoria}
      getName={c => c.nomeCategoria}
      FormComponent={CategoriaForm}
    />
  )
}
