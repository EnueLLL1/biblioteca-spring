package com.enuelll1.biblioteca_spring.controller;

import com.enuelll1.biblioteca_spring.dto.AutorDTO;
import com.enuelll1.biblioteca_spring.service.AutorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/autores")
@CrossOrigin(origins = "*")
public class AutorController {

    private final AutorService autorService;

    public AutorController(AutorService autorService) {
        this.autorService = autorService;
    }

    // ========================================
    // CRIAR AUTOR
    // ========================================
    @PostMapping
    public ResponseEntity<Object> criar(@RequestBody AutorDTO autorDTO) {
        try {
            AutorDTO autor = autorService.criar(autorDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(autor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========================================
    // LISTAR TODOS OS AUTORES
    // ========================================
    @GetMapping
    public ResponseEntity<List<AutorDTO>> listar() {
        try {
            List<AutorDTO> autores = autorService.listar();
            return ResponseEntity.ok(autores);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ========================================
    // BUSCAR AUTOR POR ID
    // ========================================
    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        try {
            AutorDTO autor = autorService.buscarPorId(id);
            return ResponseEntity.ok(autor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========================================
    // BUSCAR AUTORES POR NOME
    // ========================================
    @GetMapping("/buscar")
    public ResponseEntity<List<AutorDTO>> buscarPorNome(@RequestParam String nome) {
        try {
            List<AutorDTO> autores = autorService.buscarPorNome(nome);
            return ResponseEntity.ok(autores);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ========================================
    // DELETAR AUTOR
    // ========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletar(@PathVariable Long id) {
        try {
            autorService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
