package com.example.controledechaves.dtos.emprestimo;

import java.time.LocalDate;
import java.time.LocalTime;

import com.example.controledechaves.model.Chave;

public record EmprestimoResponseDTO(Long id, String nomeDoResponsavel, Chave chave, LocalDate dataSaida,
        LocalTime horarioSaida, LocalDate dataDevolucao, LocalTime horarioDevolucao, String status) {

}
