package com.enuelll1.biblioteca_spring.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
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

    // Definindo a data de emprestimo
    @NotNull(message = "Data de emprestimo vazio")
    @Column(name = "dataEmprestimo", nullable = false)
    private LocalDate dataEmprestimo;

    // Definindo a data de entrega do livro esperada
    @NotNull(message = "Data de devolução vazio")
    @Column(name = "dataDevolucao", nullable = false)
    private LocalDate dataDevolucao;

    @Column(name = "dataDevolvido")
    private LocalDate dataDevolvido;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusEmprestimo status = StatusEmprestimo.ATIVO;

    // Definindo o livro que está sendo emprestado
    @ManyToOne
    @JoinColumn(name = "livro_id")
    private ModelBiblioteca livro;

    // Definindo o usuario que está fazendo o emprestimo
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private ModelUsuario usuario;

    // Criar enum:
    public enum StatusEmprestimo {
        ATIVO,
        DEVOLVIDO,
        ATRASADO
    }

    public ModelEmprestimos() {
        this.dataEmprestimo = LocalDate.now();
        this.dataDevolucao = LocalDate.now().plusDays(7);
    }
}
