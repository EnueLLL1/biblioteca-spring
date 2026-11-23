package com.enuelll1.biblioteca_spring.controller;

import com.enuelll1.biblioteca_spring.dto.CriarLivroDTO;
import com.enuelll1.biblioteca_spring.dto.LivroDTO;
import com.enuelll1.biblioteca_spring.exception.EntityAlreadyExistsException;
import com.enuelll1.biblioteca_spring.exception.EntityNotFoundException;
import com.enuelll1.biblioteca_spring.service.LivroService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LivroController.class)
class LivroControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private LivroService livroService;

    @Test
    @DisplayName("GET /api/livros deve retornar 200 e lista de livros")
    void deveListarLivros() throws Exception {
        LivroDTO livro = new LivroDTO(
                1L, "Clean Code", "Prentice Hall", 2008,
                "Boas práticas", "9780132350884", true,
                "Robert Martin", "Americano", Set.of(), Set.of()
        );

        when(livroService.listarTodos()).thenReturn(List.of(livro));

        mockMvc.perform(get("/api/livros"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].tituloLivro").value("Clean Code"))
                .andExpect(jsonPath("$[0].autorLivro").value("Robert Martin"));
    }

    @Test
    @DisplayName("GET /api/livros/{id} deve retornar 404 com ApiError quando não existir")
    void deveRetornar404QuandoLivroNaoEncontrado() throws Exception {
        when(livroService.buscarPorId(99L)).thenThrow(new EntityNotFoundException("Livro", 99L));

        mockMvc.perform(get("/api/livros/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Livro com ID 99 não encontrado!"));
    }

    @Test
    @DisplayName("POST /api/livros deve retornar 400 com fieldErrors quando payload for inválido")
    void deveRetornar400QuandoPayloadInvalido() throws Exception {
        CriarLivroDTO invalido = new CriarLivroDTO(
                "", "", 500, "", "", true, null, Set.of(), Set.of()
        );

        mockMvc.perform(post("/api/livros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalido)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fieldErrors.tituloLivro").exists())
                .andExpect(jsonPath("$.fieldErrors.idAutor").exists());
    }

    @Test
    @DisplayName("POST /api/livros deve retornar 409 quando ISBN já existir")
    void deveRetornar409QuandoIsbnDuplicado() throws Exception {
        CriarLivroDTO dto = new CriarLivroDTO(
                "Clean Code", "Prentice Hall", 2008,
                "Boas práticas", "9780132350884", true,
                1L, Set.of(), Set.of()
        );

        when(livroService.criar(any(CriarLivroDTO.class)))
                .thenThrow(new EntityAlreadyExistsException("Livro", "ISBN", "9780132350884"));

        mockMvc.perform(post("/api/livros")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }
}
