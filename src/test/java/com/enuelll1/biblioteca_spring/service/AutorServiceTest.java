package com.enuelll1.biblioteca_spring.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.enuelll1.biblioteca_spring.dto.AutorDTO;
import com.enuelll1.biblioteca_spring.exception.BibliotecaException;
import com.enuelll1.biblioteca_spring.exception.EntityAlreadyExistsException;
import com.enuelll1.biblioteca_spring.model.ModelAutor;
import com.enuelll1.biblioteca_spring.model.ModelBiblioteca;
import com.enuelll1.biblioteca_spring.repository.AutorRepository;

@ExtendWith(MockitoExtension.class)
public class AutorServiceTest {

    @Mock
    private AutorRepository autorRepository;

    @InjectMocks
    private AutorService autorService;

    @Test
    @DisplayName("Teste pra criar um autor com sucesso")
    void deveCriarAutorComSucesso() {

        ModelAutor autor = new ModelAutor();
        autor.setAutorLivro("Emanuel");
        autor.setAutorNacionalidade("Brasileiro");
        autor.setIdAutor(1L);

        AutorDTO dto = new AutorDTO(null, "Emanuel", "Brasileiro");

        // Ver se o autor já existe
        when(autorRepository.existsByAutorLivro("Emanuel")).thenReturn(false);
        when(autorRepository.save(any(ModelAutor.class))).thenReturn(autor);

        // 3. Salvar
        AutorDTO salvo = autorService.criar(dto);

        assertNotNull(salvo);
        assertEquals("Emanuel", salvo.getAutorLivro());
        assertEquals(1L, salvo.getIdAutor());

    }

    @Test
    @DisplayName("Teste pra lançar a exceção  de autor duplicado")
    void deveLancarExcecaoAoCriarAutorDuplicado() {

        ModelAutor autor = new ModelAutor();
        autor.setAutorLivro("Emanuel");
        autor.setAutorNacionalidade("Brasileiro");
        autor.setIdAutor(1L);

        AutorDTO dto = new AutorDTO(null, "Emanuel", "Brasileiro");

        when(autorRepository.existsByAutorLivro("Emanuel")).thenReturn(true);

        assertThrows(EntityAlreadyExistsException.class, () -> autorService.criar(dto));

        verify(autorRepository, never()).save(any());

    }

    @Test
    @DisplayName("Teste pra lancar excessão se tentar deletar autor com livro")
    void deveLancarExcecaoAoDeletarAutorComLivros() {

        ModelAutor autor = new ModelAutor();
        autor.setAutorLivro("Emanuel");
        autor.setAutorNacionalidade("Brasileiro");
        autor.setIdAutor(1L);

        autor.getLivros().add(new ModelBiblioteca());
        when(autorRepository.findById(1L)).thenReturn(Optional.of(autor));

        assertThrows(BibliotecaException.class, () -> autorService.deletar(1L));
        verify(autorRepository, never()).deleteById(any());

    }

}
