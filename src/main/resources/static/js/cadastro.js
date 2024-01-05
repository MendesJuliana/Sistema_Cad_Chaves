const formulario = document.querySelector('#form-cad');
const inputNome = document.querySelector('#inputNome');
const finalizarBtn = document.querySelector('#button-finalizar');


formulario.addEventListener("submit", function (event) {
    event.preventDefault();
    cadastrarCategoria();

    
});


function cadastrarCategoria(){
    fetch("http://localhost:8080/categoria", 
    {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            nome: inputNome.value
        })
    })
    .then(response => {
    console.log(response);  
       return response.json();  
    })
    .then(response => {
        console.log(response);
    })
    .catch(function (response) { console.log(response) })

    };



