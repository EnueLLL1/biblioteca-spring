package com.enuelll1.biblioteca_spring.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

// Definindo a coluna categoriaLivro da tabela "livros_db"
// Definindo que ela pode ter uma ou mais categorias com 100 Char, e não pode
// ser NULO nem Vazio

@Getter
@Setter
@Entity
@Table(name = "categoria_bd")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCategoria;

    @NotBlank(message = "O nome da Categoria não pode estar em branco")
    @Column(name = "nomeCategoria", length = 100, nullable = false, unique = true)
    private String nomeCategoria;

    // Relação inversa com livros
    @ManyToMany(mappedBy = "categoria")
    private Set<ModelBiblioteca> livros = new HashSet<>();
    
    public Categoria(){
    // Tem que ser um construtor vazio para o JPA Funcionar
    }
}
