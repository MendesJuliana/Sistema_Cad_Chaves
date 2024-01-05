buscarChavesCadastradasPorStatusDisponivel();
buscarEmprestimosDevolvidosHoje();
buscarEmprestimosEmUso();

const tabelaChave = document.querySelector('.table-list');
const modalCadChave = document.querySelector('.cad-chave-modal-content-group');
const formChave = document.querySelector('#cadastro-de-chave')

const inputNomeDoResponsavel = document.querySelector('#input-responsavel-nome')
const selectSetor = document.querySelector('#select-setor')
const selectLocalizacao = document.querySelector('#select-localizacao')


const submitChave = document.querySelector('#button-adicionar-chave')
const closeModal = document.querySelector('#fechar-modal');




closeModal.addEventListener('click', function () {
    modalCadChave.style.display = 'none';

});



let modoEdicao = false;
let idChave = null;

const agora = new Date();

const dataSaidaFormatada = agora.toISOString().split('T')[0]; // Obtém a data no formato 'yyyy-MM-dd'

const horas = agora.getHours().toString().padStart(2, '0'); // Obtém as horas no formato 'HH'
const minutos = agora.getMinutes().toString().padStart(2, '0'); // Obtém os minutos no formato 'mm'
const segundos = agora.getSeconds().toString().padStart(2, '0'); // Obtém os segundos no formato 'ss'

const horarioSaidaFormatado = `${horas}:${minutos}:${segundos}`; // Formata a hora no formato 'HH:mm:ss'

console.log(dataSaidaFormatada)
console.log(horarioSaidaFormatado)
submitChave.addEventListener('click', function () {

    const emprestimoObjetoJson = {
        nomeDoResponsavel: inputNomeDoResponsavel.value,
        dataSaida: dataSaidaFormatada,
        horarioSaida: horarioSaidaFormatado,
        status: "Em uso"
    };

    const chaveObjetoJson = {
        status: "uso Indisponível"
    };

    console.log(chaveObjetoJson);
    fazerEmprestimoDeChaveAlteraStatusDaChave(idChave, chaveObjetoJson);

    console.log(emprestimoObjetoJson);
    fazerEmprestimoDeChave(idChave, emprestimoObjetoJson); // Chame a função para cadastrar a localização

    modalCadChave.style.display = 'none';
    //inputNomeDaChave.value = "";
    // selectSetor.value = "";
    // selectLocalizacao.value = "";
})

formChave.addEventListener("submit", function (event) {
    event.preventDefault();
})


function exibirChaves(data) {
    let novaChave = `
    <table id="table-main" class="table-style">
        <thead class="title-table">
            <tr>
            <th class="table-header-nome">Nome</th>
            <th class="table-header-setor">Setor</th>
            <th class="table-header-localizacao">Localização</th>
            <th class="table-header-status">Status</th>
            <th class="table-header-setor">Ações</th>
            </tr>
        </thead>
        <tbody>`;
    data.forEach(chaves => {
        novaChave += `
            <tr>
                <td class="table-data-nome">${chaves.nome}</td>
                <td class="table-data-setor">${chaves.setor.nome}</td>
                <td class="table-data-localizacao">${chaves.localizacao.nomePredio}</td>
                <td class="table-data-status">
                    <span class="status-livre">${chaves.status}</span>
                </td>
                <td class="table-data-acoes">
                    <button id="btn-solicitar-uso-${chaves.id}" class="btn-fazer-emprestimo">Solicitar uso</button>
                </td>
            </tr>`;
    });

 
    tabelaChave.innerHTML = novaChave;

    //datables 
    $(document).ready(function () {
        const table = $('#table-main').DataTable({
            responsive: true,
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
            $('.info-text').text('Chaves cadastradas');
            $('.custom-button').html('').appendTo('.top-section-direita');
        });
    });

    data.forEach(chaves => {

        const buttonSolicitarUso = document.querySelector(`#btn-solicitar-uso-${chaves.id}`)
        const tituloDeConfirmacao = document.querySelector('#titulo-de-chave')

        buttonSolicitarUso.onclick = function () {
            modalCadChave.style.display = 'block';
            tituloDeConfirmacao.innerHTML = chaves.nome;
            inputNomeDoResponsavel.value = "";

            idChave = chaves.id;


            closeModal.onclick = function () {
                modoEdicao = null;
                idChave = null;
                console.log(idChave + "resetou");
            }

        }


    })

}


function buscarChavesCadastradas() {
    fetch("http://localhost:8080/cadastro-de-chaves")
        .then(response => response.json())
        .then(data => {

            exibirChaves(data);
            console.log(data);
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
            exibirChaves(data);
            console.log(data);
        })
        .catch(error => {
            console.log('Erro ao buscar as chaves:', error);
        });
}

function fazerEmprestimoDeChave(idChave, emprestimoObjetoJson) {
    fetch(`http://localhost:8080/emprestimos/${idChave}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(emprestimoObjetoJson)
    })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            buscarChavesCadastradasPorStatusDisponivel();
            buscarEmprestimosDevolvidosHoje();
            buscarEmprestimosEmUso();
        })
        .catch(function (response) { console.log(response) });
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