package com.example.clinica.service;

import com.example.clinica.model.Clinica;
import com.example.clinica.model.Veterinario;
import com.example.clinica.repository.ClinicaRepository;
import com.example.clinica.repository.VeterinarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
            List<Clinica> clinicasCarregadas = carregarClinicas(veterinario.getClinicas());
            veterinario.setClinicas(clinicasCarregadas);
        } else {
            veterinario.setClinicas(new ArrayList<>());
        }
        return veterinarioRepository.save(veterinario);
    }

    @Transactional(readOnly = true)
    public List<Veterinario> listarTodos() {
        return veterinarioRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Veterinario> buscarPorId(Long id) {
        return veterinarioRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Veterinario> buscarPorClinica(Long clinicaId) {
        return veterinarioRepository.findByClinicasId(clinicaId);
    }

    @Transactional
    public Veterinario atualizar(Long id, Veterinario vetAtualizado) {
        Veterinario vet = veterinarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Veterinário não encontrado com id: " + id));

        vet.setNome(vetAtualizado.getNome());
        vet.setCrmv(vetAtualizado.getCrmv());
        vet.setEspecialidade(vetAtualizado.getEspecialidade());
        vet.setTelefone(vetAtualizado.getTelefone());
        vet.setEmail(vetAtualizado.getEmail());

        if (vetAtualizado.getClinicas() != null) {
            // Limpa a coleção gerenciada pelo Hibernate e adiciona as novas referências
            vet.getClinicas().clear();

            if (!vetAtualizado.getClinicas().isEmpty()) {
                List<Clinica> clinicasCarregadas = carregarClinicas(vetAtualizado.getClinicas());
                vet.getClinicas().addAll(clinicasCarregadas);
            }
        }

        return veterinarioRepository.save(vet);
    }

    @Transactional
    public void deletar(Long id) {
        if (!veterinarioRepository.existsById(id)) {
            throw new RuntimeException("Veterinário não encontrado com id: " + id);
        }
        veterinarioRepository.deleteById(id);
    }

    /**
     * Otimiza a busca das clínicas utilizando findAllById para evitar N+1 queries.
     */
    private List<Clinica> carregarClinicas(List<Clinica> clinicas) {
        List<Long> ids = clinicas.stream()
                .map(Clinica::getId)
                .toList();

        List<Clinica> clinicasEncontradas = clinicaRepository.findAllById(ids);

        if (clinicasEncontradas.size() != ids.size()) {
            throw new RuntimeException("Uma ou mais clínicas informadas não foram encontradas no banco de dados.");
        }

        return clinicasEncontradas;
    }
}