package com.enuelll1.biblioteca_spring.service;

import com.enuelll1.biblioteca_spring.dto.AutorDTO;
import com.enuelll1.biblioteca_spring.exception.BibliotecaException;
import com.enuelll1.biblioteca_spring.exception.EntityAlreadyExistsException;
import com.enuelll1.biblioteca_spring.exception.EntityNotFoundException;
import com.enuelll1.biblioteca_spring.model.ModelAutor;
import com.enuelll1.biblioteca_spring.repository.AutorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AutorService {

    private final AutorRepository autorRepository;

    public AutorService(AutorRepository autorRepository) {
        this.autorRepository = autorRepository;
    }

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
    public AutorDTO criar(AutorDTO autorDTO) {
        // 1. Validar se nome já existe
        if (autorRepository.existsByAutorLivro(autorDTO.getAutorLivro())) {
            throw new EntityAlreadyExistsException("Autor", "nome", autorDTO.getAutorLivro());
        }

        // 2. Criar entidade
        ModelAutor autor = new ModelAutor();
        autor.setAutorLivro(autorDTO.getAutorLivro());
        autor.setAutorNacionalidade(autorDTO.getAutorNacionalidade());

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
                .toList();
    }

    // ========================================
    // BUSCAR POR ID
    // ========================================
    public AutorDTO buscarPorId(Long id) {
        Optional<ModelAutor> autorOpt = autorRepository.findById(id);
        if (autorOpt.isEmpty()) {
            throw new EntityNotFoundException("Autor", id);
        }
        return converterParaDTO(autorOpt.get());
    }

    // ========================================
    // BUSCAR POR NOME
    // ========================================
    public List<AutorDTO> buscarPorNome(String nome) {
        return autorRepository.findByAutorLivroContaining(nome).stream()
                .map(this::converterParaDTO)
                .toList();
    }

    // ========================================
    // DELETAR AUTOR
    // ========================================
    public void deletar(Long id) {
        // 1. Verificar se autor existe
        Optional<ModelAutor> autorOpt = autorRepository.findById(id);
        if (autorOpt.isEmpty()) {
            throw new EntityNotFoundException("Autor", id);
        }

        // 2. Verificar se autor tem livros associados
        ModelAutor autor = autorOpt.get();
        if (!autor.getLivros().isEmpty()) {
            throw new BibliotecaException("Não é possível deletar autor com livros associados!");
        }

        // 3. Deletar
        autorRepository.deleteById(id);
    }
}
