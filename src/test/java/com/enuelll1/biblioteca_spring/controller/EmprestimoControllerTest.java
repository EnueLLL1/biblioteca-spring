package com.enuelll1.biblioteca_spring.controller;

import static org.mockito.Mockito.when;

import java.time.LocalDate;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.enuelll1.biblioteca_spring.dto.CriarEmprestimoDTO;
import com.enuelll1.biblioteca_spring.dto.EmprestimoDTO;
import com.enuelll1.biblioteca_spring.exception.BibliotecaException;
import com.enuelll1.biblioteca_spring.service.EmprestimoService;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.http.MediaType;

@WebMvcTest(EmprestimoController.class)
class EmprestimoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private EmprestimoService emprestimoService;

    @Test
    @DisplayName("POST /api/emprestimos válido (201 Created)")
    void testCriarEmprestimoValido() throws Exception {
        CriarEmprestimoDTO emprestimo = new CriarEmprestimoDTO(1L, 2L);

        EmprestimoDTO empestimoDTO = new EmprestimoDTO(
                10L,
                LocalDate.now(),
                LocalDate.now().plusDays(7),
                null,
                "ATIVO",
                "CLEAR CODE",
                "9780132350884",
                "Emanuel",
                "emanuel@email.com");

        when(emprestimoService.criarEmprestimo(1L, 2L)).thenReturn(empestimoDTO);

        mockMvc.perform(post("/api/emprestimos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emprestimo)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.tituloLivro").value("CLEAR CODE"));

    }

    @Test
    @DisplayName("POST /api/emprestimos @Valid com IDs nulos (400 Bad Request)")
    void testCriarEmprestimoComIDsNulos() throws Exception {
        CriarEmprestimoDTO emprestimoInvalido = new CriarEmprestimoDTO(null, null);

        mockMvc.perform(post("/api/emprestimos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emprestimoInvalido)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fieldErrors.livroId").exists())
                .andExpect(jsonPath("$.fieldErrors.usuarioId").exists());
    }

    @Test
    @DisplayName("Regra de negócio POST /api/emprestimos lançando BibliotecaException (400 Bad Request)")
    void testCriarEmprestimoLancandoBibliotecaExcetion() throws Exception {
        CriarEmprestimoDTO emprestimo = new CriarEmprestimoDTO(1L, 2L);

        when(emprestimoService.criarEmprestimo(1L, 2L)).thenThrow(new BibliotecaException("Livro Indisponivel"));

        mockMvc.perform(post("/api/emprestimos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emprestimo)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Livro Indisponivel"));
    }

    @Test
    @DisplayName("Devolver livro POST /api/emprestimos/10/devolver (200 OK)")
    void testDevolverEmprestimo() throws Exception {

        EmprestimoDTO empestimoDTO = new EmprestimoDTO(
                10L,
                LocalDate.now(),
                LocalDate.now().plusDays(7),
                null,
                "DEVOLVIDO",
                "CLEAR CODE",
                "9780132350884",
                "Emanuel",
                "emanuel@email.com");

        when(emprestimoService.devolverLivro(10L)).thenReturn(empestimoDTO);

        mockMvc.perform(post("/api/emprestimos/10/devolver"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DEVOLVIDO"));
    }
}