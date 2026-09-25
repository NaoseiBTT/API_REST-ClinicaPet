package com.example.clinica.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "tb_veterinarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Veterinario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String crmv;

    private String especialidade;
    private String telefone;
    private String email;

    @ManyToMany
    @JoinTable(
            name = "tb_veterinario_clinica",
            joinColumns = @JoinColumn(name = "veterinario_id"),
            inverseJoinColumns = @JoinColumn(name = "clinica_id")
    )
    private List<Clinica> clinicas;
}