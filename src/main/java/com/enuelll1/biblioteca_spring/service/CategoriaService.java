package com.enuelll1.biblioteca_spring.service;

import com.enuelll1.biblioteca_spring.dto.CategoriaDTO;
import com.enuelll1.biblioteca_spring.model.Categoria;
import com.enuelll1.biblioteca_spring.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    // ========================================
    // CONVERTER ENTITY → DTO
    // ========================================
    public CategoriaDTO converterParaDTO(Categoria categoria) {
        return new CategoriaDTO(
                categoria.getIdCategoria(),
                categoria.getNomeCategoria()
        );
    }

    // ========================================
    // CRIAR CATEGORIA
    // ========================================
    public CategoriaDTO criar(String nome) {
        // 1. Validar se nome já existe
        if (categoriaRepository.existsByNomeCategoria(nome)) {
            throw new RuntimeException("Categoria já cadastrada!");
        }

        // 2. Criar entidade
        Categoria categoria = new Categoria();
        categoria.setNomeCategoria(nome);

        // 3. Salvar
        Categoria salva = categoriaRepository.save(categoria);

        // 4. Retornar DTO
        return converterParaDTO(salva);
    }

    // ========================================
    // LISTAR TODOS
    // ========================================
    public List<CategoriaDTO> listar() {
        return categoriaRepository.findAll().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // ========================================
    // BUSCAR POR ID
    // ========================================
    public CategoriaDTO buscarPorId(Long id) {
        Optional<Categoria> categoriaOpt = categoriaRepository.findById(id);
        if (categoriaOpt.isEmpty()) {
            throw new RuntimeException("Categoria não encontrada!");
        }
        return converterParaDTO(categoriaOpt.get());
    }

    // ========================================
    // DELETAR CATEGORIA
    // ========================================
    public void deletar(Long id) {
        // 1. Verificar se categoria existe
        Optional<Categoria> categoriaOpt = categoriaRepository.findById(id);
        if (categoriaOpt.isEmpty()) {
            throw new RuntimeException("Categoria não encontrada!");
        }

        // 2. Verificar se categoria tem livros associados
        Categoria categoria = categoriaOpt.get();
        if (!categoria.getLivros().isEmpty()) {
            throw new RuntimeException("Não é possível deletar categoria com livros associados!");
        }

        // 3. Deletar
        categoriaRepository.deleteById(id);
    }
}
