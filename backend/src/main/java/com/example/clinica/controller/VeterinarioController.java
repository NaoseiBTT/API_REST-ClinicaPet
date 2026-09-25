package com.example.clinica.controller;

import com.example.clinica.model.Veterinario;
import com.example.clinica.service.VeterinarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
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