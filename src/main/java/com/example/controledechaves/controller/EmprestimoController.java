package com.example.controledechaves.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.controledechaves.dtos.emprestimo.EmprestimoRequestDTO;
import com.example.controledechaves.dtos.emprestimo.EmprestimoResponseDTO;
import com.example.controledechaves.model.Chave;
import com.example.controledechaves.model.Emprestimo;
import com.example.controledechaves.repositories.ChaveRepository;
import com.example.controledechaves.repositories.EmprestimoRepository;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/emprestimos")
public class EmprestimoController {

    @Autowired
    private EmprestimoRepository emprestimoRepository;
    @Autowired
    ChaveRepository chaveRepository;

    @PostMapping("{idChave}")
    public Emprestimo fazerEmprestimo(@RequestBody EmprestimoRequestDTO emprestimoRequestDTO,
            @PathVariable Long idChave) {

        Chave chave = chaveRepository.findById(idChave)
                .orElseThrow(() -> new EntityNotFoundException("Setor não encontrado com o id: " + idChave));

        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setNomeDoResponsavel(emprestimoRequestDTO.nomeDoResponsavel());
        emprestimo.setChave(chave);
        emprestimo.setDataSaida(emprestimoRequestDTO.dataSaida());
        emprestimo.setHorarioSaida(emprestimoRequestDTO.horarioSaida());
        emprestimo.setDataDevolucao(emprestimoRequestDTO.DataDevolucao());
        emprestimo.setHorarioDevolucao(emprestimoRequestDTO.horarioDevolucao());
        emprestimo.setStatus(emprestimoRequestDTO.status());
        return emprestimoRepository.save(emprestimo);
    }

    @GetMapping()
    public List<EmprestimoResponseDTO> getAll() {
        List<Emprestimo> emprestimos = emprestimoRepository.findAll();
        List<EmprestimoResponseDTO> emprestimoResponseDTOs = new ArrayList<>();
        for (Emprestimo emprestimo : emprestimos) {
            emprestimoResponseDTOs.add(new EmprestimoResponseDTO(
                    emprestimo.getIdEmprestimo(),
                    emprestimo.getNomeDoResponsavel(),
                    emprestimo.getChave(),
                    emprestimo.getDataSaida(),
                    emprestimo.getHorarioSaida(),
                    emprestimo.getDataDevolucao(),
                    emprestimo.getHorarioDevolucao(),
                    emprestimo.getStatus()));
        }
        return emprestimoResponseDTOs;
    }

    @GetMapping("status/{status}")
    public List<EmprestimoResponseDTO> getEmprestimosByStatus(@PathVariable String status) {
        List<Emprestimo> emprestimos = emprestimoRepository.findByStatus(status);
        List<EmprestimoResponseDTO> emprestimoResponseDTOs = new ArrayList<>();
        for (Emprestimo emprestimo : emprestimos) {
            emprestimoResponseDTOs.add(new EmprestimoResponseDTO(
                    emprestimo.getIdEmprestimo(),
                    emprestimo.getNomeDoResponsavel(),
                    emprestimo.getChave(),
                    emprestimo.getDataSaida(),
                    emprestimo.getHorarioSaida(),
                    emprestimo.getDataDevolucao(),
                    emprestimo.getHorarioDevolucao(),
                    emprestimo.getStatus()));
        }
        return emprestimoResponseDTOs;
    }

    @GetMapping("do-dia")
    public List<Emprestimo> getEmprestimosDoDia() {
        LocalDate dataAtual = LocalDate.now(); // Obtém a data atual
        return emprestimoRepository.findByDataSaida(dataAtual);
    }

    @GetMapping("do-dia-em-uso/{status}")
    public List<Emprestimo> getEmprestimosDoDiaEmUso(@PathVariable String status) {
        LocalDate dataAtual = LocalDate.now(); // Obtém a data atual

        return emprestimoRepository.findByDataSaidaAndStatus(dataAtual, status);
    }

    @PutMapping("{id}")
    public void updateEmprestimo(@PathVariable Long id, @RequestBody Map<String, Object> updates) {

        Emprestimo emprestimo = emprestimoRepository.getReferenceById(id);

        if (updates.containsKey("status")) {
            emprestimo.setStatus((String) updates.get("status"));
        }
        if (updates.containsKey("DataDevolucao")) {
            emprestimo.setDataDevolucao(LocalDate.parse((String) updates.get("DataDevolucao")));
        }
        if (updates.containsKey("horarioDevolucao")) {
            emprestimo.setHorarioDevolucao(LocalTime.parse((String) updates.get("horarioDevolucao")));
        }

        emprestimoRepository.save(emprestimo);
    }

    @DeleteMapping("{id}")
    public void deleteEmprestimo(@PathVariable long id) {
        Emprestimo emprestimo = emprestimoRepository.getReferenceById(id);
        emprestimo.setChave(null);
        emprestimoRepository.save(emprestimo);
        emprestimoRepository.delete(emprestimo);

    }

}
