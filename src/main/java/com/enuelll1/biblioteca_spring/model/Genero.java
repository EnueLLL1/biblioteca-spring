package com.enuelll1.biblioteca_spring.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import java.util.HashSet;
import java.util.Set;

// Definindo a coluna generoLivro da tabela "livros_db"
// Definindo que ela pode ter um ou mais generos com 50 Char, e não pode ser NULO nem Vazio.
@Getter
@Setter
@Entity
@Table(name = "generos_bd")
public class Genero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idGenero;

    @NotBlank(message = "O nome do gênero não pode estar em branco")
    @Column(name = "nomeGenero", length = 50, nullable = false, unique = true)
    private String nomeGenero;

    // Relação inversa com livros
    @ManyToMany(mappedBy = "generos")
    private Set<ModelBiblioteca> livros = new HashSet<>();

    public Genero() {
        // Tem que ser um construtor vazio para o JPA Funcionar
    }
}

