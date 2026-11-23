package com.enuelll1.biblioteca_spring.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AutorDTO {
    private Long idAutor;

    @NotBlank(message = "O nome do autor não pode estar em branco")
    private String autorLivro;

    private String autorNacionalidade;
}
