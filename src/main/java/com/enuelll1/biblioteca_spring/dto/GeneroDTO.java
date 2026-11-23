package com.enuelll1.biblioteca_spring.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeneroDTO {
    private Long idGenero;

    @NotBlank(message = "O nome do gênero não pode estar em branco")
    private String nomeGenero;
}
