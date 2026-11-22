package com.enuelll1.biblioteca_spring.service;

import com.enuelll1.biblioteca_spring.dto.CriarLivroDTO;
import com.enuelll1.biblioteca_spring.dto.LivroDTO;
import com.enuelll1.biblioteca_spring.exception.EntityAlreadyExistsException;
import com.enuelll1.biblioteca_spring.exception.EntityNotFoundException;
import com.enuelll1.biblioteca_spring.model.ModelAutor;
import com.enuelll1.biblioteca_spring.model.ModelBiblioteca;
import com.enuelll1.biblioteca_spring.repository.AutorRepository;
import com.enuelll1.biblioteca_spring.repository.CategoriaRepository;
import com.enuelll1.biblioteca_spring.repository.GeneroRepository;
import com.enuelll1.biblioteca_spring.repository.LivroRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LivroServiceTest {

    @Mock
    private LivroRepository livroRepository;

    @Mock
    private AutorRepository autorRepository;

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private GeneroRepository generoRepository;

    @InjectMocks
    private LivroService livroService;

    @Test
    @DisplayName("Deve criar livro com sucesso quando ISBN é inédito e autor existe")
    void deveCriarLivroComSucesso() {
        CriarLivroDTO dto = new CriarLivroDTO(
                "Clean Code", "Prentice Hall", 2008,
                "Boas práticas de código", "9780132350884", true,
                1L, Set.of(), Set.of()
        );

        ModelAutor autor = new ModelAutor();
        autor.setIdAutor(1L);
        autor.setAutorLivro("Robert Martin");
        autor.setAutorNacionalidade("Americano");

        when(livroRepository.existsByIsbnLivro("9780132350884")).thenReturn(false);
        when(autorRepository.findById(1L)).thenReturn(Optional.of(autor));
        when(livroRepository.save(any(ModelBiblioteca.class))).thenAnswer(inv -> {
            ModelBiblioteca salvo = inv.getArgument(0);
            salvo.setIdLivro(10L);
            return salvo;
        });

        LivroDTO resultado = livroService.criar(dto);

        assertNotNull(resultado);
        assertEquals(10L, resultado.getIdLivro());
        assertEquals("Clean Code", resultado.getTituloLivro());
        assertEquals("Robert Martin", resultado.getAutorLivro());
    }

    @Test
    @DisplayName("Deve lançar EntityAlreadyExistsException quando ISBN já existir")
    void deveLancarExcecaoQuandoIsbnDuplicado() {
        CriarLivroDTO dto = new CriarLivroDTO(
                "Clean Code", "Prentice Hall", 2008,
                "Boas práticas", "9780132350884", true,
                1L, Set.of(), Set.of()
        );

        when(livroRepository.existsByIsbnLivro("9780132350884")).thenReturn(true);

        assertThrows(EntityAlreadyExistsException.class, () -> livroService.criar(dto));
        verify(livroRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar EntityNotFoundException ao buscar livro inexistente")
    void deveLancarExcecaoAoBuscarPorIdInexistente() {
        when(livroRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> livroService.buscarPorId(99L));
    }

    @Test
    @DisplayName("Deve lançar EntityNotFoundException ao deletar livro inexistente")
    void deveLancarExcecaoAoDeletarInexistente() {
        when(livroRepository.existsById(99L)).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () -> livroService.deletar(99L));
        verify(livroRepository, never()).deleteById(any());
    }
}
