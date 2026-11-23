package com.enuelll1.biblioteca_spring.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CriarEmprestimoDTO {
    @NotNull(message = "O ID do livro é obrigatório")
    private Long livroId;

    @NotNull(message = "O ID do usuário é obrigatório")
    private Long usuarioId;
}
