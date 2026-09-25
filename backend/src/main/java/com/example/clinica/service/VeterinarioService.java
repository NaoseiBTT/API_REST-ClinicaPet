package com.example.clinica.service;

import com.example.clinica.model.Clinica;
import com.example.clinica.model.Veterinario;
import com.example.clinica.repository.ClinicaRepository;
import com.example.clinica.repository.VeterinarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VeterinarioService {

    private final VeterinarioRepository veterinarioRepository;
    private final ClinicaRepository clinicaRepository;

    public VeterinarioService(VeterinarioRepository veterinarioRepository, ClinicaRepository clinicaRepository) {
        this.veterinarioRepository = veterinarioRepository;
        this.clinicaRepository = clinicaRepository;
    }

    @Transactional
    public Veterinario salvar(Veterinario veterinario) {
        if (veterinario.getClinicas() != null && !veterinario.getClinicas().isEmpty()) {
            List<Clinica> clinicasCarregadas = veterinario.getClinicas().stream()
                    .map(c -> clinicaRepository.findById(c.getId())
                            .orElseThrow(() -> new RuntimeException("Clínica não encontrada com id: " + c.getId())))
                    .toList();
            veterinario.setClinicas(clinicasCarregadas);
        }
        return veterinarioRepository.save(veterinario);
    }

    public List<Veterinario> listarTodos() {
        return veterinarioRepository.findAll();
    }

    public Optional<Veterinario> buscarPorId(Long id) {
        return veterinarioRepository.findById(id);
    }

    public List<Veterinario> buscarPorClinica(Long clinicaId) {
        return veterinarioRepository.findByClinicasId(clinicaId);
    }

    @Transactional
    public Veterinario atualizar(Long id, Veterinario vetAtualizado) {
        return veterinarioRepository.findById(id).map(vet -> {
            vet.setNome(vetAtualizado.getNome());
            vet.setCrmv(vetAtualizado.getCrmv());
            vet.setEspecialidade(vetAtualizado.getEspecialidade());
            vet.setTelefone(vetAtualizado.getTelefone());
            vet.setEmail(vetAtualizado.getEmail());

            if (vetAtualizado.getClinicas() != null) {

                vet.getClinicas().clear();

                if (!vetAtualizado.getClinicas().isEmpty()) {
                    List<Clinica> clinicasCarregadas = vetAtualizado.getClinicas().stream()
                            .map(c -> clinicaRepository.findById(c.getId())
                                    .orElseThrow(() -> new RuntimeException("Clínica não encontrada com id: " + c.getId())))
                            .toList();

                    vet.getClinicas().addAll(clinicasCarregadas);
                }
            }

            return veterinarioRepository.save(vet);
        }).orElseThrow(() -> new RuntimeException("Veterinário não encontrado com id: " + id));
    }

    @Transactional
    public void deletar(Long id) {
        if (veterinarioRepository.existsById(id)) {
            veterinarioRepository.deleteById(id);
        } else {
            throw new RuntimeException("Veterinário não encontrado com id: " + id);
        }
    }
}