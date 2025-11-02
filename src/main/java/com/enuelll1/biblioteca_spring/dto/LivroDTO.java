package com.enuelll1.biblioteca_spring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LivroDTO {
    private Long idLivro;
    private String tituloLivro;
    private String editoraLivro;
    private int anoPublicado;
    private String descricaoLivro;
    private String isbnLivro;
    private boolean disponivel;
    private String autorLivro;
    private String autorNacionalidade;
    private Set<String> categorias;
    private Set<String> generos;
}
