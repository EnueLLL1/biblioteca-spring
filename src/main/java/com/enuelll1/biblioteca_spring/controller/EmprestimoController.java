package com.enuelll1.biblioteca_spring.controller;

import com.enuelll1.biblioteca_spring.dto.CriarEmprestimoDTO;
import com.enuelll1.biblioteca_spring.dto.EmprestimoDTO;
import com.enuelll1.biblioteca_spring.service.EmprestimoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<EmprestimoDTO> criar(@Valid @RequestBody CriarEmprestimoDTO dados) {
        EmprestimoDTO emprestimo = emprestimoService.criarEmprestimo(dados.getLivroId(), dados.getUsuarioId());
        return ResponseEntity.status(HttpStatus.CREATED).body(emprestimo);
    }

    // ========================================
    // DEVOLVER LIVRO
    // ========================================
    @PostMapping("/{id}/devolver")
    public ResponseEntity<EmprestimoDTO> devolverLivro(@PathVariable Long id) {
        return ResponseEntity.ok(emprestimoService.devolverLivro(id));
    }

    // ========================================
    // LISTAR EMPRÉSTIMOS ATIVOS
    // ========================================
    @GetMapping("/ativos")
    public ResponseEntity<List<EmprestimoDTO>> listarAtivos() {
        return ResponseEntity.ok(emprestimoService.listarEmprestimosAtivos());
    }

    // ========================================
    // LISTAR EMPRÉSTIMOS ATRASADOS
    // ========================================
    @GetMapping("/atrasados")
    public ResponseEntity<List<EmprestimoDTO>> listarAtrasados() {
        return ResponseEntity.ok(emprestimoService.listarEmprestimosAtrasados());
    }

    // ========================================
    // LISTAR EMPRÉSTIMOS POR USUÁRIO
    // ========================================
    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<EmprestimoDTO>> listarPorUsuario(@PathVariable Long id) {
        return ResponseEntity.ok(emprestimoService.listarPorUsuario(id));
    }
}
