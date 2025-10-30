package com.enuelll1.biblioteca_spring.model;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "emprestimos_bd")
public class ModelEmprestimos {


    // Definindo o id, sendo autoincrementado e tbm sendo unico
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEmprestimo;


    // Definindo o livro que está sendo emprestado
    @ManyToOne
    @JoinColumn(name= "livro_id")
    private ModelBiblioteca livro;


    // Definindo o nome do usuario que está fazendo o emprestimo
    @NotBlank(message = "Nome de Usuario vazio")
    @Column(name = "nomeUsuario", unique = true, nullable = false)
    private String nomeUsuario;
    
    
    // Definindo a data de emprestimo 
    @NotBlank(message = "Data de emprestimo vazio")
    @Column(name = "dataEmprestimo", nullable = false)
    private Date dataEmprestimo;
    

    // Definindo a data de entrega do livro esperada
    @NotBlank(message = "Data de devolução vazio")
    @Column(name = "dataDevolucao", nullable = false)
    private Date dataDevolucao;

    ModelEmprestimos(){
        // Tem que ser um construtor vazio para o JPA Funcionar

        this.dataEmprestimo = new Date(System.currentTimeMillis());
        this.dataDevolucao = new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000);
        
    }
}