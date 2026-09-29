package com.example.clinica.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.example.clinica.model.Tutor;
import com.example.clinica.service.TutorService;


@RestController
@RequestMapping("/api/tutores")
public class TutorController {

    @Autowired
    private TutorService tutorService;

    @PostMapping
    public ResponseEntity<Tutor> cadastrar(@RequestBody Tutor tutor) {
        Tutor novoTutor = tutorService.salvar(tutor);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoTutor);
    }

    @GetMapping
    public ResponseEntity<List<Tutor>> listar() {
        return ResponseEntity.ok(tutorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tutor> buscarPorId(@PathVariable Long id) {
        return tutorService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/clinica/{clinicaId}")
    public ResponseEntity<List<Tutor>> buscarPorClinica(@PathVariable Long clinicaId) {
        return ResponseEntity.ok(tutorService.buscarPorClinica(clinicaId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tutor> atualizar(@PathVariable Long id, @RequestBody Tutor tutor) {
        try {
            Tutor tutorAtualizado = tutorService.atualizar(id, tutor);
            return ResponseEntity.ok(tutorAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        try {
            tutorService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}