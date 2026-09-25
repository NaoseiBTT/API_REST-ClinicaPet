package com.example.clinica.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_pacientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String especie;
    private String raca;
    private Integer idade;
    private Double peso;

    @ManyToOne
    @JsonIgnoreProperties({"pets", "clinica"})
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;

    @ManyToOne
    @JoinColumn(name = "clinica_id")
    private Clinica clinica;

    @ManyToOne
    @JsonIgnoreProperties("clinicas")
    @JoinColumn(name = "veterinario_id")
    private Veterinario veterinario;
}