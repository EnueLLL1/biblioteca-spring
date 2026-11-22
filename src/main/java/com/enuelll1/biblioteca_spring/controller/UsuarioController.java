package com.enuelll1.biblioteca_spring.controller;

import com.enuelll1.biblioteca_spring.dto.UsuarioDTO;
import com.enuelll1.biblioteca_spring.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // ========================================
    // CRIAR USUARIO
    // ========================================
    @PostMapping
    public ResponseEntity<UsuarioDTO> criar(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        UsuarioDTO usuario = usuarioService.criar(usuarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    // ========================================
    // LISTAR TODOS OS USUARIOS
    // ========================================
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listar() {
        return ResponseEntity.ok(usuarioService.listar());
    }

    // ========================================
    // BUSCAR USUARIO POR ID
    // ========================================
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    // ========================================
    // BUSCAR USUARIOS POR NOME
    // ========================================
    @GetMapping("/buscar")
    public ResponseEntity<List<UsuarioDTO>> buscarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(usuarioService.buscarPorNome(nome));
    }

    // ========================================
    // BUSCAR USUARIO POR EMAIL
    // ========================================
    @GetMapping("/email")
    public ResponseEntity<UsuarioDTO> buscarPorEmail(@RequestParam String email) {
        return ResponseEntity.ok(usuarioService.buscarPorEmail(email));
    }

    // ========================================
    // DELETAR USUARIO
    // ========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
