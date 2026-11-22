package com.enuelll1.biblioteca_spring.controller;

import com.enuelll1.biblioteca_spring.dto.GeneroDTO;
import com.enuelll1.biblioteca_spring.service.GeneroService;
import jakarta.validation.Valid;
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
    public ResponseEntity<GeneroDTO> criar(@Valid @RequestBody GeneroDTO generoDTO) {
        GeneroDTO genero = generoService.criar(generoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(genero);
    }

    // ========================================
    // LISTAR TODOS OS GÊNEROS
    // ========================================
    @GetMapping
    public ResponseEntity<List<GeneroDTO>> listar() {
        return ResponseEntity.ok(generoService.listar());
    }

    // ========================================
    // BUSCAR GÊNERO POR ID
    // ========================================
    @GetMapping("/{id}")
    public ResponseEntity<GeneroDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(generoService.buscarPorId(id));
    }

    // ========================================
    // DELETAR GÊNERO
    // ========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        generoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
