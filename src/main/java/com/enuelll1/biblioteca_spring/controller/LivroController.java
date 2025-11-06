package com.enuelll1.biblioteca_spring.controller;

import com.enuelll1.biblioteca_spring.dto.LivroDTO;
import com.enuelll1.biblioteca_spring.dto.CriarLivroDTO;
import com.enuelll1.biblioteca_spring.service.LivroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/livros")
@CrossOrigin(origins = "*")
public class LivroController {
    
    @Autowired
    private LivroService livroService;
    
    // POST - Criar livro
    @PostMapping
    public ResponseEntity<LivroDTO> criar(@Valid @RequestBody CriarLivroDTO dto) {
        LivroDTO livro = livroService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(livro);
    }
    
    // GET - Listar todos
    @GetMapping
    public ResponseEntity<List<LivroDTO>> listar() {
        List<LivroDTO> livros = livroService.listarTodos();
        return ResponseEntity.ok(livros);
    }
    
    // GET - Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<LivroDTO> buscarPorId(@PathVariable Long id) {
        LivroDTO livro = livroService.buscarPorId(id);
        return ResponseEntity.ok(livro);
    }
    
    // GET - Buscar por título
    @GetMapping("/buscar")
    public ResponseEntity<List<LivroDTO>> buscarPorTitulo(@RequestParam String titulo) {
        List<LivroDTO> livros = livroService.buscarPorTitulo(titulo);
        return ResponseEntity.ok(livros);
    }
    
    // GET - Listar disponíveis
    @GetMapping("/disponiveis")
    public ResponseEntity<List<LivroDTO>> listarDisponiveis() {
        List<LivroDTO> livros = livroService.buscarDisponiveis();
        return ResponseEntity.ok(livros);
    }
    
    // GET - Buscar por autor
    @GetMapping("/autor/{idAutor}")
    public ResponseEntity<List<LivroDTO>> buscarPorAutor(@PathVariable Long idAutor) {
        List<LivroDTO> livros = livroService.buscarPorAutor(idAutor);
        return ResponseEntity.ok(livros);
    }
    
    // GET - Buscar por categoria
    @GetMapping("/categoria/{idCategoria}")
    public ResponseEntity<List<LivroDTO>> buscarPorCategoria(@PathVariable Long idCategoria) {
        List<LivroDTO> livros = livroService.buscarPorCategoria(idCategoria);
        return ResponseEntity.ok(livros);
    }
    
    // GET - Buscar por gênero
    @GetMapping("/genero/{idGenero}")
    public ResponseEntity<List<LivroDTO>> buscarPorGenero(@PathVariable Long idGenero) {
        List<LivroDTO> livros = livroService.buscarPorGenero(idGenero);
        return ResponseEntity.ok(livros);
    }
    
    // PUT - Atualizar
    @PutMapping("/{id}")
    public ResponseEntity<LivroDTO> atualizar(
        @PathVariable Long id,
        @Valid @RequestBody CriarLivroDTO dto
    ) {
        LivroDTO livro = livroService.atualizar(id, dto);
        return ResponseEntity.ok(livro);
    }
    
    // DELETE - Deletar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        livroService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}