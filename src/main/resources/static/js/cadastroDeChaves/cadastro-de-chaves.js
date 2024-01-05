buscarSetoresCadastrados();
buscarLocalizacoesCadastradas();
buscarChavesCadastradas();

const tabelaChave = document.querySelector('.table-list');
const modalCadChave = document.querySelector('.cad-chave-modal-content-group');
const formChave = document.querySelector('#cadastro-de-chave')

const inputNomeDaChave = document.querySelector('#input-chave-nome')
const selectSetor = document.querySelector('#select-setor')
const selectLocalizacao = document.querySelector('#select-localizacao')


const submitChave = document.querySelector('#button-adicionar-chave')
const closeModal = document.querySelector('#fechar-modal');


closeModal.addEventListener('click', function () {
    modalCadChave.style.display = 'none';
    //inputNomeDaChave.value = "";
    //selectSetor.value = "";
    // selectLocalizacao.value = "";

});

function limpar() {
    inputNomeDaChave.value = "";
    selectSetor.value = "";
    selectLocalizacao.value = "";
}

let modoEdicao = false;
let idChave = null;
let statusEdit = null;

submitChave.addEventListener('click', function () {

    if (inputNomeDaChave.value.trim() == "" ||
        selectSetor.value.trim() == "" ||
        selectLocalizacao.value.trim() == ""
    ) {
        alert("o input está vazio, preechea-o com valor válido");
    } else {
        if (modoEdicao && idChave !== null) {
            const NovaChaveEditada = {
                nome: inputNomeDaChave.value,
                setor: selectSetor.value,
                localizacao: selectLocalizacao.value,
                status: statusEdit

                // Outros campos que você precise editar
            };
            atualizarChave(idChave, NovaChaveEditada);
            modoEdicao = false; // Resetando o modo para adição
            idChave = null;
        } else {
            const objetoJson = {
                nome: inputNomeDaChave.value,
                setor: selectSetor.value,
                localizacao: selectLocalizacao.value,
                status: "Disponível"
                // Outros campos para criar um novo item
            };
            idSetor = selectSetor.value;
            idLocalizacao = selectLocalizacao.value;
            cadastrarChave(objetoJson, idSetor, idLocalizacao);

            // Chame a função para cadastrar a localização
        }
        limpar();
        modalCadChave.style.display = 'none';
    }

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
                <th class="table-header-setor">Ações</th>
            </tr>
        </thead>
        <tbody>`;
    data.forEach(chaves => {
        novaChave += `
            <tr class="table-row">
                <td class="table-data-nome">${chaves.nome}</td>
                <td class="table-data-setor">${chaves.setor.nome}</td>
                <td class="table-data-localizacao">${chaves.localizacao.nomePredio}</td>
                <td class="table-data-acoes">
                    <i id="btn-edt-chaves-${chaves.id}" class='bx bx-edit icon-acao-table'></i>
                    <i id="btn-del-chaves-${chaves.id}" class='bx bx-trash icon-acao-table'></i>
                </td>
            </tr>`;
    });

    novaChave += `</tbody>
</table>`;

    tabelaChave.innerHTML = novaChave;

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
            $('.info-text').text('Chaves cadastradas');
            $('.custom-button').html('<div id="btn-nova-chave" class="button-add-novo"><span><i class="bx bx-plus"></i>Adicione</span></div>').appendTo('.top-section-direita');

            const openModal = document.querySelector('.custom-button');


            openModal.addEventListener('click', function () {
                modalCadChave.style.display = 'block';
            });
        });
    });





    data.forEach(chaves => {

        const iconEditar = document.querySelector(`#btn-edt-chaves-${chaves.id}`)
        const iconDeletar = document.querySelector(`#btn-del-chaves-${chaves.id}`)

        iconEditar.onclick = function () {
            modalCadChave.style.display = 'block';
            modoEdicao = true;
            inputNomeDaChave.value = chaves.nome;
            selectSetor.value = chaves.setor.idSetor;
            selectLocalizacao.value = chaves.localizacao.idLocalizacao;
            idChave = chaves.id;

            console.log("status da sala atual: " + chaves.status)
            statusEdit = chaves.status;
            console.log("status da sala atual: " + statusEdit)

            closeModal.onclick = function () {
                modoEdicao = null;
                idChave = null;
                console.log(idChave + "resetou");
                limpar();
            }

        }

        iconDeletar.onclick = function () {
            idChave = chaves.id;
            if (idChave !== null) {

                deletarChave(idChave);
                idChave = null;
            }

        }
    })

}

// Função para buscar e exibir as localizações já cadastradas
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

function cadastrarChave(objetoJson, idSetor, idLocalizacao) {
    fetch(`http://localhost:8080/cadastro-de-chaves/setor/${idSetor}/localizacao/${idLocalizacao}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(objetoJson)
    })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            buscarChavesCadastradas();
        })
        .catch(function (response) { console.log(response) });
}

function deletarChave(idChave) {
    fetch(`http://localhost:8080/cadastro-de-chaves/${idChave}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                return response.text(); // Retorna o texto da resposta
            } else {
                throw new Error('Falha ao excluir a chave, no momento ela está em uso'); // Lança um erro caso a exclusão falhe
            }
        })
        .then(textoResposta => {
            console.log(textoResposta); // Aqui está o texto da resposta "Chave excluída com sucesso"
            buscarChavesCadastradas(); // Atualiza a lista de chaves após a exclusão
        })
        .catch(error => {
            console.error("Erro ao fazer a solicitação DELETE:", error);
            alert(error.message); // Exibe o erro caso a exclusão falhe
            buscarChavesCadastradas(); // Atualiza a lista de chaves (se necessário)
        });
}

function atualizarChave(idChave, NovaChaveEditada) {
    fetch(`http://localhost:8080/cadastro-de-chaves/${idChave}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(NovaChaveEditada)
    })
        .then(response => {
            if (response.ok) {
                console.log("localizacao atualizada com sucesso");
                buscarChavesCadastradas();

            } else {
                console.error("Falha ao atualizar a localizacao");
                buscarChavesCadastradas();
            }
        })
        .catch(error => {
            console.error("Erro ao fazer a solicitação PUT:", error);
        });
}

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

function buscarSetoresCadastrados() {
    fetch("http://localhost:8080/cadastro-de-setor")
        .then(response => response.json())
        .then(data => {

            exibirSetor(data);
            console.log(data);
        })
        .catch(error => {
            console.log('Erro ao buscar os setores:', error);
        });
}

function exibirSetor(data) {
    let novaSetorNoSelect = `<option value="" disabled selected hidden>Selecione um setor</option>`;

    data.forEach(setor => {
        novaSetorNoSelect += `
        <option id="opc-setor-${setor.id}" value="${setor.id}">${setor.nome}</option>
        `;
    });

    selectSetor.innerHTML = novaSetorNoSelect;

}

function exibirLocalizacao(data) {
    let novaLocalizacaoNoSelect = `<option value="" disabled selected hidden>Selecione uma Localização</option>`;

    data.forEach(localizacao => {
        novaLocalizacaoNoSelect += `
        <option id="opc-localizacao-${localizacao.id}" value="${localizacao.id}">${localizacao.nome}</option>
        `;
    });

    selectLocalizacao.innerHTML = novaLocalizacaoNoSelect;
}





