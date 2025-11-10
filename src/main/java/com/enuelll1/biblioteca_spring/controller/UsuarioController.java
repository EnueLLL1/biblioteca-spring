package com.enuelll1.biblioteca_spring.controller;

import com.enuelll1.biblioteca_spring.dto.UsuarioDTO;
import com.enuelll1.biblioteca_spring.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // ========================================
    // CRIAR USUARIO
    // ========================================
    @PostMapping
    public ResponseEntity<?> criar(
        @RequestParam String nome,
        @RequestParam String email,
        @RequestParam String telefone
    ) {
        try {
            UsuarioDTO usuario = usuarioService.criar(nome, email, telefone);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========================================
    // LISTAR TODOS OS USUARIOS
    // ========================================
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listar() {
        try {
            List<UsuarioDTO> usuarios = usuarioService.listar();
            return ResponseEntity.ok(usuarios);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ========================================
    // BUSCAR USUARIO POR ID
    // ========================================
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            UsuarioDTO usuario = usuarioService.buscarPorId(id);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========================================
    // BUSCAR USUARIOS POR NOME
    // ========================================
    @GetMapping("/buscar")
    public ResponseEntity<List<UsuarioDTO>> buscarPorNome(@RequestParam String nome) {
        try {
            List<UsuarioDTO> usuarios = usuarioService.buscarPorNome(nome);
            return ResponseEntity.ok(usuarios);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ========================================
    // BUSCAR USUARIO POR EMAIL
    // ========================================
    @GetMapping("/email")
    public ResponseEntity<?> buscarPorEmail(@RequestParam String email) {
        try {
            UsuarioDTO usuario = usuarioService.buscarPorEmail(email);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========================================
    // DELETAR USUARIO
    // ========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            usuarioService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
