package com.enuelll1.biblioteca_spring.controller;

import com.enuelll1.biblioteca_spring.dto.EmprestimoDTO;
import com.enuelll1.biblioteca_spring.service.EmprestimoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emprestimos")
@CrossOrigin(origins = "*")
public class EmprestimoController {

    private final EmprestimoService emprestimoService;

    public EmprestimoController(EmprestimoService emprestimoService) {
        this.emprestimoService = emprestimoService;
    }

    // ========================================
    // CRIAR EMPRÉSTIMO
    // ========================================
    @PostMapping
    public ResponseEntity<Object> criar(@RequestBody Map<String, Long> dados) {
        try {
            EmprestimoDTO emprestimo = emprestimoService.criarEmprestimo(dados.get("livroId"), dados.get("usuarioId"));
            return ResponseEntity.status(HttpStatus.CREATED).body(emprestimo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========================================
    // DEVOLVER LIVRO
    // ========================================
    @PostMapping("/{id}/devolver")
    public ResponseEntity<Object> devolverLivro(@PathVariable Long id) {
        try {
            EmprestimoDTO emprestimo = emprestimoService.devolverLivro(id);
            return ResponseEntity.ok(emprestimo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========================================
    // LISTAR EMPRÉSTIMOS ATIVOS
    // ========================================
    @GetMapping("/ativos")
    public ResponseEntity<List<EmprestimoDTO>> listarAtivos() {
        try {
            List<EmprestimoDTO> emprestimos = emprestimoService.listarEmprestimosAtivos();
            return ResponseEntity.ok(emprestimos);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ========================================
    // LISTAR EMPRÉSTIMOS ATRASADOS
    // ========================================
    @GetMapping("/atrasados")
    public ResponseEntity<List<EmprestimoDTO>> listarAtrasados() {
        try {
            List<EmprestimoDTO> emprestimos = emprestimoService.listarEmprestimosAtrasados();
            return ResponseEntity.ok(emprestimos);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ========================================
    // LISTAR EMPRÉSTIMOS POR USUÁRIO
    // ========================================
    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<EmprestimoDTO>> listarPorUsuario(@PathVariable Long id) {
        try {
            List<EmprestimoDTO> emprestimos = emprestimoService.listarPorUsuario(id);
            return ResponseEntity.ok(emprestimos);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
