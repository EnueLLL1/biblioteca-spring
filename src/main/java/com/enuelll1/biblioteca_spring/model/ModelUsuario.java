package com.enuelll1.biblioteca_spring.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class ModelUsuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    private String email;
    private String telefone;
    
    @OneToMany(mappedBy = "usuario")
    private Set<ModelEmprestimos> emprestimos = new HashSet<>();

    public ModelUsuario(){
        // Construtor vazio
    }
}
