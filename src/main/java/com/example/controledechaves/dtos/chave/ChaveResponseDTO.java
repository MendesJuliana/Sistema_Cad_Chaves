package com.example.controledechaves.dtos.chave;

import com.example.controledechaves.model.Localizacao;
import com.example.controledechaves.model.Setor;

public record ChaveResponseDTO(Long id, String nome, Setor setor, Localizacao localizacao, String status) {
    
    @Override
    public Long id() {
        return id;
    }

    @Override
    public String nome(){
        return nome;
    }

    @Override
    public Setor setor(){
        return setor;
    }

    @Override
    public Localizacao localizacao() {
        return localizacao;
    }
}
