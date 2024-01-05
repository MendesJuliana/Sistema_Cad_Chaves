package com.example.controledechaves.controller;

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

import com.example.controledechaves.dtos.setor.SetorRequestDTO;
import com.example.controledechaves.dtos.setor.SetorResponseDTO;
import com.example.controledechaves.model.Setor;
import com.example.controledechaves.repositories.SetorRepository;

@RestController
@RequestMapping("/cadastro-de-setor")

public class SetorController {
    @Autowired
    private SetorRepository setorRepository;

    @PostMapping
    public Setor addSetor(@RequestBody SetorRequestDTO newLocalizacao) {
        Setor setor = new Setor(newLocalizacao);
        return setorRepository.save(setor);
    }

    @GetMapping
    public List<SetorResponseDTO> getAll() {
        List<SetorResponseDTO> setores = setorRepository.findAll().stream().map(SetorResponseDTO::new).toList();
        return setores;
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Object> deleteSetor(@PathVariable Long id) {
        try {
            Setor setorDeleltado = setorRepository.getReferenceById(id);
            setorRepository.delete(setorDeleltado);
            return ResponseEntity.ok("Setor deletado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao excluir setor, esse setor está associado a uma chave: " + e.getMessage());
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<String> updateSetor(@PathVariable Long id,
            @RequestBody SetorRequestDTO setorRequestDTO) {
        Setor setorEditado = setorRepository.getReferenceById(id);
        setorEditado.setNome(setorRequestDTO.nome());

        setorRepository.save(setorEditado);
        return ResponseEntity.ok("setor atualizado com sucesso");
    }
}