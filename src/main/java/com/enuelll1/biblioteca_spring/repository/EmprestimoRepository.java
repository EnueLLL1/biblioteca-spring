package com.enuelll1.biblioteca_spring.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.enuelll1.biblioteca_spring.model.ModelBiblioteca;
import com.enuelll1.biblioteca_spring.model.ModelEmprestimos;
import com.enuelll1.biblioteca_spring.model.Usuario;

public interface EmprestimoRepository extends JpaRepository<ModelEmprestimos, Long> {

    /*
     * EmprestimoRepository - você precisa criar queries para:
     * 
     * Buscar empréstimos por livro
     * Buscar empréstimos por usuário (nome)
     * Buscar empréstimos ativos (não devolvidos)
     * Buscar empréstimos atrasados (data devolução passou)
     * Contar quantas vezes um livro foi emprestado
     */
// Buscar por livro
List<ModelEmprestimos> findByLivro(ModelBiblioteca livro);
// OU por ID do livro:
List<ModelEmprestimos> findByLivro_IdLivro(Long livroId);

// Buscar por usuário
List<ModelEmprestimos> findByUsuario(Usuario usuario);
// OU por nome do usuário:
List<ModelEmprestimos> findByUsuario_NomeContaining(String nomeUsuario);

// Buscar empréstimos ativos (status = ATIVO)
List<ModelEmprestimos> findByStatus(ModelEmprestimos.StatusEmprestimo status);

// Buscar atrasados (data de devolução passou e status ainda é ATIVO)
@Query("SELECT e FROM ModelEmprestimos e WHERE e.status = 'ATIVO' AND e.dataDevolucao < CURRENT_DATE")
List<ModelEmprestimos> findEmprestimosAtrasados();

// Contar empréstimos de um livro
long countByLivro(ModelBiblioteca livro);

}
