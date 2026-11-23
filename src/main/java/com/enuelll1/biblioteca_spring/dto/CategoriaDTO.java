package com.enuelll1.biblioteca_spring.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaDTO {
    private Long idCategoria;

    @NotBlank(message = "O nome da categoria não pode estar em branco")
    private String nomeCategoria;
}
