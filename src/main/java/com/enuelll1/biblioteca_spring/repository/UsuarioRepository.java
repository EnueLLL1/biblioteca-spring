package com.enuelll1.biblioteca_spring.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.enuelll1.biblioteca_spring.model.ModelUsuario;

@Repository
public interface UsuarioRepository extends JpaRepository<ModelUsuario, Long> {
    /*
     * UsuarioRepository - você precisa criar queries para:
     *
     * Buscar usuario por nome
     * Buscar usuarios por email
     * Verificar se usuario existe por email
     */

    // Listar usuarios por nome
    List<ModelUsuario> findByNomeContaining(String nome);

    // Buscar usuario por email exato
    ModelUsuario findByEmail(String email);

    // Verificar se usuario existe por email exato
    boolean existsByEmail(String email);

}
