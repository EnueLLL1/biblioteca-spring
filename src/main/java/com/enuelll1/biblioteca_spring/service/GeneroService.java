package com.enuelll1.biblioteca_spring.service;

import com.enuelll1.biblioteca_spring.dto.GeneroDTO;
import com.enuelll1.biblioteca_spring.exception.BibliotecaException;
import com.enuelll1.biblioteca_spring.exception.EntityAlreadyExistsException;
import com.enuelll1.biblioteca_spring.exception.EntityNotFoundException;
import com.enuelll1.biblioteca_spring.model.Genero;
import com.enuelll1.biblioteca_spring.repository.GeneroRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GeneroService {

    private final GeneroRepository generoRepository;

    public GeneroService(GeneroRepository generoRepository) {
        this.generoRepository = generoRepository;
    }

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
    public GeneroDTO criar(GeneroDTO generoDTO) {
        // 1. Validar se nome já existe
        if (generoRepository.existsByNomeGenero(generoDTO.getNomeGenero())) {
            throw new EntityAlreadyExistsException("Gênero", "nome", generoDTO.getNomeGenero());
        }

        // 2. Criar entidade
        Genero genero = new Genero();
        genero.setNomeGenero(generoDTO.getNomeGenero());

        // 3. Salvar
        Genero salvo = generoRepository.save(genero);

        // 4. Retornar DTO
        return converterParaDTO(salvo);
    }

    // ========================================
    // LISTAR TODOS OS GÊNEROS
    // ========================================
    public List<GeneroDTO> listar() {
        return generoRepository.findAll().stream()
                .map(this::converterParaDTO)
                .toList();
    }

    // ========================================
    // BUSCAR POR ID
    // ========================================
    public GeneroDTO buscarPorId(Long id) {
        Optional<Genero> generoOpt = generoRepository.findById(id);
        if (generoOpt.isEmpty()) {
            throw new EntityNotFoundException("Gênero", id);
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
            throw new EntityNotFoundException("Gênero", id);
        }

        // 2. Verificar se gênero tem livros associados
        Genero genero = generoOpt.get();
        if (!genero.getLivros().isEmpty()) {
            throw new BibliotecaException("Não é possível deletar gênero com livros associados!");
        }

        // 3. Deletar
        generoRepository.deleteById(id);
    }
}
