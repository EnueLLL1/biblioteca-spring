package com.enuelll1.biblioteca_spring.service;

import com.enuelll1.biblioteca_spring.dto.EmprestimoDTO;
import com.enuelll1.biblioteca_spring.exception.BibliotecaException;
import com.enuelll1.biblioteca_spring.exception.EntityNotFoundException;
import com.enuelll1.biblioteca_spring.model.ModelBiblioteca;
import com.enuelll1.biblioteca_spring.model.ModelEmprestimos;
import com.enuelll1.biblioteca_spring.model.ModelUsuario;
import com.enuelll1.biblioteca_spring.repository.EmprestimoRepository;
import com.enuelll1.biblioteca_spring.repository.LivroRepository;
import com.enuelll1.biblioteca_spring.repository.UsuarioRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmprestimoServiceTest {

    @Mock
    private EmprestimoRepository emprestimoRepository;

    @Mock
    private LivroRepository livroRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private EmprestimoService emprestimoService;

    @Test
    @DisplayName("Deve criar empréstimo e marcar livro como indisponível")
    void deveCriarEmprestimoComSucesso() {
        // Arrange (Preparação)
        ModelBiblioteca livro = new ModelBiblioteca();
        livro.setIdLivro(1L);
        livro.setTituloLivro("Clean Code");
        livro.setIsbnLivro("9780132350884");
        livro.setDisponivel(true);

        ModelUsuario usuario = new ModelUsuario();
        usuario.setId(2L);
        usuario.setNome("Emanuel");
        usuario.setEmail("emanuel@email.com");

        when(livroRepository.findById(1L)).thenReturn(Optional.of(livro));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(usuario));
        when(emprestimoRepository.save(any(ModelEmprestimos.class))).thenAnswer(inv -> {
            ModelEmprestimos emp = inv.getArgument(0);
            emp.setIdEmprestimo(10L);
            return emp;
        });

        // Act (Ação)
        EmprestimoDTO resultado = emprestimoService.criarEmprestimo(1L, 2L);

        // Assert (Verificação)
        assertNotNull(resultado);
        assertEquals(10L, resultado.getIdEmprestimo());
        assertEquals("Clean Code", resultado.getTituloLivro());
        assertEquals("Emanuel", resultado.getNomeUsuario());
        assertFalse(livro.isDisponivel());
        verify(livroRepository).save(livro);
    }

    @Test
    @DisplayName("Deve lançar EntityNotFoundException quando livro não existir")
    void deveLancarExcecaoQuandoLivroNaoEncontrado() {
        when(livroRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> emprestimoService.criarEmprestimo(99L, 2L));

        verify(emprestimoRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar BibliotecaException quando livro estiver indisponível")
    void deveLancarExcecaoQuandoLivroIndisponivel() {
        ModelBiblioteca livro = new ModelBiblioteca();
        livro.setIdLivro(1L);
        livro.setDisponivel(false);

        when(livroRepository.findById(1L)).thenReturn(Optional.of(livro));

        assertThrows(BibliotecaException.class,
                () -> emprestimoService.criarEmprestimo(1L, 2L));

        verify(emprestimoRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve devolver livro e marcá-lo como disponível novamente")
    void deveDevolverLivroComSucesso() {
        ModelBiblioteca livro = new ModelBiblioteca();
        livro.setIdLivro(1L);
        livro.setTituloLivro("Clean Code");
        livro.setIsbnLivro("9780132350884");
        livro.setDisponivel(false);

        ModelUsuario usuario = new ModelUsuario();
        usuario.setNome("Emanuel");
        usuario.setEmail("emanuel@email.com");

        ModelEmprestimos emprestimo = new ModelEmprestimos();
        emprestimo.setIdEmprestimo(10L);
        emprestimo.setLivro(livro);
        emprestimo.setUsuario(usuario);
        emprestimo.setStatus(ModelEmprestimos.StatusEmprestimo.ATIVO);

        when(emprestimoRepository.findById(10L)).thenReturn(Optional.of(emprestimo));
        when(emprestimoRepository.save(any(ModelEmprestimos.class))).thenAnswer(inv -> inv.getArgument(0));

        EmprestimoDTO resultado = emprestimoService.devolverLivro(10L);

        assertEquals("DEVOLVIDO", resultado.getStatus());
        assertNotNull(resultado.getDataDevolvido());
        assertTrue(livro.isDisponivel());
        verify(livroRepository).save(livro);
    }
}
