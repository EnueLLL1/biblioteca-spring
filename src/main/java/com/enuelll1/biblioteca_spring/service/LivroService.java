package com.enuelll1.biblioteca_spring.service;

import com.enuelll1.biblioteca_spring.dto.LivroDTO;
import com.enuelll1.biblioteca_spring.dto.CriarLivroDTO;
import com.enuelll1.biblioteca_spring.model.*;
import com.enuelll1.biblioteca_spring.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class LivroService {

    @Autowired
    private LivroRepository livroRepository;

    @Autowired
    private AutorRepository autorRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private GeneroRepository generoRepository;

    // ========================================
    // CONVERTER ENTITY → DTO
    // ========================================
    public LivroDTO converterParaDTO(ModelBiblioteca livro) {
        // Pegar nomes das categorias
        Set<String> categoriasNomes = livro.getCategorias().stream()
                .map(Categoria::getNomeCategoria)
                .collect(Collectors.toSet());

        // Pegar nomes dos gêneros
        Set<String> generosNomes = livro.getGeneros().stream()
                .map(Genero::getNomeGenero)
                .collect(Collectors.toSet());

        return new LivroDTO(
                livro.getIdLivro(),
                livro.getTituloLivro(),
                livro.getEditoraLivro(),
                livro.getAnoPublicado(),
                livro.getDescricaoLivro(),
                livro.getIsbnLivro(),
                livro.isDisponivel(),
                livro.getAutor().getAutorLivro(),
                livro.getAutor().getAutorNacionalidade(),
                categoriasNomes,
                generosNomes);
    }

    // ========================================
    // CRIAR LIVRO
    // ========================================
    public LivroDTO criar(CriarLivroDTO dto) {
        // 1. Validar se ISBN já existe
        if (livroRepository.existsByIsbnLivro(dto.getIsbnLivro())) {
            throw new RuntimeException("ISBN já cadastrado!");
        }

        // 2. Buscar autor
        ModelAutor autor = autorRepository.findById(dto.getIdAutor())
                .orElseThrow(() -> new RuntimeException("Autor não encontrado!"));

        // 3. Criar entidade
        ModelBiblioteca livro = new ModelBiblioteca();
        livro.setTituloLivro(dto.getTituloLivro());
        livro.setEditoraLivro(dto.getEditoraLivro());
        livro.setAnoPublicado(dto.getAnoPublicado());
        livro.setDescricaoLivro(dto.getDescricaoLivro());
        livro.setIsbnLivro(dto.getIsbnLivro());
        livro.setDisponivel(dto.isDisponivel());
        livro.setAutor(autor);

        // 4. Adicionar categorias (se houver)
        if (dto.getIdCategorias() != null && !dto.getIdCategorias().isEmpty()) {
            Set<Categoria> categorias = dto.getIdCategorias().stream()
                    .map(id -> categoriaRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Categoria não encontrada: " + id)))
                    .collect(Collectors.toSet());
            livro.setCategorias(categorias);
        }

        // 5. Adicionar gêneros (se houver)
        if (dto.getIdGeneros() != null && !dto.getIdGeneros().isEmpty()) {
            Set<Genero> generos = dto.getIdGeneros().stream()
                    .map(id -> generoRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Gênero não encontrado: " + id)))
                    .collect(Collectors.toSet());
            livro.setGeneros(generos);
        }

        // 6. Salvar
        ModelBiblioteca salvo = livroRepository.save(livro);

        // 7. Retornar DTO
        return converterParaDTO(salvo);
    }

    // ========================================
    // LISTAR TODOS
    // ========================================
    public List<LivroDTO> listarTodos() {
        return livroRepository.findAll().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // ========================================
    // BUSCAR POR ID
    // ========================================
    public LivroDTO buscarPorId(Long id) {
        ModelBiblioteca livro = livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado!"));
        return converterParaDTO(livro);
    }

    // ========================================
    // BUSCAR POR TÍTULO
    // ========================================
    public List<LivroDTO> buscarPorTitulo(String titulo) {
        return livroRepository.findByTituloLivroContaining(titulo).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // ========================================
    // BUSCAR DISPONÍVEIS
    // ========================================
    public List<LivroDTO> buscarDisponiveis() {
        return livroRepository.findByDisponivel(true).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // ========================================
    // DELETAR
    // ========================================
    public void deletar(Long id) {
        if (!livroRepository.existsById(id)) {
            throw new RuntimeException("Livro não encontrado!");
        }
        livroRepository.deleteById(id);
    }

    // ========================================
    // ATUALIZAR LIVRO
    // ========================================
    public LivroDTO atualizar(Long id, CriarLivroDTO dto) {
        // 1. Buscar livro existente
        ModelBiblioteca livro = livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado!"));

        // 2. Validar ISBN se foi alterado
        if (!livro.getIsbnLivro().equals(dto.getIsbnLivro()) &&
            livroRepository.existsByIsbnLivro(dto.getIsbnLivro())) {
            throw new RuntimeException("ISBN já cadastrado!");
        }

        // 3. Buscar autor se foi alterado
        if (!livro.getAutor().getIdAutor().equals(dto.getIdAutor())) {
            ModelAutor autor = autorRepository.findById(dto.getIdAutor())
                    .orElseThrow(() -> new RuntimeException("Autor não encontrado!"));
            livro.setAutor(autor);
        }

        // 4. Atualizar campos
        livro.setTituloLivro(dto.getTituloLivro());
        livro.setEditoraLivro(dto.getEditoraLivro());
        livro.setAnoPublicado(dto.getAnoPublicado());
        livro.setDescricaoLivro(dto.getDescricaoLivro());
        livro.setIsbnLivro(dto.getIsbnLivro());
        livro.setDisponivel(dto.isDisponivel());

        // 5. Atualizar categorias
        if (dto.getIdCategorias() != null) {
            Set<Categoria> categorias = dto.getIdCategorias().stream()
                    .map(catId -> categoriaRepository.findById(catId)
                            .orElseThrow(() -> new RuntimeException("Categoria não encontrada: " + catId)))
                    .collect(Collectors.toSet());
            livro.setCategorias(categorias);
        }

        // 6. Atualizar gêneros
        if (dto.getIdGeneros() != null) {
            Set<Genero> generos = dto.getIdGeneros().stream()
                    .map(genId -> generoRepository.findById(genId)
                            .orElseThrow(() -> new RuntimeException("Gênero não encontrado: " + genId)))
                    .collect(Collectors.toSet());
            livro.setGeneros(generos);
        }

        // 7. Salvar e retornar
        ModelBiblioteca salvo = livroRepository.save(livro);
        return converterParaDTO(salvo);
    }

    // ========================================
    // BUSCAR POR AUTOR
    // ========================================
    public List<LivroDTO> buscarPorAutor(Long idAutor) {
        // Verificar se autor existe
        if (!autorRepository.existsById(idAutor)) {
            throw new RuntimeException("Autor não encontrado!");
        }

        return livroRepository.findByAutorIdAutor(idAutor).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // ========================================
    // BUSCAR POR CATEGORIA
    // ========================================
    public List<LivroDTO> buscarPorCategoria(Long idCategoria) {
        // Verificar se categoria existe
        if (!categoriaRepository.existsById(idCategoria)) {
            throw new RuntimeException("Categoria não encontrada!");
        }

        return livroRepository.findByCategoriasIdCategoria(idCategoria).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // ========================================
    // BUSCAR POR GÊNERO
    // ========================================
    public List<LivroDTO> buscarPorGenero(Long idGenero) {
        // Verificar se gênero existe
        if (!generoRepository.existsById(idGenero)) {
            throw new RuntimeException("Gênero não encontrado!");
        }

        return livroRepository.findByGenerosIdGenero(idGenero).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }
}
