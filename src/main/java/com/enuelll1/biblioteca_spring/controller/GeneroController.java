package com.enuelll1.biblioteca_spring.controller;

import com.enuelll1.biblioteca_spring.dto.GeneroDTO;
import com.enuelll1.biblioteca_spring.service.GeneroService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/generos")
@CrossOrigin(origins = "*")
public class GeneroController {

    private final GeneroService generoService;

    public GeneroController(GeneroService generoService) {
        this.generoService = generoService;
    }

    // ========================================
    // CRIAR GÊNERO
    // ========================================
    @PostMapping
    public ResponseEntity<Object> criar(@RequestBody GeneroDTO generoDTO) {
        try {
            GeneroDTO genero = generoService.criar(generoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(genero);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========================================
    // LISTAR TODOS OS GÊNEROS
    // ========================================
    @GetMapping
    public ResponseEntity<List<GeneroDTO>> listar() {
        try {
            List<GeneroDTO> generos = generoService.listar();
            return ResponseEntity.ok(generos);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ========================================
    // BUSCAR GÊNERO POR ID
    // ========================================
    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        try {
            GeneroDTO genero = generoService.buscarPorId(id);
            return ResponseEntity.ok(genero);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========================================
    // DELETAR GÊNERO
    // ========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletar(@PathVariable Long id) {
        try {
            generoService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
