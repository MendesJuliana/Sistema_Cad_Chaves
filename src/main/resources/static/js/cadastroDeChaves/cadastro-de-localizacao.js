buscarLocalizacoesCadastradas();

const tabelaLocalizacao = document.querySelector('.table-list');
const modalCadlocalizacao = document.querySelector('.cad-localizacao-modal-content-group');
const formLocalizacao = document.querySelector('#cadastro-localizacao')
const inputNomeDaLocalizacao = document.querySelector("#nome-localizacao")
const submitLocalizacao = document.querySelector('#button-adicionar-localizacao')
let modoEdicao = false;
let idLocalizacao = null;

const closeModal = document.querySelector('.bx-x');

closeModal.addEventListener('click', function () {
    modalCadlocalizacao.style.display = 'none';
    inputNomeDaLocalizacao.value = "";
});


submitLocalizacao.addEventListener('click', function () {
    if (inputNomeDaLocalizacao.value.trim() == ""    
    ) {
        alert("o input está vazio, preechea-o com valor válido");
    } else {
        if (modoEdicao && idLocalizacao !== null) {
            const localizacaoEditada = {
                nomePredio: inputNomeDaLocalizacao.value
                // Outros campos que você precise editar
            };
            atualizarLocalizacao(idLocalizacao, localizacaoEditada);
            modoEdicao = false; // Resetando o modo para adição
            idLocalizacao = null;
        } else {
            const objetoJson = {
                nomePredio: inputNomeDaLocalizacao.value
                // Outros campos para criar um novo item
            };
            cadastrarLocalizacao(objetoJson); // Chame a função para cadastrar a localização
        }
        modalCadlocalizacao.style.display = 'none';
        inputNomeDaLocalizacao.value = "";
    }

   
})

formLocalizacao.addEventListener("submit", function (event) {
    event.preventDefault();
})


function exibirLocalizacao(data) {
    let novaLocalizacao = `
    <table id="table-main" class="table-style">
    <thead class="title-table">
        <tr>
            <th class="table-header-nome">Nome</th>
            <th class="table-header-acoes">Ações</th>
        </tr>
    </thead>
    <tbody>`;
    data.forEach(localizacao => {
        novaLocalizacao += `
        <tr class="table-row">
            <td class="table-data-nome">${localizacao.nome}</td>
            <td class="table-data-acoes">
                <i id="btn-edt-localizacao-${localizacao.id}" class='bx bx-edit icon-acao-table'></i>
                <i id="btn-del-localizacao-${localizacao.id}" class='bx bx-trash icon-acao-table'></i>
            </td>
        </tr>`;
    });

    

    tabelaLocalizacao.innerHTML = novaLocalizacao;

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
            $('.info-text').text('Localizações cadastradas');
            $('.custom-button').html('<div id="btn-nova-chave" class="button-add-novo"><span><i class="bx bx-plus"></i>Adicione</span></div>').appendTo('.top-section-direita');

            const openModal = document.querySelector('.custom-button');


            openModal.addEventListener('click', function () {
                modalCadlocalizacao.style.display = 'block';
            });
        });
    });

    data.forEach(localizacao => {

        const iconEditar = document.querySelector(`#btn-edt-localizacao-${localizacao.id}`)
        const iconDeletar = document.querySelector(`#btn-del-localizacao-${localizacao.id}`)

        iconEditar.onclick = function () {
            modalCadlocalizacao.style.display = 'block';
            modoEdicao = true;
            inputNomeDaLocalizacao.value = localizacao.nome;
            idLocalizacao = localizacao.id;


            closeModal.onclick = function () {
                modoEdicao = null;
                idLocalizacao = null;
                console.log(idLocalizacao + "resetou");
                
            }

        }

        iconDeletar.onclick = function () {
            idLocalizacao = localizacao.id;
            if (idLocalizacao !== null) {

                deletarLocalizacao(idLocalizacao);
                idLocalizacao = null;
            }

        }
    })

}

// Função para buscar e exibir as localizações já cadastradas
function buscarLocalizacoesCadastradas() {
    fetch("http://localhost:8080/cadastro-de-localizacao")
        .then(response => response.json())
        .then(data => {

            exibirLocalizacao(data);
            console.log(data);
        })
        .catch(error => {
            console.log('Erro ao buscar as localizações:', error);
        });
}

function cadastrarLocalizacao(objetoJson) {
    fetch("http://localhost:8080/cadastro-de-localizacao", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(objetoJson)
    })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            buscarLocalizacoesCadastradas();
        })
        .catch(function (response) { console.log(response) });
}

function deletarLocalizacao(idLocalizacao) {
    fetch(`http://localhost:8080/cadastro-de-localizacao/${idLocalizacao}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                console.log("Sala excluída com sucesso");
                buscarLocalizacoesCadastradas();

            } else {
                console.error("Falha ao excluir a sala");
                alert("Você não pode deletar essa localizacao, ela está associada a uma sala");
                buscarLocalizacoesCadastradas();
            }
        })
        .catch(error => {
            console.error("Erro ao fazer a solicitação DELETE:", error);
        });
}

function atualizarLocalizacao(idLocalizacao, localizacaoEditada) {
    fetch(`http://localhost:8080/cadastro-de-localizacao/${idLocalizacao}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(localizacaoEditada)
    })
        .then(response => {
            if (response.ok) {
                console.log("localizacao atualizada com sucesso");
                buscarLocalizacoesCadastradas();

            } else {
                console.error("Falha ao atualizar a localizacao");
                buscarLocalizacoesCadastradas();
            }
        })
        .catch(error => {
            console.error("Erro ao fazer a solicitação PUT:", error);
        });
}
