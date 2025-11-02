package com.enuelll1.biblioteca_spring.service;

import com.enuelll1.biblioteca_spring.dto.EmprestimoDTO;
import com.enuelll1.biblioteca_spring.model.ModelBiblioteca;
import com.enuelll1.biblioteca_spring.model.ModelEmprestimos;
import com.enuelll1.biblioteca_spring.model.Usuario;
import com.enuelll1.biblioteca_spring.repository.EmprestimoRepository;
import com.enuelll1.biblioteca_spring.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmprestimoService {

    @Autowired
    private EmprestimoRepository emprestimoRepository;

    @Autowired
    private LivroRepository livroRepository;

    // ========================================
    // CONVERTER ENTITY → DTO
    // ========================================
    public EmprestimoDTO converterParaDTO(ModelEmprestimos emprestimo) {
        return new EmprestimoDTO(
                emprestimo.getIdEmprestimo(),
                emprestimo.getDataEmprestimo(),
                emprestimo.getDataDevolucao(),
                emprestimo.getDataDevolvido(),
                emprestimo.getStatus().toString(),
                emprestimo.getLivro().getTituloLivro(),
                emprestimo.getLivro().getIsbnLivro(),
                emprestimo.getUsuario().getNome(),
                emprestimo.getUsuario().getEmail()
        );
    }

    // ========================================
    // CRIAR EMPRÉSTIMO
    // ========================================
    @Transactional
    public EmprestimoDTO criarEmprestimo(Long livroId, Long usuarioId) {
        // 1. Validar se livro existe
        Optional<ModelBiblioteca> livroOpt = livroRepository.findById(livroId);
        if (livroOpt.isEmpty()) {
            throw new RuntimeException("Livro não encontrado!");
        }

        ModelBiblioteca livro = livroOpt.get();

        // 2. Verificar se livro está disponível
        if (!livro.isDisponivel()) {
            throw new RuntimeException("Livro não está disponível para empréstimo!");
        }

        // 3. Criar usuário mock (já que não temos repository de usuário)
        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);
        usuario.setNome("Usuário " + usuarioId);
        usuario.setEmail("usuario" + usuarioId + "@email.com");

        // 4. Criar empréstimo
        ModelEmprestimos emprestimo = new ModelEmprestimos();
        emprestimo.setLivro(livro);
        emprestimo.setUsuario(usuario);

        // 5. Salvar empréstimo
        ModelEmprestimos salvo = emprestimoRepository.save(emprestimo);

        // 6. Marcar livro como indisponível
        livro.setDisponivel(false);
        livroRepository.save(livro);

        return converterParaDTO(salvo);
    }

    // ========================================
    // DEVOLVER LIVRO
    // ========================================
    @Transactional
    public EmprestimoDTO devolverLivro(Long emprestimoId) {
        // 1. Buscar empréstimo
        Optional<ModelEmprestimos> emprestimoOpt = emprestimoRepository.findById(emprestimoId);
        if (emprestimoOpt.isEmpty()) {
            throw new RuntimeException("Empréstimo não encontrado!");
        }

        ModelEmprestimos emprestimo = emprestimoOpt.get();

        // 2. Verificar se já foi devolvido
        if (emprestimo.getStatus() == ModelEmprestimos.StatusEmprestimo.DEVOLVIDO) {
            throw new RuntimeException("Livro já foi devolvido!");
        }

        // 3. Atualizar status e data
        emprestimo.setStatus(ModelEmprestimos.StatusEmprestimo.DEVOLVIDO);
        emprestimo.setDataDevolvido(LocalDate.now());

        // 4. Salvar empréstimo
        ModelEmprestimos salvo = emprestimoRepository.save(emprestimo);

        // 5. Marcar livro como disponível
        ModelBiblioteca livro = emprestimo.getLivro();
        livro.setDisponivel(true);
        livroRepository.save(livro);

        return converterParaDTO(salvo);
    }

    // ========================================
    // LISTAR EMPRÉSTIMOS ATIVOS
    // ========================================
    public List<EmprestimoDTO> listarEmprestimosAtivos() {
        return emprestimoRepository.findByStatus(ModelEmprestimos.StatusEmprestimo.ATIVO)
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // ========================================
    // LISTAR EMPRÉSTIMOS ATRASADOS
    // ========================================
    public List<EmprestimoDTO> listarEmprestimosAtrasados() {
        return emprestimoRepository.findEmprestimosAtrasados()
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // ========================================
    // LISTAR POR USUÁRIO
    // ========================================
    public List<EmprestimoDTO> listarPorUsuario(Long usuarioId) {
        return emprestimoRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }
}
