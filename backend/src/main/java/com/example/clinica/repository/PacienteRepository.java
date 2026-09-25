package com.example.clinica.repository;

import com.example.clinica.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    List<Paciente> findByClinicaId(Long clinicaId);

    List<Paciente> findByVeterinarioId(Long veterinarioId);

    List<Paciente> findByTutorId(Long tutorId);
}