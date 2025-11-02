package com.enuelll1.biblioteca_spring.service;

import com.enuelll1.biblioteca_spring.dto.AutorDTO;
import com.enuelll1.biblioteca_spring.model.ModelAutor;
import com.enuelll1.biblioteca_spring.repository.AutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AutorService {

    @Autowired
    private AutorRepository autorRepository;

    // ========================================
    // CONVERTER ENTITY → DTO
    // ========================================
    public AutorDTO converterParaDTO(ModelAutor autor) {
        return new AutorDTO(
                autor.getIdAutor(),
                autor.getAutorLivro(),
                autor.getAutorNacionalidade()
        );
    }

    // ========================================
    // CRIAR AUTOR
    // ========================================
    public AutorDTO criar(String nome, String nacionalidade) {
        // 1. Validar se nome já existe
        if (autorRepository.existsByAutorLivro(nome)) {
            throw new RuntimeException("Autor já cadastrado!");
        }

        // 2. Criar entidade
        ModelAutor autor = new ModelAutor();
        autor.setAutorLivro(nome);
        autor.setAutorNacionalidade(nacionalidade);

        // 3. Salvar
        ModelAutor salvo = autorRepository.save(autor);

        // 4. Retornar DTO
        return converterParaDTO(salvo);
    }

    // ========================================
    // LISTAR TODOS OS LIVROS
    // ========================================
    public List<AutorDTO> listar() {
        return autorRepository.findAll().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // ========================================
    // BUSCAR POR ID
    // ========================================
    public AutorDTO buscarPorId(Long id) {
        Optional<ModelAutor> autorOpt = autorRepository.findById(id);
        if (autorOpt.isEmpty()) {
            throw new RuntimeException("Autor não encontrado!");
        }
        return converterParaDTO(autorOpt.get());
    }

    // ========================================
    // BUSCAR POR NOME
    // ========================================
    public List<AutorDTO> buscarPorNome(String nome) {
        return autorRepository.findByAutorLivroContaining(nome).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // ========================================
    // DELETAR AUTOR
    // ========================================
    public void deletar(Long id) {
        // 1. Verificar se autor existe
        Optional<ModelAutor> autorOpt = autorRepository.findById(id);
        if (autorOpt.isEmpty()) {
            throw new RuntimeException("Autor não encontrado!");
        }

        // 2. Verificar se autor tem livros associados
        ModelAutor autor = autorOpt.get();
        if (!autor.getLivros().isEmpty()) {
            throw new RuntimeException("Não é possível deletar autor com livros associados!");
        }

        // 3. Deletar
        autorRepository.deleteById(id);
    }
}
