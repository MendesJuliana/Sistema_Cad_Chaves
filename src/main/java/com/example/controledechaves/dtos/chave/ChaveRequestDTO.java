package com.example.controledechaves.dtos.chave;

public record ChaveRequestDTO(String nome, Long setor, Long localizacao, String status) {

    public String getNome() {
        return nome;
    }

    public Long getSetor() {
        return setor;
    }

    public Long getLocalizacao() {
        return localizacao;
    }

}
