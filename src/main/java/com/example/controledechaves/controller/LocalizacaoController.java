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

import com.example.controledechaves.dtos.localizacao.LocalizacaoRequestDTO;
import com.example.controledechaves.dtos.localizacao.LocalizacaoResponseDTO;
import com.example.controledechaves.model.Localizacao;
import com.example.controledechaves.repositories.LocalizacaoRepository;

@RestController
@RequestMapping("/cadastro-de-localizacao")

public class LocalizacaoController {
    @Autowired
    private LocalizacaoRepository localizacaoRepository;
   
    @PostMapping
    public Localizacao addLocalizacao(@RequestBody LocalizacaoRequestDTO newLocalizacao) {
        Localizacao localizacoes = new Localizacao(newLocalizacao);
        return localizacaoRepository.save(localizacoes);
    }

    @GetMapping()
    public List<LocalizacaoResponseDTO> getAll(){
        List<LocalizacaoResponseDTO> localizacaoList = localizacaoRepository.findAll().stream().map(LocalizacaoResponseDTO::new).toList();
        return localizacaoList;
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Object> deleteLocalizacao(@PathVariable Long id) {
        try {
            Localizacao localizacaoDel = localizacaoRepository.getReferenceById(id);
            localizacaoRepository.delete(localizacaoDel);
            return ResponseEntity.ok("Localizacao deletada com sucesso");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao excluir localizacao, essa localização está associada a uma chave: " + e.getMessage());
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<String> updateLocalizacao(@PathVariable Long id, @RequestBody LocalizacaoRequestDTO localizacaoRequestDTO) {
        Localizacao localizacaoEditada = localizacaoRepository.getReferenceById(id);
        localizacaoEditada.setNomePredio(localizacaoRequestDTO.nomePredio());
        
        localizacaoRepository.save(localizacaoEditada);
        return ResponseEntity.ok("localizacao atualizada com sucesso");
    }
}