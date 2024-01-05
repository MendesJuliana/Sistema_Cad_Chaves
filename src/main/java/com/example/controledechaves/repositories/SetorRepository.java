package com.example.controledechaves.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.controledechaves.model.Setor;

@Repository
public interface SetorRepository extends JpaRepository<Setor, Long>{
    
}
