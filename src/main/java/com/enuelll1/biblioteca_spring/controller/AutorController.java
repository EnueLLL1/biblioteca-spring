package com.enuelll1.biblioteca_spring.controller;

import com.enuelll1.biblioteca_spring.dto.AutorDTO;
import com.enuelll1.biblioteca_spring.service.AutorService;
import jakarta.validation.Valid;
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
    public ResponseEntity<AutorDTO> criar(@Valid @RequestBody AutorDTO autorDTO) {
        AutorDTO autor = autorService.criar(autorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(autor);
    }

    // ========================================
    // LISTAR TODOS OS AUTORES
    // ========================================
    @GetMapping
    public ResponseEntity<List<AutorDTO>> listar() {
        return ResponseEntity.ok(autorService.listar());
    }

    // ========================================
    // BUSCAR AUTOR POR ID
    // ========================================
    @GetMapping("/{id}")
    public ResponseEntity<AutorDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(autorService.buscarPorId(id));
    }

    // ========================================
    // BUSCAR AUTORES POR NOME
    // ========================================
    @GetMapping("/buscar")
    public ResponseEntity<List<AutorDTO>> buscarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(autorService.buscarPorNome(nome));
    }

    // ========================================
    // DELETAR AUTOR
    // ========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        autorService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
