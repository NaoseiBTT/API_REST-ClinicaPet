package com.example.clinica.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dono {

    private String nomeDono;
    private String telefoneDono;
    private String cpfDono;
}