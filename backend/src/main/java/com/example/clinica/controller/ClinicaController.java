package com.example.clinica.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.clinica.model.Clinica;
import com.example.clinica.service.ClinicaService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/clinicas")
public class ClinicaController {

    @Autowired
    private ClinicaService clinicaService;

    @PostMapping
    public ResponseEntity<Clinica> cadastrar(@RequestBody Clinica clinica) {
        Clinica novaClinica = clinicaService.salvar(clinica);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaClinica);
    }

    @GetMapping
    public ResponseEntity<List<Clinica>> listar() {
        return ResponseEntity.ok(clinicaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Clinica> buscarPorId(@PathVariable Long id) {
        return clinicaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Clinica> atualizar(@PathVariable Long id, @RequestBody Clinica clinica) {
        try {
            Clinica clinicaAtualizada = clinicaService.atualizar(id, clinica);
            return ResponseEntity.ok(clinicaAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        try {
            clinicaService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}