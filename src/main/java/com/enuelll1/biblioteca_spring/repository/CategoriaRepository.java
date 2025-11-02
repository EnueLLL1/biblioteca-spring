package com.enuelll1.biblioteca_spring.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.enuelll1.biblioteca_spring.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    /*
     * CategoriaRepository e GeneroRepository:
     * 
     * Buscar por nome
     * Verificar se existe
     */

    // Buscar por nome
    Optional<Categoria> findByNomeCategoria(String nome);

    // Verificar se existe
    boolean existsByNomeCategoria(String nome);

    // Buscar por nome contendo
    java.util.List<Categoria> findByNomeCategoriaContaining(String nome);

}
