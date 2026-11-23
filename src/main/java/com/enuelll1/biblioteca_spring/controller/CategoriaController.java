package com.enuelll1.biblioteca_spring.controller;

import com.enuelll1.biblioteca_spring.dto.CategoriaDTO;
import com.enuelll1.biblioteca_spring.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    // ========================================
    // CRIAR CATEGORIA
    // ========================================
    @PostMapping
    public ResponseEntity<CategoriaDTO> criar(@Valid @RequestBody CategoriaDTO categoriaDTO) {
        CategoriaDTO categoria = categoriaService.criar(categoriaDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoria);
    }

    // ========================================
    // LISTAR TODAS AS CATEGORIAS
    // ========================================
    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> listar() {
        return ResponseEntity.ok(categoriaService.listar());
    }

    // ========================================
    // BUSCAR CATEGORIA POR ID
    // ========================================
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.buscarPorId(id));
    }

    // ========================================
    // DELETAR CATEGORIA
    // ========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        categoriaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
