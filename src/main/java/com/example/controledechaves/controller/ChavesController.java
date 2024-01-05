package com.example.controledechaves.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.controledechaves.dtos.chave.ChaveRequestDTO;
import com.example.controledechaves.dtos.chave.ChaveResponseDTO;

import com.example.controledechaves.model.Chave;

import com.example.controledechaves.model.Localizacao;
import com.example.controledechaves.model.Setor;
import com.example.controledechaves.repositories.ChaveRepository;
import com.example.controledechaves.repositories.EmprestimoRepository;
import com.example.controledechaves.repositories.LocalizacaoRepository;
import com.example.controledechaves.repositories.SetorRepository;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/cadastro-de-chaves")
public class ChavesController {

    @Autowired
    private ChaveRepository chaveRepository;
    @Autowired
    private SetorRepository setorRepository;
    @Autowired
    private LocalizacaoRepository localizacaoRepository;
    @Autowired
    private EmprestimoRepository emprestimoRepository;

    @PostMapping("setor/{idSetor}/localizacao/{idLocalizacao}")
    public Chave addChave(@RequestBody ChaveRequestDTO chaveRequestDTO, @PathVariable Long idSetor,
            @PathVariable Long idLocalizacao) {

        Setor setor = setorRepository.findById(idSetor)
                .orElseThrow(() -> new EntityNotFoundException("Setor não encontrado com o id: " + idSetor));

        Localizacao localizacao = localizacaoRepository.findById(idLocalizacao)
                .orElseThrow(
                        () -> new EntityNotFoundException("Localizacao não encontrada com o id: " + idLocalizacao));
        Chave novaChave = new Chave();
        novaChave.setNome(chaveRequestDTO.nome());
        novaChave.setSetor(setor);
        novaChave.setLocalizacao(localizacao);
        novaChave.setStatus(chaveRequestDTO.status());

        return chaveRepository.save(novaChave);
    }

    @GetMapping()
    public List<ChaveResponseDTO> getAll() {
        List<Chave> chaves = chaveRepository.findAll();
        List<ChaveResponseDTO> chaveResponseDTOs = new ArrayList<>();
        for (Chave chave : chaves) {
            chaveResponseDTOs.add(new ChaveResponseDTO(
                    chave.getIdChave(),
                    chave.getNome(),
                    chave.getSetor(),
                    chave.getLocalizacao(),
                    chave.getStatus()));
        }
        return chaveResponseDTOs;
    }

    @GetMapping("/status/{status}")
    public List<ChaveResponseDTO> getChavesByStatus(@PathVariable String status) {
        List<Chave> chaves = chaveRepository.findByStatus(status);
        List<ChaveResponseDTO> chaveResponseDTO = new ArrayList<>();
        for (Chave chave : chaves) {
            chaveResponseDTO.add(new ChaveResponseDTO(
                    chave.getIdChave(),
                    chave.getNome(),
                    chave.getSetor(),
                    chave.getLocalizacao(),
                    chave.getStatus()));
        }
        return chaveResponseDTO;
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteChave(@PathVariable Long id) {
        Chave chave = chaveRepository.getReferenceById(id);

        // Verifica se a chave está associada a um empréstimo
        boolean chaveEmUso = emprestimoRepository.existsByChaveAndStatus(chave, "Em uso");
        boolean chaveDevolvida = emprestimoRepository.existsByChaveAndStatus(chave, "Devolvido");

        if (chaveEmUso || chaveDevolvida) {
            return ResponseEntity.badRequest().body("Chave em uso, impossível apagar");
        } else {
            // Remove as referências da chave
            chave.setSetor(null);
            chave.setLocalizacao(null);
            chaveRepository.save(chave); // Atualiza a chave sem as referências

            // Finalmente, exclui a chave
            chaveRepository.delete(chave);

            return ResponseEntity.ok("Chave excluída com sucesso");
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<String> updateChave(@PathVariable Long id, @RequestBody ChaveRequestDTO chaveRequestDTO) {
        Chave chave = chaveRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sala não encontrada com o id: " + id));

        chave.setNome(chaveRequestDTO.getNome());

        // Atualiza a localização da sala se a nova localização não for nula
        if (chaveRequestDTO.getLocalizacao() != null) {
            Localizacao localizacao = localizacaoRepository.findById(chaveRequestDTO.getLocalizacao())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Localização não encontrada com o id: " + chaveRequestDTO.getLocalizacao()));
            chave.setLocalizacao(localizacao);
        }

        if (chaveRequestDTO.getSetor() != null) {
            Setor setor = setorRepository.findById(chaveRequestDTO.getSetor())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "setor não encontrada com o id: " + chaveRequestDTO.getSetor()));
            chave.setSetor(setor);
        }

        chave.setStatus(chaveRequestDTO.status());

        chaveRepository.save(chave);

        return ResponseEntity.ok("Sala atualizada com sucesso");
    }

    @PutMapping("/status_da_chave/{id}")
    public void updateStatusDaChave(@PathVariable Long id, @RequestBody Map<String, Object> updates) {

        Chave chave = chaveRepository.getReferenceById(id);

        if (updates.containsKey("status")) {
            chave.setStatus((String) updates.get("status"));
        }
    
        chaveRepository.save(chave);
    }

}
