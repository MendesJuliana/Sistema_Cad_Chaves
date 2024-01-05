package com.example.controledechaves.model;

import com.example.controledechaves.dtos.setor.SetorRequestDTO;

import jakarta.persistence.*;

@Entity
@Table(name = "setor")
public class Setor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSetor;
    @Column(name = "nome")
    private String nome;

    public Setor() {

    }

    public Setor(SetorRequestDTO categoriaRequest) {
        this.nome = categoriaRequest.nome();
    }

    public Long getIdSetor() {
        return idSetor;
    }

    public void setIdSetor(Long idSetor) {
        this.idSetor = idSetor;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

}