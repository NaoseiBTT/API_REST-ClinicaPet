package com.example.clinica.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.clinica.model.Clinica;
import com.example.clinica.repository.ClinicaRepository;

@Service
public class ClinicaService {

    @Autowired
    private ClinicaRepository clinicaRepository;

    public Clinica salvar(Clinica clinica) {
        return clinicaRepository.save(clinica);
    }

    public List<Clinica> listarTodas() {
        return clinicaRepository.findAll();
    }

    public Optional<Clinica> buscarPorId(Long id) {
        return clinicaRepository.findById(id);
    }

    public Clinica atualizar(Long id, Clinica clinicaAtualizada) {
        return clinicaRepository.findById(id).map(clinica -> {
            clinica.setNome(clinicaAtualizada.getNome());
            clinica.setTelefone(clinicaAtualizada.getTelefone());
            clinica.setEndereco(clinicaAtualizada.getEndereco());
            return clinicaRepository.save(clinica);
        }).orElseThrow(() -> new RuntimeException("Clínica não encontrada com o ID: " + id));
    }

    public void deletar(Long id) {
    if (!clinicaRepository.existsById(id)) {
        throw new org.springframework.web.server.ResponseStatusException(
            org.springframework.http.HttpStatus.NOT_FOUND, 
            "Clínica não encontrada com o ID: " + id
        );
    }
    clinicaRepository.deleteById(id);
}
}