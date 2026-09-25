package com.example.clinica.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.clinica.model.Clinica;

@Repository
public interface ClinicaRepository extends JpaRepository<Clinica, Long> {
}