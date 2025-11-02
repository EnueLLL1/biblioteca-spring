package com.enuelll1.biblioteca_spring.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.enuelll1.biblioteca_spring.model.ModelAutor;

@Repository
public interface AutorRepository extends JpaRepository<ModelAutor, Long> {
    /*
     * AutorRepository - você precisa criar queries para:
     * 
     * Buscar autor por nome
     * Buscar autores por nacionalidade
     * Verificar se autor existe por nome
     */

    // Listar autores por nome
    List<ModelAutor> findByAutorLivroContaining(String nome);

    // Listar autores por nacionalidade
    List<ModelAutor> findByAutorNacionalidadeContaining(String nacionalidade);

    // Verificar se autor existe por nome exato
    boolean existsByAutorLivro(String nome);

}
