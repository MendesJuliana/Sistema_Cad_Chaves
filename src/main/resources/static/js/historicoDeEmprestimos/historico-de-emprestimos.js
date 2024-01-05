buscarEmprestimosDevolvidos();

const tabelaChave = document.querySelector('.table-list');

function exibirEmprestimosDevolvidos(data) {
    let novoEmprestimo = `
    <table id="table-main" class="table-style">
        <thead class="title-table">
            <tr>
                <th class="table-header-responsavel">Responsável</th>
                <th class="table-header-chave">Chave</th>
                <th class="table-header-retirada">Retirada</th>
                <th class="table-header-devolucao">Devolução</th>
                <th class="table-header-status">Status</th>
                
            </tr>
        </thead>
        <tbody>`;
    data.forEach(emprestimo => {
        novoEmprestimo += `
            <tr class="table-row">
                <td class="table-data-responsavel">${emprestimo.nomeDoResponsavel}</td>
                <td class="table-data-chave">${emprestimo.chave.nome}</td>
                <td class="table-data-retirada">
                    <div class="date-moment">
                        <span>${emprestimo.dataSaida}</span>
                        <span>às</span>
                        <span>${emprestimo.horarioSaida}</span>
                    </div>
                </td>
                <td class="table-data-devolucao">
                        <div class="date-moment">
                                <span>${emprestimo.dataDevolucao}</span>
                                <span>às</span>
                                <span>${emprestimo.horarioDevolucao}</span>
                            </div>
                <td class="table-data-status">
                    <span class="status-devolvido">${emprestimo.status}</span>
                </td>
                
            </tr>`;
    });

    tabelaChave.innerHTML = novoEmprestimo;

    //datables 
    $(document).ready(function () {
        const table = $('#table-main').DataTable({
            info: true,
            ordering: false,
            paging: true,
            searching: true,
            dom: "<'top-section'<'info-text'><'top-section-direita'<'custom-button'>f>><t><'bottom'ip>", // Nova ordem: texto, filtro e botão
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/pt-BR.json',
                "search": ""
            }
        });

        table.on('draw.dt', function () {
            $('#table-main_previous').html('<i class="bx bx-chevron-left"></i>');
            $('#table-main_next').html('<i class="bx bx-chevron-right"></i>');
            $('.info-text').text('Retirada de chave');
            $('.custom-button').html('').appendTo('.top-section-direita');
        });
    });

}

function buscarEmprestimosDevolvidos() {
    fetch("http://localhost:8080/emprestimos/status/Devolvido")
        .then(response => response.json())
        .then(data => {
            exibirEmprestimosDevolvidos(data);
            console.log(data);
        })
        .catch(error => {
            console.log('Erro ao buscar as chaves:', error);
        });
}
















