package com.example.clinica.service;

import com.example.clinica.model.Clinica;
import com.example.clinica.model.Paciente;
import com.example.clinica.model.Tutor;
import com.example.clinica.model.Veterinario;
import com.example.clinica.repository.ClinicaRepository;
import com.example.clinica.repository.PacienteRepository;
import com.example.clinica.repository.TutorRepository;
import com.example.clinica.repository.VeterinarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final ClinicaRepository clinicaRepository;
    private final VeterinarioRepository veterinarioRepository;
    private final TutorRepository tutorRepository;

    public PacienteService(PacienteRepository pacienteRepository,
                           ClinicaRepository clinicaRepository,
                           VeterinarioRepository veterinarioRepository,
                           TutorRepository tutorRepository) {
        this.pacienteRepository = pacienteRepository;
        this.clinicaRepository = clinicaRepository;
        this.veterinarioRepository = veterinarioRepository;
        this.tutorRepository = tutorRepository;
    }

    @Transactional
    public Paciente salvar(Paciente paciente) {
        validarEAssociarRelacionamentos(paciente);
        return pacienteRepository.save(paciente);
    }

    public List<Paciente> listarTodos() {
        return pacienteRepository.findAll();
    }

    public Optional<Paciente> buscarPorId(Long id) {
        return pacienteRepository.findById(id);
    }

    public List<Paciente> buscarPorClinica(Long clinicaId) {
        return pacienteRepository.findByClinicaId(clinicaId);
    }

    public List<Paciente> buscarPorVeterinario(Long veterinarioId) {
        return pacienteRepository.findByVeterinarioId(veterinarioId);
    }

    public List<Paciente> buscarPorTutor(Long tutorId) {
        return pacienteRepository.findByTutorId(tutorId);
    }

    @Transactional
    public Paciente atualizar(Long id, Paciente pacienteAtualizado) {
        return pacienteRepository.findById(id).map(paciente -> {
            paciente.setNome(pacienteAtualizado.getNome());
            paciente.setEspecie(pacienteAtualizado.getEspecie());
            paciente.setRaca(pacienteAtualizado.getRaca());
            paciente.setIdade(pacienteAtualizado.getIdade());
            paciente.setPeso(pacienteAtualizado.getPeso());

            paciente.setClinica(pacienteAtualizado.getClinica());
            paciente.setVeterinario(pacienteAtualizado.getVeterinario());
            paciente.setTutor(pacienteAtualizado.getTutor());

            validarEAssociarRelacionamentos(paciente);

            return pacienteRepository.save(paciente);
        }).orElseThrow(() -> new RuntimeException("Paciente não encontrado com id: " + id));
    }

    @Transactional
    public void deletar(Long id) {
        if (pacienteRepository.existsById(id)) {
            pacienteRepository.deleteById(id);
        } else {
            throw new RuntimeException("Paciente não encontrado com id: " + id);
        }
    }

    private void validarEAssociarRelacionamentos(Paciente paciente) {
        if (paciente.getClinica() != null && paciente.getClinica().getId() != null) {
            Clinica clinica = clinicaRepository.findById(paciente.getClinica().getId())
                    .orElseThrow(() -> new RuntimeException("Clínica não encontrada com id: " + paciente.getClinica().getId()));
            paciente.setClinica(clinica);
        }

        if (paciente.getTutor() != null && paciente.getTutor().getId() != null) {
            Tutor tutor = tutorRepository.findById(paciente.getTutor().getId())
                    .orElseThrow(() -> new RuntimeException("Tutor não encontrado com id: " + paciente.getTutor().getId()));

            if (paciente.getClinica() != null && tutor.getClinica() != null) {
                boolean mesmaClinica = tutor.getClinica().getId().equals(paciente.getClinica().getId());
                if (!mesmaClinica) {
                    throw new RuntimeException("O tutor informado não pertence à mesma clínica selecionada para o paciente.");
                }
            }

            paciente.setTutor(tutor);
        } else {
            paciente.setTutor(null);
        }

        if (paciente.getVeterinario() != null && paciente.getVeterinario().getId() != null) {
            Veterinario vet = veterinarioRepository.findById(paciente.getVeterinario().getId())
                    .orElseThrow(() -> new RuntimeException("Veterinário não encontrado com id: " + paciente.getVeterinario().getId()));

            if (paciente.getClinica() != null) {
                boolean pertenceAClinica = vet.getClinicas().stream()
                        .anyMatch(c -> c.getId().equals(paciente.getClinica().getId()));

                if (!pertenceAClinica) {
                    throw new RuntimeException("O veterinário informado não atende na clínica selecionada.");
                }
            }

            paciente.setVeterinario(vet);
        }
    }
}