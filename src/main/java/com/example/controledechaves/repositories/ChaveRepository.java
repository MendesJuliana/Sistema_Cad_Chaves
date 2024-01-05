package com.example.controledechaves.repositories;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.controledechaves.model.Chave;
import com.example.controledechaves.model.Localizacao;
import com.example.controledechaves.model.Setor;

@Repository
public interface ChaveRepository extends JpaRepository<Chave, Long>{
    List<Chave> findByLocalizacao(Localizacao localizacao);
    List<Chave> findBySetor(Setor setor);
    List<Chave> findByStatus(String status);
}
    

