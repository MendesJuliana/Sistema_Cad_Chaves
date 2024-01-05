package com.example.controledechaves.model;

import java.time.LocalDate;
import java.time.LocalTime;

import com.example.controledechaves.dtos.emprestimo.EmprestimoRequestDTO;

import jakarta.persistence.*;

@Entity
@Table(name = "emprestimos")
public class Emprestimo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idEmprestimo;

    @Column(name = "responsavel")
    private String nomeDoResponsavel;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "id_chave")
    private Chave chave;

    @Column(name = "data_saida")
    private LocalDate dataSaida;

    @Column(name = "hora_saida")
    private LocalTime horarioSaida;

    @Column(name = "data-devolucao")
    private LocalDate dataDevolucao;

    @Column(name = "hora_devolucao")
    private LocalTime horarioDevolucao;

    @Column(name = "status")
    private String status;

    public Emprestimo(){
    }

    public Emprestimo(EmprestimoRequestDTO emprestimoRequestDTO, Chave chave) {
        this.nomeDoResponsavel = emprestimoRequestDTO.nomeDoResponsavel();
        this.chave = chave;
        this.dataSaida = emprestimoRequestDTO.dataSaida();
        this.horarioSaida = emprestimoRequestDTO.horarioSaida();
        this.dataDevolucao = emprestimoRequestDTO.DataDevolucao();
        this.horarioDevolucao = emprestimoRequestDTO.horarioDevolucao();
        this.status = emprestimoRequestDTO.status();
    }

    public long getIdEmprestimo() {
        return idEmprestimo;
    }

    public void setIdEmprestimo(long idEmprestimo) {
        this.idEmprestimo = idEmprestimo;
    }

    public String getNomeDoResponsavel() {
        return nomeDoResponsavel;
    }

    public void setNomeDoResponsavel(String nomeDoResponsavel) {
        this.nomeDoResponsavel = nomeDoResponsavel;
    }

    public Chave getChave() {
        return chave;
    }

    public void setChave(Chave chave) {
        this.chave = chave;
    }

    public LocalDate getDataSaida() {
        return dataSaida;
    }

    public void setDataSaida(LocalDate dataSaida) {
        this.dataSaida = dataSaida;
    }

    public LocalTime getHorarioSaida() {
        return horarioSaida;
    }

    public void setHorarioSaida(LocalTime horarioSaida) {
        this.horarioSaida = horarioSaida;
    }

    public LocalDate getDataDevolucao() {
        return dataDevolucao;
    }

    public void setDataDevolucao(LocalDate dataDevolucao) {
        this.dataDevolucao = dataDevolucao;
    }

    public LocalTime getHorarioDevolucao() {
        return horarioDevolucao;
    }

    public void setHorarioDevolucao(LocalTime horarioDevolucao) {
        this.horarioDevolucao = horarioDevolucao;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }





   

   
}
