package com.example.clinica.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.clinica.model.Veterinario;
import com.example.clinica.service.VeterinarioService;

@RestController
@RequestMapping("/api/veterinarios")
public class VeterinarioController {

    private final VeterinarioService veterinarioService;

    public VeterinarioController(VeterinarioService veterinarioService) {
        this.veterinarioService = veterinarioService;
    }

    @PostMapping
    public ResponseEntity<Veterinario> cadastrar(@RequestBody Veterinario veterinario) {
        Veterinario novoVet = veterinarioService.salvar(veterinario);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoVet);
    }

    @GetMapping
    public ResponseEntity<List<Veterinario>> listar() {
        return ResponseEntity.ok(veterinarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Veterinario> buscarPorId(@PathVariable Long id) {
        return veterinarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/clinica/{clinicaId}")
    public ResponseEntity<List<Veterinario>> buscarPorClinica(@PathVariable Long clinicaId) {
        return ResponseEntity.ok(veterinarioService.buscarPorClinica(clinicaId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Veterinario> atualizar(@PathVariable Long id, @RequestBody Veterinario veterinario) {
        try {
            Veterinario vetAtualizado = veterinarioService.atualizar(id, veterinario);
            return ResponseEntity.ok(vetAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        try {
            veterinarioService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}