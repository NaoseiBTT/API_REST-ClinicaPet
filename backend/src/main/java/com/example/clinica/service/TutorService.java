package com.example.clinica.service;

import com.example.clinica.model.Clinica;
import com.example.clinica.model.Tutor;
import com.example.clinica.repository.ClinicaRepository;
import com.example.clinica.repository.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TutorService {

    @Autowired
    private TutorRepository tutorRepository;

    @Autowired
    private ClinicaRepository clinicaRepository;

    public Tutor salvar(Tutor tutor) {

        if (tutor.getClinica() != null && tutor.getClinica().getId() != null) {
            Clinica clinicaCompleta = clinicaRepository.findById(tutor.getClinica().getId())
                    .orElseThrow(() -> new RuntimeException("Clínica não encontrada com id: " + tutor.getClinica().getId()));


            tutor.setClinica(clinicaCompleta);
        }

        return tutorRepository.save(tutor);
    }

    public List<Tutor> listarTodos() {
        return tutorRepository.findAll();
    }

    public Optional<Tutor> buscarPorId(Long id) {
        return tutorRepository.findById(id);
    }

    public List<Tutor> buscarPorClinica(Long clinicaId) {
        return tutorRepository.findByClinicaId(clinicaId);
    }

    public Tutor atualizar(Long id, Tutor tutorAtualizado) {
        return tutorRepository.findById(id).map(tutor -> {
            tutor.setNome(tutorAtualizado.getNome());
            tutor.setTelefone(tutorAtualizado.getTelefone());
            tutor.setEmail(tutorAtualizado.getEmail());
            tutor.setCpf(tutorAtualizado.getCpf());

            if (tutorAtualizado.getClinica() != null && tutorAtualizado.getClinica().getId() != null) {
                Clinica clinicaCompleta = clinicaRepository.findById(tutorAtualizado.getClinica().getId())
                        .orElseThrow(() -> new RuntimeException("Clínica não encontrada com id: " + tutorAtualizado.getClinica().getId()));
                tutor.setClinica(clinicaCompleta);
            }

            return tutorRepository.save(tutor);
        }).orElseThrow(() -> new RuntimeException("Tutor não encontrado com id: " + id));
    }

    public void deletar(Long id) {
        if (tutorRepository.existsById(id)) {
            tutorRepository.deleteById(id);
        } else {
            throw new RuntimeException("Tutor não encontrado com id: " + id);
        }
    }
}