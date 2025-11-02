package com.enuelll1.biblioteca_spring.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CriarLivroDTO {
    @NotBlank(message = "O título não pode estar em branco")
    private String tituloLivro;

    @NotBlank(message = "A editora não pode estar em branco")
    private String editoraLivro;

    @Min(value = 1000, message = "Ano deve ser maior que 1000")
    @Max(value = 2100, message = "Ano deve ser menor que 2100")
    private int anoPublicado;

    @NotBlank(message = "A descrição não pode estar em branco")
    private String descricaoLivro;

    @NotBlank(message = "O ISBN não pode estar em branco")
    private String isbnLivro;

    private boolean disponivel;

    @NotNull(message = "O ID do autor não pode ser nulo")
    private Long idAutor;

    private Set<Long> idCategorias;

    private Set<Long> idGeneros;
}
