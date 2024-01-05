package com.example.controledechaves.model;

import com.example.controledechaves.dtos.localizacao.LocalizacaoRequestDTO;

import jakarta.persistence.*;

@Entity
@Table(name = "localizacao")

public class Localizacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLocalizacao;
    @Column(name = "nome")
    private String nomePredio;

    public Localizacao() {

    }

    public Localizacao(LocalizacaoRequestDTO localizacaoRequestDTO) {
        this.nomePredio = localizacaoRequestDTO.nomePredio();
        // this.piso = localizacaoRequestDTO.piso();
    }

    public Long getIdLocalizacao() {
        return idLocalizacao;
    }

    public void setIdLocalizacao(Long idLocalizacao) {
        this.idLocalizacao = idLocalizacao;
    }

    public String getNomePredio() {
        return nomePredio;
    }

    public void setNomePredio(String nomePredio) {
        this.nomePredio = nomePredio;
    }

}