package com.enuelll1.biblioteca_spring.service;

import com.enuelll1.biblioteca_spring.dto.GeneroDTO;
import com.enuelll1.biblioteca_spring.model.Genero;
import com.enuelll1.biblioteca_spring.repository.GeneroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GeneroService {

    @Autowired
    private GeneroRepository generoRepository;

    // ========================================
    // CONVERTER ENTITY → DTO
    // ========================================
    public GeneroDTO converterParaDTO(Genero genero) {
        return new GeneroDTO(
                genero.getIdGenero(),
                genero.getNomeGenero()
        );
    }

    // ========================================
    // CRIAR GÊNERO
    // ========================================
    public GeneroDTO criar(String nome) {
        // 1. Validar se nome já existe
        if (generoRepository.existsByNomeGenero(nome)) {
            throw new RuntimeException("Gênero já cadastrado!");
        }

        // 2. Criar entidade
        Genero genero = new Genero();
        genero.setNomeGenero(nome);

        // 3. Salvar
        Genero salvo = generoRepository.save(genero);

        // 4. Retornar DTO
        return converterParaDTO(salvo);
    }

    // ========================================
    // LISTAR TODOS
    // ========================================
    public List<GeneroDTO> listar() {
        return generoRepository.findAll().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // ========================================
    // BUSCAR POR ID
    // ========================================
    public GeneroDTO buscarPorId(Long id) {
        Optional<Genero> generoOpt = generoRepository.findById(id);
        if (generoOpt.isEmpty()) {
            throw new RuntimeException("Gênero não encontrado!");
        }
        return converterParaDTO(generoOpt.get());
    }

    // ========================================
    // DELETAR GÊNERO
    // ========================================
    public void deletar(Long id) {
        // 1. Verificar se gênero existe
        Optional<Genero> generoOpt = generoRepository.findById(id);
        if (generoOpt.isEmpty()) {
            throw new RuntimeException("Gênero não encontrado!");
        }

        // 2. Verificar se gênero tem livros associados
        Genero genero = generoOpt.get();
        if (!genero.getLivros().isEmpty()) {
            throw new RuntimeException("Não é possível deletar gênero com livros associados!");
        }

        // 3. Deletar
        generoRepository.deleteById(id);
    }
}
