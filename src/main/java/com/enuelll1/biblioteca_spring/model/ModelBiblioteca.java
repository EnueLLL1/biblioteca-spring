package com.enuelll1.biblioteca_spring.model;

import java.util.HashSet;
import java.util.Set;
import org.hibernate.validator.constraints.ISBN;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "livros_bd")
public class ModelBiblioteca {

    // Definindo o id, sendo autoincrementado e tbm sendo unico
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLivro;


    // Definindo a coluna tituloLivro da tabela "livros_db"
    // Definindo que ela pode ter um titulo de 200 Char, e não pode ser NULO nem Vazio.
    @NotBlank(message = "O titulo não pode estar em branco")
    @Column(name = "tituloLivro", length = 200, nullable = false)
    private String tituloLivro;


    // Definindo a coluna editoraLivro da tabela "livros_db"
    // Definindo que ela pode ter o nome da editora de 100 Char, e não pode ser NULO nem Vazio.
    @NotBlank(message = "A editora não pode estar em branco")
    @Column(name = "editoraLivro", length = 100, nullable = false)
    private String editoraLivro;


    // Definindo a coluna anoPublicado da tabela "livros_db"
    // Definindo que ela pode ter o ano publicado com 4 int, e não pode ser NULO nem Vazio.
    @NotBlank(message = "O ano publicado não pode estar em branco")
    @Column(name = "anoPublicado", length = 4, nullable = false)
    private int anoPublicado;


    // Definindo a coluna descricaoLivro da tabela "livros_db"
    // Definindo que ela pode ter uma descrição com 500 Char, e não pode ser NULO nem Vazio
    @NotBlank(message = "A descrição não pode estar em branco")
    @Column(name = "descricaoLivro", nullable = false, length = 500)
    private String descricaoLivro;

    
    // Definindo a coluna isbnLivro da tabela "livros_db"
    // Definindo que ela pode ter um ISBN com 20 Char, e não pode ser NULO nem Vazio
    @ISBN
    @NotBlank(message = "O ISBN não pode estar em branco")
    @Column(name = "isbn", unique = true, length = 20, nullable = false)
    private String isbnLivro;


    // Definindo a relação com o autor de que Um Autor pode ter Muitos Livros
    @ManyToOne
    @JoinColumn(
        name = "idAutor"
    )
    // COMO UM LIVRO PODE TER APENAS UM AUTOR, TEM QUE SER UTILIZADO ESTE TIPO DE RELACIONAMENTO
    private ModelAutor autor;

    // Definindo uma Relação de Muitos pra Muitos
    @ManyToMany
    @JoinTable(
        name = "livro_categoria", 
        joinColumns = @JoinColumn (name = "idLivro"), 
        inverseJoinColumns = @JoinColumn (name = "idCategoria")
    )
    private Set<Categoria> categoria = new HashSet<>();


    // Definindo uma Relação de Muitos pra Muitos
    @ManyToMany
    @JoinTable(
        name = "livro_genero", 
        joinColumns = @JoinColumn (name = "idLivro"), 
        inverseJoinColumns = @JoinColumn (name = "idGenero")
    )
    private Set<Genero> generos = new HashSet<>();

    public ModelBiblioteca() {
    // Tem que ser um construtor vazio para o JPA Funcionar
    }
}
