buscarEmprestimosEmUso();
buscarChavesCadastradasPorStatusDisponivel();
buscarEmprestimosDevolvidosHoje();

const tabelaChave = document.querySelector('.table-list');
const modalConfirmDevolucao = document.querySelector('.confirm-devolucao-modal-content-group');
const formChave = document.querySelector('#cadastro-de-chave')

const inputNomeDoResponsavel = document.querySelector('#input-responsavel-nome')
const selectSetor = document.querySelector('#select-setor')
const selectLocalizacao = document.querySelector('#select-localizacao')

const btnCancelDevolucao = document.querySelector('#btn-cancel-devolucao')
const btnConfirmDevoluco = document.querySelector('#btn-confirm-devolucao')
const closeModal = document.querySelector('#fechar-modal');



const agora = new Date();

const dataSaidaFormatada = agora.toISOString().split('T')[0]; // Obtém a data no formato 'yyyy-MM-dd'

const horas = agora.getHours().toString().padStart(2, '0'); // Obtém as horas no formato 'HH'
const minutos = agora.getMinutes().toString().padStart(2, '0'); // Obtém os minutos no formato 'mm'
const segundos = agora.getSeconds().toString().padStart(2, '0'); // Obtém os segundos no formato 'ss'

const horarioSaidaFormatado = `${horas}:${minutos}:${segundos}`; // Formata a hora no formato 'HH:mm:ss'

console.log(dataSaidaFormatada)
console.log(horarioSaidaFormatado)

//formChave.addEventListener("submit", function (event) {
// event.preventDefault();
//})


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

// Função para buscar e exibir as localizações já cadastradas
function buscarEmprestimosEmUso() {
    fetch("http://localhost:8080/emprestimos/status/Em%20uso")
        .then(response => response.json())
        .then(data => {
            document.querySelector('#count-em-uso').innerHTML = data.length;
            console.log(data);

        })
        .catch(error => {
            console.log('Erro ao buscar as chaves:', error);
        });
}

function buscarEmprestimosDevolvidosHoje() {
    fetch("http://localhost:8080/emprestimos/do-dia-em-uso/Devolvido")
        .then(response => response.json())
        .then(data => {
            exibirEmprestimosDevolvidos(data);
            document.querySelector("#count-devolvidos").innerHTML = data.length;

        })
        .catch(error => {
            console.log('Erro ao buscar as chaves:', error);
        });
}

function buscarChavesCadastradasPorStatusDisponivel() {
    fetch("http://localhost:8080/cadastro-de-chaves/status/Disponivel")
        .then(response => response.json())
        .then(data => {
            document.querySelector('#count-disponivel').innerHTML = data.length;
            console.log(data);
        })
        .catch(error => {
            console.log('Erro ao buscar as chaves:', error);
        });
}
















