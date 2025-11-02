package com.enuelll1.biblioteca_spring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AutorDTO {
    private Long idAutor;
    private String autorLivro;
    private String autorNacionalidade;
}
