package com.example.controledechaves.repositories;

import java.time.LocalDate;
import java.util.List;

//import java.time.LocalDateTime;
//import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.controledechaves.model.Chave;
import com.example.controledechaves.model.Emprestimo;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {
    List<Emprestimo> findByChave(Chave chave);

    List<Emprestimo> findByStatus(String status);

    List<Emprestimo> findByDataSaida(LocalDate dataSaida);

    List<Emprestimo> findByDataSaidaAndStatus(LocalDate dataSaida, String status);

    boolean existsByChaveAndStatus(Chave chave, String emUso);

    // @Query("SELECT e FROM Emprestimo e WHERE e.status = 'em uso'")
    // List<Emprestimo> findEmprestimosEmAndamento();

    // @Query("SELECT e FROM EmprestimoDe e WHERE e.status = 'Devoldido'")
    // List<Emprestimo> findEmprestimosDevolvidos();

    // @Query("SELECT e FROM EmprestimoDe e WHERE e.status = 'em andamento' AND
    // e.horarioDevolucao > :horarioAtual")
    // List<Emprestimo> findEmprestimosPendentes(LocalDateTime horarioAtual);
}
