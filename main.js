'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_func')) ?? []
const setLocalStorage = (dbFunc) => localStorage.setItem("db_func", JSON.stringify(dbFunc))

// CRUD - create read update delete
const deleteFunc = (index) => {
    const dbFunc = readFunc()
    dbFunc.splice(index, 1)
    setLocalStorage(dbFunc)
}

const updateFunc = (index, func) => {
    const dbFunc = readFunc()
    dbFunc[index] = func
    setLocalStorage(dbFunc)
}

const readFunc = () => getLocalStorage()

const createFunc = (func) => {
    const dbFunc = getLocalStorage()
    dbFunc.push (func)
    setLocalStorage(dbFunc)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const saveClient = () => {
    
    if (isValidFields()) {
        const func = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            departamento: document.getElementById('departamento').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createFunc(func)
            updateTable()
            closeModal()
        } else {
            updateFunc(index, func)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (func, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${func.nome}</td>
        <td>${func.email}</td>
        <td>${func.celular}</td>
        <td>${func.departamento}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableFunc>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableFunc>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbfunc = readFunc()
    clearTable()
    dbfunc.forEach(createRow)
}

const fillFields = (func) => {
    document.getElementById('nome').value = func.nome
    document.getElementById('email').value = func.email
    document.getElementById('celular').value = func.celular
    document.getElementById('departamento').value = func.departamento
    document.getElementById('nome').dataset.index = func.index
}

const editFunc = (index) => {
    const func = readFunc()[index]
    func.index = index
    fillFields(func)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            document.getElementById("change").innerHTML = "Editar Funcinário";
            editFunc(index)
        } else {
            const func = readFunc()[index]
            const response = confirm(`Deseja realmente excluir o funcinário ${func.nome}`)
            if (response) {
                deleteFunc(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarFuncionário')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableFunc>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)