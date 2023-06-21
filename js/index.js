
//? nav lateral
const icon = document.querySelector('#icon-menu'),
    menu = document.querySelector('#menu')

    icon.addEventListener('click', (e) => {
    menu.classList.toggle('active')
    document.body.classList.toggle('opacity');

})

import getTodoFromFirebase from './basedatos.js'

const lista = document.getElementById('lista')
const listacarrito = document.getElementById('listacarrito')
const template = document.getElementById('template').content
const template2 = document.getElementById('template2').content
const fragmento = new DocumentFragment()
let listTodo = await getTodoFromFirebase()
let carrito = []

if(!localStorage.getItem('productos') ){
    localStorage.setItem('productos', JSON.stringify(listTodo)) 
}
const saveTodo = () => {
    if (JSON.parse(localStorage.getItem('productos')) === null) {
        localStorage.setItem('productos', JSON.stringify(listTodo))
        return;
    }
    localStorage.setItem('productos', JSON.stringify(listTodo))
    updateTodoFirebase()
}

const updateTodoFirebase = async () => {
    listTodo = JSON.parse(localStorage.getItem('productos'))
    for (let i = 0; i < listTodo.length; i++) {
        const data = await axios.patch(`https://tienda-virtual-fb0df-default-rtdb.firebaseio.com/productos/${i}.json`, listTodo[i])
    }
}

const updateEstado = (idTodo) => {
    listTodo = JSON.parse(localStorage.getItem('productos'))
    listTodo = listTodo.map((item) => {
        if (item.id == idTodo) {
            item.carrito = item.carrito + 1
        }
        carrito = item;
        return item;
    })
    //respaldamos la lista
    saveTodo()
    pintarTodo()
}
const eliminar = (idTodo) => {
    listTodo = JSON.parse(localStorage.getItem('productos'))
    listTodo = listTodo.map((item) => {
        if (item.id == idTodo) {
            item.carrito = item.carrito - 1;
        }
        carrito = item;
        return item;
    })
    //respaldamos la lista
    saveTodo()
    pintarTodo()
}

const updateEstadocar = () => {
    let total = 0;
    let aux=0;
    carrito = JSON.parse(localStorage.getItem('productos'))
    listTodo = JSON.parse(localStorage.getItem('productos'))
            for (let i = 0; i < carrito.length; i++) {
                if (carrito[i].carrito> 0) {
                    total = total + ((carrito[i].precio)*carrito[i].carrito)
                }
            }
            if(total == 0){
                alert('Carrito vacio')
                return
            }
            if (confirm('Confirma la compra ')) {
                window.alert('Precio a pagar: '+ total)
                for (let i = 0; i < carrito.length; i++) {
                    if (carrito[i].carrito > 0) {
                        for (let j = 0; j < listTodo.length; j++) {
                            if(listTodo[j].cantidad > 0){
                                if(carrito[i].id == listTodo[j].id){
                                    listTodo[j].cantidad = carrito[i].cantidad - carrito[i].carrito
                                    carrito[j].carrito = 0;
                                    listTodo[j].carrito = 0;
                                }
                            }else{
                                listTodo[j].carrito = 0;
                                aux=j
                            }
                        }
                    }
                }
            }
            if(aux==1){
                window.alert('Producto agotado')
            }
    //respaldamos la lista
    saveTodo()
    location.reload()
    pintarTodo()
    pintarTodoPrincipal()
}

const eventoComprar = () => { 
    document.getElementById('menu').addEventListener('click', e => {
        e.preventDefault();
        const buy = e.target;
        if (buy.id === 'Comprar') {
            updateEstadocar()
        }

        if(buy.id === 'eliminar-car'){
            eliminar(buy.value)
        }
        e.stopImmediatePropagation();
    })
}

const eventoclick = () => {
    document.getElementById('lista').addEventListener('click', (e) => {
        e.preventDefault();
        const accion = e.target;
        if (accion.id === 'agregar') {
            //Todo: id encontrado --> modificar el estado del todo 
            const idTodo = accion.value
            updateEstado(idTodo);
        }
        e.stopImmediatePropagation();
    })
}

const pintarTodo = () => {
    let con=0
    listacarrito.innerHTML= ''
    carrito = JSON.parse(localStorage.getItem('productos'))
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].carrito>0) {
            con +=1;
            template2.getElementById('img-carrito').src = carrito[i].img;
            template2.getElementById('nom-car').textContent = carrito[i].name;
            template2.getElementById('pre-car').textContent = carrito[i].precio;
            template2.getElementById('eliminar-car').value = carrito[i].id;
            template2.getElementById('cantidad-car').textContent = carrito[i].carrito
            const templateClone2 = template2.cloneNode(true);
            fragmento.appendChild(templateClone2)
        }
    }
    listacarrito.appendChild(fragmento)
    eventoComprar()
    console.log(con);
    if(con === 0){
        listacarrito.innerHTML=`<div class="alert" role="alert">
            <span> Carrito vacio </span>
        </div> `
    }
}

const pintarTodoPrincipal = () => {
    listTodo = JSON.parse(localStorage.getItem('productos'))
    for (let i = 0; i < listTodo.length; i++) {
        template.getElementById('img').src = listTodo[i].img;
        template.getElementById('nom').textContent = listTodo[i].name;
        template.getElementById('pre').textContent = listTodo[i].precio;
        template.getElementById('cantidad').textContent = listTodo[i].cantidad
        template.getElementById('agregar').value = listTodo[i].id
        const templateClone = template.cloneNode(true);
        fragmento.appendChild(templateClone)
    }
    lista.appendChild(fragmento)
    eventoclick()
}
pintarTodoPrincipal()
document.addEventListener('DOMContentLoaded', (event) => {
    event.preventDefault()
    pintarTodo()
    pintarTodoPrincipal()
})
