package com.example.clinica.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_tutores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tutor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String telefone;
    private String email;

    @Column(unique = true)
    private String cpf;

    @ManyToOne
    @JoinColumn(name = "clinica_id")
    private Clinica clinica;

    @OneToMany(mappedBy = "tutor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"tutor", "veterinario", "clinica"})
    private List<Paciente> pets = new ArrayList<>();
}