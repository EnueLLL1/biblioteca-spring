package com.enuelll1.biblioteca_spring.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "autor_bd")
public class ModelAutor {

     // Definindo o id, sendo autoincrementado e tbm sendo unico
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAutor;

    // Definindo a coluna autorLivro da tabela "livros_db"
    // Definindo que ela pode ter um nome de autor de 100 Char, e não pode ser NULO nem Vazio.
    @NotBlank(message = "O autor não pode estar em branco")
    @Column(name = "autorLivro", length = 100, nullable = false)
    private String autorLivro;

    // Definindo a coluna autorNacionalidade da tabela "livros_db"
    // Definindo que ela pode ter um nome de autor de 100 Char, e não pode ser NULO nem Vazio.
    @NotBlank(message = "A nacionalidade do = autor não pode estar em branco")
    @Column(name = "autorNacionalidade", length = 100, nullable = false)
    private String autorNacionalidade;

    @OneToMany(mappedBy = "autor")
    private Set<ModelBiblioteca> livros = new HashSet<>();

    public ModelAutor(){
        // Tem que ser um construtor vazio para o JPA Funcionar
    }
}
