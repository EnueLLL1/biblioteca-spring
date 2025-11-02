package com.enuelll1.biblioteca_spring.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.enuelll1.biblioteca_spring.model.Genero;

public interface GeneroRepository extends JpaRepository<Genero, Long> {
    /*
     * CategoriaRepository e GeneroRepository:
     * 
     * Buscar por nome
     * Verificar se existe
     * 
     */

     // Buscar por nome
     Optional<Genero> findByNomeGenero(String nome);

     // Verificar se existe
     boolean existsByNomeGenero(String nome);

}
