const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

fetch("../data/productos.json")
.then((resp) => resp.json())
.then((data) => {mostrarProductos(data)});

const contenedorProductos = document.querySelector("#productos");
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoProductos = document.querySelector("#carrito-productos");
const carritoTotal = document.querySelector("#carrito-total");
const vaciarCarrito = document.querySelector("#vaciar-carrito");

function mostrarProductos(productos) {
    productos.forEach ((producto) => {
        let div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-img" src="${producto.img}" alt="">
            <h3>${producto.titulo}</h3>
            <p>$${producto.precio}</p>
        `;

        let button = document.createElement("button");
        button.classList.add("producto-btn");
        button.innerText = "Agregar al carrito";
        button.addEventListener("click", () => {
            agregarAlCarrito(producto);
        })

        div.append(button);
        contenedorProductos.append(div);
    });
}

actualizarCarrito();

const agregarAlCarrito = (producto) => {
    let productoEnCarrito = carrito.find((item) => item.id === producto.id);
    
    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push ({...producto, cantidad: 1});
    }
    actualizarCarrito();

    Toastify({
        text: "Producto agregado",
        avatar: producto.img,
        duration: 3000,
        destination: "../carrito.html",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "rgb(81, 61, 112)",
        },
        onClick: function(){}
      }).showToast();
}

function actualizarCarrito() {
    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
        vaciarCarrito.classList.add("d-none");
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");
        vaciarCarrito.classList.remove("d-none");

        carritoProductos.innerHTML = "";
        carrito.forEach((producto) => {
            let div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <h3>${producto.titulo}</h3>
                <p>$${producto.precio}</p>
                <select class="form-select" aria-label="Default select example">
                </select>
                <p class="total">$${producto.cantidad * producto.precio}</p>
            `;

            let select = div.querySelector("select");
            let totalP = div.querySelector(".total");

            for (let i=1; i<=10; i++) {
                let option = document.createElement("option");
                option.value = i;
                option.textContent = i;
                select.appendChild(option);
            }

            select.value = producto.cantidad;

            select.addEventListener("change", () => {
                const cantidad = parseInt(select.value, 10);
                producto.cantidad = cantidad;
                totalP.innerText = cantidad * producto.precio;
                actualizarTotalCarrito();
                localStorage.setItem("carrito", JSON.stringify(carrito));
            });

            let button = document.createElement("button");
            button.classList.add("carrito-producto-btn");
            button.innerText = "❌";
            button.addEventListener("click", () => {
                borrarDelCarrito(producto);
            });

            div.append(button);
            carritoProductos.append(div);
        });
    }
    actualizarTotalCarrito();

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function borrarDelCarrito(producto) {
    const indice = carrito.findIndex((item) => item.id === producto.id);
    carrito.splice(indice, 1);
    actualizarCarrito();
}

function actualizarTotalCarrito() {
    const totalGeneral = carrito.reduce((total, producto) => {
        return total + (producto.cantidad * producto.precio);
    }, 0);

    carritoTotal.innerText = "$" + totalGeneral;
}

vaciarCarrito.addEventListener("click", () => {
    Swal.fire({
        title: "Seguro querés vaciar el carrito?",
        icon: "question",
        showDenyButton: true,
        denyButtonText: "No",
        confirmButtonText: "Sí"
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.length = 0;
            actualizarCarrito();
        }
    })
    
});