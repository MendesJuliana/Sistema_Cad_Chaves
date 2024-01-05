buscarSetoresCadastrados();

const tabelaSetor = document.querySelector('.table-list');
const modalCadSetor = document.querySelector('.cad-setor-modal-content-group');
const formSetor = document.querySelector('#cadastro-setor')
const inputNomeDoSetor = document.querySelector("#nome-setor")
const submitSetor = document.querySelector('#button-adicionar-setor')
let modoEdicao = false;
let idSetor = null;

const closeModal = document.querySelector('.bx-x');

closeModal.addEventListener('click', function () {
    modalCadSetor.style.display = 'none';
    inputNomeDoSetor.value = "";
});


submitSetor.addEventListener('click', function () {
    if (inputNomeDoSetor.value.trim() == ""
    ) {
        alert("o input está vazio, preechea-o com valor válido");
    } else {
        if (modoEdicao && idSetor !== null) {
            const setorEditado = {
                nome: inputNomeDoSetor.value
                // Outros campos que você precise editar
            };
            atualizarSetor(idSetor, setorEditado);
            modoEdicao = false; // Resetando o modo para adição
            idSetor = null;
        } else {
            const objetoJson = {
                nome: inputNomeDoSetor.value
                // Outros campos para criar um novo item
            };
            cadastrarSetor(objetoJson); // Chame a função para cadastrar a localização
        }
        modalCadSetor.style.display = 'none';
        inputNomeDoSetor.value = "";
    }


})

formSetor.addEventListener("submit", function (event) {
    event.preventDefault();
})


function exibirSetor(data) {
    let novoSetor = `
    <table id="table-main" class="table-style ">
    <thead class="title-table">
        <tr>
            <th class="table-header-nome">Nome</th>
            <th class="table-header-acoes ">Ações</th>
        </tr>
    </thead>
    <tbody>`;
    data.forEach(setor => {
        novoSetor += `
        <tr class="table-row">
            <td class="table-data-nome">${setor.nome}</td>
            <td class="table-data-acoes cad-acoes">
                <i id="btn-edt-setor-${setor.id}" class='bx bx-edit icon-acao-table'></i>
                <i id="btn-del-setor-${setor.id}" class='bx bx-trash icon-acao-table'></i>
            </td>
    </tr>`;
    });



    tabelaSetor.innerHTML = novoSetor;

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
            $('.info-text').text('Setores cadastrados');
            $('.custom-button').html('<div id="btn-nova-chave" class="button-add-novo"><span><i class="bx bx-plus"></i>Adicione</span></div>').appendTo('.top-section-direita');

            const openModal = document.querySelector('.custom-button');


            openModal.addEventListener('click', function () {
                modalCadSetor.style.display = 'block';
            });
        });
    });

    data.forEach(setor => {

        const iconEditar = document.querySelector(`#btn-edt-setor-${setor.id}`)
        const iconDeletar = document.querySelector(`#btn-del-setor-${setor.id}`)

        iconEditar.onclick = function () {
            modalCadSetor.style.display = 'block';
            modoEdicao = true;
            inputNomeDoSetor.value = setor.nome;
            idSetor = setor.id;

            closeModal.onclick = function () {
                modoEdicao = null;
                idSetor = null;
                console.log(idSetor + "resetou");
            }

        }

        iconDeletar.onclick = function () {
            idSetor = setor.id;
            if (idSetor !== null) {

                deletarSetor(idSetor);
                idSetor = null;
            }
        }
    })
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

function cadastrarSetor(objetoJson) {
    fetch("http://localhost:8080/cadastro-de-setor", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(objetoJson)
    })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            buscarSetoresCadastrados();
        })
        .catch(function (response) { console.log(response) });
}

function deletarSetor(idSetor) {
    fetch(`http://localhost:8080/cadastro-de-setor/${idSetor}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                console.log("Sala excluída com sucesso");
                buscarSetoresCadastrados();

            } else {
                console.error("Falha ao excluir a sala");
                alert("Você não pode deletar essa localizacao, ela está associada a uma sala");
                buscarSetoresCadastrados();
            }
        })
        .catch(error => {
            console.error("Erro ao fazer a solicitação DELETE:", error);
        });
}

function atualizarSetor(idSetor, setorEditado) {
    fetch(`http://localhost:8080/cadastro-de-setor/${idSetor}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(setorEditado)
    })
        .then(response => {
            if (response.ok) {
                console.log("localizacao atualizada com sucesso");
                buscarSetoresCadastrados();

            } else {
                console.error("Falha ao atualizar a localizacao");
                buscarSetoresCadastrados();
            }
        })
        .catch(error => {
            console.error("Erro ao fazer a solicitação PUT:", error);
        });
}



