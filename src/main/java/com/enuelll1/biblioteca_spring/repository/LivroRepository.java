package com.enuelll1.biblioteca_spring.repository;

import java.util.List;
import java.util.Optional;
import com.enuelll1.biblioteca_spring.model.ModelAutor;
import com.enuelll1.biblioteca_spring.model.ModelBiblioteca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LivroRepository extends JpaRepository<ModelBiblioteca, Long> {

    /*
     * LivroRepository - você precisa criar queries para:
     * 
     * Buscar livro por título (contendo texto)
     * Buscar por ISBN
     * Buscar livros disponíveis
     * Buscar livros por autor
     * Buscar livros por categoria
     * Buscar livros por gênero
     * Verificar se ISBN já existe
     */

    // Listar livros por Titulo (contendo Texto)
    List<ModelBiblioteca> findByTituloLivroContaining(String tituloLivro);

    // Buscar por ISBN
    Optional<ModelBiblioteca> findByIsbn(String isbn);

    // Buscar livros disponíveis
    List<ModelBiblioteca> findByDisponivel(boolean disponivel);

    // Buscar livros por autor
    List<ModelBiblioteca> findByAutor(ModelAutor autor);

    // Buscar livros por categoria
    List<ModelBiblioteca> findByCategoria_NomeCategoriaContaining(String categoria);

    // Buscar livros por gênero
    List<ModelBiblioteca> findByGenero_NomeGeneroContaining(String genero);

    // Verificar se ISBN já existe
    boolean existsByIsbn(String isbn);

}
