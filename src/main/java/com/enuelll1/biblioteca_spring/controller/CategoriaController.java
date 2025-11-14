package com.enuelll1.biblioteca_spring.controller;

import com.enuelll1.biblioteca_spring.dto.CategoriaDTO;
import com.enuelll1.biblioteca_spring.service.CategoriaService;
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
    public ResponseEntity<Object> criar(@RequestBody CategoriaDTO categoriaDTO) {
        try {
            CategoriaDTO categoria = categoriaService.criar(categoriaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(categoria);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========================================
    // LISTAR TODAS AS CATEGORIAS
    // ========================================
    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> listar() {
        try {
            List<CategoriaDTO> categorias = categoriaService.listar();
            return ResponseEntity.ok(categorias);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ========================================
    // BUSCAR CATEGORIA POR ID
    // ========================================
    @GetMapping("/{id}")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        try {
            CategoriaDTO categoria = categoriaService.buscarPorId(id);
            return ResponseEntity.ok(categoria);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========================================
    // DELETAR CATEGORIA
    // ========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletar(@PathVariable Long id) {
        try {
            categoriaService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
