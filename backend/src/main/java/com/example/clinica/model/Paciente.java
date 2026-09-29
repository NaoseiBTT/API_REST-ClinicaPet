package com.example.clinica.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
    @JsonIgnoreProperties({"pets", "clinica", "hibernateLazyInitializer", "handler"})
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;

    @ManyToOne
    @JsonIgnoreProperties({"pacientes", "veterinarios", "tutores", "hibernateLazyInitializer", "handler"})
    @JoinColumn(name = "clinica_id")
    private Clinica clinica;

    @ManyToOne
    @JsonIgnoreProperties({"clinicas", "pacientes", "hibernateLazyInitializer", "handler"})
    @JoinColumn(name = "veterinario_id")
    private Veterinario veterinario;
}