buscarEmprestimosEmUso();
buscarEmprestimosDevolvidosHoje()
buscarChavesCadastradasPorStatusDisponivel()

const tabelaChave = document.querySelector('.table-list');
const modalConfirmDevolucao = document.querySelector('.confirm-devolucao-modal-content-group');
const formChave = document.querySelector('#cadastro-de-chave')

const inputNomeDoResponsavel = document.querySelector('#input-responsavel-nome')
const selectSetor = document.querySelector('#select-setor')
const selectLocalizacao = document.querySelector('#select-localizacao')

const btnCancelDevolucao = document.querySelector('#btn-cancel-devolucao')
const btnConfirmDevoluco = document.querySelector('#btn-confirm-devolucao')
const closeModal = document.querySelector('#fechar-modal');




closeModal.addEventListener('click', function () {
    modalConfirmDevolucao.style.display = 'none';

});


const agora = new Date();

const ano = agora.getFullYear().toString().padStart(4, '0'); // Obtém o ano no formato 'yyyy'
const mes = (agora.getMonth() + 1).toString().padStart(2, '0'); // Obtém o mês no formato 'MM' (lembre-se que janeiro é 0)
const dia = agora.getDate().toString().padStart(2, '0'); // Obtém o dia no formato 'dd'

const dataSaidaFormatada = `${ano}-${mes}-${dia}`; // Formata a data no formato 'yyyy-MM-dd'

const horas = agora.getHours().toString().padStart(2, '0'); // Obtém as horas no formato 'HH'
const minutos = agora.getMinutes().toString().padStart(2, '0'); // Obtém os minutos no formato 'mm'
const segundos = agora.getSeconds().toString().padStart(2, '0'); // Obtém os segundos no formato 'ss'

const horarioSaidaFormatado = `${horas}:${minutos}:${segundos}`; // Formata a hora no formato 'HH:mm:ss'

console.log(dataSaidaFormatada);
console.log(horarioSaidaFormatado);


//formChave.addEventListener("submit", function (event) {
// event.preventDefault();
//})


function exibirEmprestimosEmUso(data) {
    let novoEmprestimo = `
    <table id="table-main" class="table-style">
        <thead class="title-table">
            <tr>
                <th class="table-header-responsavel">Responsável</th>
                <th class="table-header-chave">Chave</th>
                <th class="table-header-retirada">Retirada</th>
                <th class="table-header-status">Status</th>
                <th class="table-header-acoes">Ações</th>
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
                <td class="table-data-status">
                    <span class="status-em-uso">${emprestimo.status}</span>
                </td>
                <td class="table-data-acoes">
                    <button id="btn-fazer-devolucao-${emprestimo.id}" class="btn-fazer-devolucao">Devolução</button>
                </td>
            </tr>`;
    });

    tabelaChave.innerHTML = novoEmprestimo;

    //datables 
    $(document).ready(function () {
        const table = $('#table-main').DataTable({
            "columnDefs": [
                { "className": "", "targets": "_all" } // Isso remove todas as classes das células
            ],
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

    data.forEach(emprestimo => {

        const btnDevolucao = document.querySelector(`#btn-fazer-devolucao-${emprestimo.id}`)

        const responsavelDaDevolucao = document.querySelector('#responsavel-por-chave')
        const chaveDevolvida = document.querySelector('#chave-da-devolucao')

        btnDevolucao.onclick = function () {
            modalConfirmDevolucao.style.display = 'block';
            responsavelDaDevolucao.innerHTML = emprestimo.nomeDoResponsavel;
            chaveDevolvida.innerHTML = emprestimo.chave.nome;
            idEmprestimo = emprestimo.id;
            idChave = emprestimo.chave.idChave;

            btnCancelDevolucao.onclick = function () {
                modalConfirmDevolucao.style.display = "none";
                idEmprestimo = null;
                idChave = null;
            }

            btnConfirmDevoluco.onclick = function () {
                if (idEmprestimo != null){
                    const objetoJson = {
                        DataDevolucao: dataSaidaFormatada,
                        horarioDevolucao: horarioSaidaFormatado,
                        status: "Devolvido"
                    }

                    const ChaveObjetoJson = {
                        status: "Disponivel"
                    }
                    fazerEmprestimoDeChaveAlteraStatusDaChave(idChave, ChaveObjetoJson)
                    console.log(objetoJson);
                    console.log(idEmprestimo);
                    fazerDevolução(idEmprestimo, objetoJson);
                    modalConfirmDevolucao.style.display = "none";
                }
                idEmprestimo = null;
                console.log(idEmprestimo);
                
            }

            closeModal.onclick = function () {
                modoEdicao = null;
                idEmprestimo = null;
                console.log(idEmprestimo + "resetou");
            }
        }
    })
    const EmUso = document.querySelector('#count-em-uso')
    EmUso.innerHTML = data.length;
}

// Função para buscar e exibir as localizações já cadastradas
function buscarEmprestimosEmUso() {
    fetch("http://localhost:8080/emprestimos/status/Em%20uso")
        .then(response => response.json())
        .then(data => {

            exibirEmprestimosEmUso(data);
            console.log(data);
        })
        .catch(error => {
            console.log('Erro ao buscar as chaves:', error);
        });
}

function fazerDevolução(idEmprestimo, objetoJson) {
    fetch(`http://localhost:8080/emprestimos/${idEmprestimo}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objetoJson)
    })
        .then(response => {
            if (response.ok) {
                console.log("localizacao atualizada com sucesso");
                buscarEmprestimosEmUso();
                buscarEmprestimosDevolvidosHoje();
                buscarChavesCadastradasPorStatusDisponivel();

            } else {
                console.error("Falha ao atualizar a localizacao");
                buscarEmprestimosEmUso();
                buscarEmprestimosDevolvidosHoje();
                buscarChavesCadastradasPorStatusDisponivel();
            }
        })
        .catch(error => {
            console.error("Erro ao fazer a solicitação PUT:", error);
        });
}

function buscarEmprestimosDevolvidosHoje() {
    fetch("http://localhost:8080/emprestimos/do-dia-em-uso/Devolvido")
        .then(response => response.json())
        .then(data => {
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

function fazerEmprestimoDeChaveAlteraStatusDaChave(idChave, chaveObjetoJson) {
    fetch(`http://localhost:8080/cadastro-de-chaves/status_da_chave/${idChave}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(chaveObjetoJson)
    })
        .then(response => {
            if (response.ok) {
                console.log("status de chave atualizada com sucesso");
            } else {
                console.error("Falha ao atualizar a status de chave");
            }
            buscarEmprestimosEmUso();
        })
        .catch(error => {
            console.error("Erro ao fazer a solicitação PUT:", error);
        });
}














