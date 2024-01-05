package com.example.controledechaves.dtos.emprestimo;

import java.time.LocalDate;
import java.time.LocalTime;

import com.example.controledechaves.model.Chave;

public record EmprestimoRequestDTO(String nomeDoResponsavel, Chave chave, LocalDate dataSaida,  LocalTime horarioSaida, LocalDate DataDevolucao, LocalTime horarioDevolucao, String status) {
    
}
