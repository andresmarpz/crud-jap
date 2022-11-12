const url = 'https://63650928f711cb49d1f33424.mockapi.io/users/'

function activarBoton(inputNombre, inputApellido, boton){
	if(inputNombre.value && inputApellido.value)
		boton.removeAttribute('disabled')
	else
		boton.setAttribute('disabled', "true")
}

function mostrarAlerta(){
	document.getElementById('alert-error').classList.add('show');

	setTimeout(() => document.getElementById('alert-error').classList.remove('show'), 3000)
}

document.addEventListener('DOMContentLoaded', () => {
	/**
	 * Buscar
	 */
	document.getElementById('btnGet1').addEventListener('click', async() => {
		const input = document.getElementById('inputGet1Id');
		const usuarios = await buscar(input.value)
		mostrarUsuarios(usuarios)
	})

	/**
	 * Agregar
	 */
	const botonAgregar = document.getElementById('btnPost');
	const inputNombre = document.getElementById('inputPostNombre');
	const inputApellido = document.getElementById('inputPostApellido');

	inputNombre.addEventListener('input', () => {
		activarBoton(inputNombre, inputApellido, botonAgregar)
	})

	inputApellido.addEventListener('input', () => {
		activarBoton(inputNombre, inputApellido, botonAgregar)
	})

	botonAgregar.addEventListener('click', () => {
		if(inputNombre.value && inputApellido.value) 
			agregar(inputNombre.value, inputApellido.value)
	})

	/**
	 * Modificar
	 */

	const inputId = document.getElementById('inputPutId');

	inputId.addEventListener('input', () => {
		if(inputId.value)
			botonModificar.removeAttribute('disabled')
		else
			botonModificar.setAttribute('disabled', "true")
	})

	const nombre = document.getElementById('inputPutNombre')
	const apellido = document.getElementById('inputPutApellido')
	const botonGuardar = document.getElementById('btnSendChanges');
	nombre.addEventListener('input', () => {
		activarBoton(nombre, apellido, botonGuardar)
	})
	apellido.addEventListener('input', () => {
		activarBoton(nombre, apellido, botonGuardar)
	})

	botonGuardar.addEventListener('click', async() => {
		const id = inputId.value;
		modificar(id, nombre.value, apellido.value)
	})

	const botonModificar = document.getElementById('btnPut');
	botonModificar.addEventListener('click', async() => {
		const id = inputId.value;
		const usuario = await buscar(id);
		nombre.value = usuario.name;
		apellido.value = usuario.lastname;
	})

	/**
	 * Eliminar
	 */
	const inputDelete = document.getElementById('inputDelete');
	const botonDelete = document.getElementById('btnDelete');

	inputDelete.addEventListener('input', () => {
		if(inputDelete.value)
			botonDelete.removeAttribute('disabled')
		else
			botonDelete.setAttribute('disabled', 'true')
	})

	botonDelete.addEventListener('click', () => {
		const id = inputDelete.value;
		eliminar(id)
	})
})


async function buscar(id = ''){
	const data = await fetch(url +id).then(res => {
		if(!res.ok){
			mostrarAlerta()
			return;
		}

		return res.json()
	})
	return data;
}

async function agregar(nombre, apellido){
	const data = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: nombre,
			lastname: apellido
		})
	})

	const usuariosNuevos = await buscar()
	mostrarUsuarios(usuariosNuevos)
}

async function modificar(id, nombre, apellido){
	const res = await fetch(url +id, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: nombre,
			lastname: apellido
		})
	})
	if(!res.ok){
		mostrarAlerta()
		return;
	}

	const usuariosNuevos = await buscar()
	mostrarUsuarios(usuariosNuevos)


	var modal = bootstrap.Modal.getInstance(document.getElementById('dataModal'))
	modal.hide()
}

async function eliminar(id){
	const res = await fetch(url + id, {
		method: 'DELETE'
	})
	if(!res.ok){
		mostrarAlerta()
		return;
	}

	const usuariosNuevos = await buscar()
	mostrarUsuarios(usuariosNuevos)
}

function mostrarUsuarios(usuarios){
	const lista = document.getElementById('results');

	let html = ''
	for(let usuario of usuarios){
		html += `
			<li>
				<div>ID: ${usuario.id}</div>
				<div>NAME: ${usuario.name}</div>
				<div>LASTNAME: ${usuario.lastname}</div>
			</li>
		`
	}

	lista.innerHTML = html;
}