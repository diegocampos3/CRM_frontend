import { Fragment, useEffect, useState } from "react";
import {useNavigate, useParams } from "react-router-dom";

import clienteAxios from "../../config/axios";
import FormBuscarProducto from "./FormBuscarProducto";
import FormCantidadProducto from "./FormCantidadProducto";
import Swal from "sweetalert2";


function NuevoPedido() {

    // Extraer ID de cliente
    const { id } = useParams();

    // state
    const [cliente, guardarCliente] = useState({});
    const [busqueda, guardarBusqueda] = useState('');
    const [productos, guardarProductos] = useState([]);
    const [total, guardarTotal] = useState(0);

    const {nombre, apellido, telefono} = cliente;

    // Hook para la navegación
    const navigate = useNavigate(); // Llama a `useNavigate` en el cuerpo del componente


    useEffect(() =>{
        // obtner el cliente
        const consultarAPI = async () => {
            // consultar el cliente actual
            const resultado = await clienteAxios.get(`/clientes/${id}`);
            guardarCliente(resultado.data);
        }

        // llamar a la API
        consultarAPI();

         // actualizar el total a pagar
         actualizarTotal();

    }, [productos])


    //  Buscar Producto

    const buscarProducto = async e => {
        e.preventDefault();

        // obtenerr los productos de la busqueda
        const resultadoBusqueda = await clienteAxios.post(`/productos/busqueda/${busqueda}`);
        
        // si no hay resultados una alerta, contrario agregarlo al state

        if(resultadoBusqueda.data[0]){
            
            let productoResultado = resultadoBusqueda.data[0];

            // agregar la llave "producto" (copia de id)
            productoResultado.producto = resultadoBusqueda.data[0]._id;
            productoResultado.cantidad = 0;
            
            // ponerlo en el state
            guardarProductos([...productos, productoResultado]);

        }else{
            
            // no hay resultados
            Swal.fire({
                icon: 'error',
                title: 'No resultados',
                text: 'No hay resultados'
            })
        }
        
    }

    // almacenar una busqueda en el state

    const leerDatosBusqueda = e => {
        guardarBusqueda( e.target.value);

    }

    // actualizar la cantidad de productos
    const restarProductos = i => {
        // copiar el arreglo original de productos

        const todosProductos = [...productos]

        // validar si esta en 0 no ouedi ir más alla
        if(todosProductos[i].cantidad === 0) return;

        // decremento
        todosProductos[i].cantidad--;

        // almacenarlo en el state
        guardarProductos(todosProductos);
        
    }

    const aumentarProductos = i => {
        // copiar el arreglo para no mitar el original

        const todosProductos = [...productos];
        // incremento
        todosProductos[i].cantidad++;

        // almacenarlo en el state
        guardarProductos(todosProductos);


    }

    // Elimina un producto del state

    const eliminarProductoPedido = id => {
        const todosProductos = productos.filter(producto => producto.producto !== id);
         guardarProductos(todosProductos);
    }

    // Actualizar el total a pagar
    const actualizarTotal = () => {
        // si el arreglo de porductos es igual a 0: el total es 0
        if(productos.length === 0){
            guardarTotal(0);
            return;
        }

        // calcular el nevo total
        let nuevoTotal = 0;
        // recorrer todos los producots , sus cantidades y precios
        productos.map(producto => nuevoTotal += (producto.cantidad * producto.precio));

        // almacenar el Total
        guardarTotal(nuevoTotal);

    }

    // Almacena el pedido en la DB
    const realizarPedido = async e => {
        e.preventDefault();

        // contruir el objeto
        const pedido = {
        
            "cliente" : id,
            "pedido" : productos,
            "total": total 
        }

        // almacenar en la BD
        const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido)

        // leer resultado

        if(resultado.status === 200){
            Swal.fire({
                icon: 'success',
                title: 'Correcto',
                text: resultado.data.mensaje
            })
        }else{

            Swal.fire({
                icon: 'error',
                title: 'Hubo un error',
                text: 'Vuelva a intentarlo'
            })

        }

        // redireccionar
        navigate('/pedidos');
    }

    return(
      
        <Fragment>
            <h2>Nuevo Pedido</h2>

            <div className="ficha-cliente">
                <h3>Datos de Cliente</h3>
                <p>Nombre: {nombre} {apellido}</p>
                <p>Teléfono: {telefono}</p>
            </div>

            <FormBuscarProducto 
                buscarProducto={buscarProducto}
                leerDatosBusqueda={leerDatosBusqueda}
            
            />
            <ul className="resumen">
                {productos.map((producto, index) => (
                    <FormCantidadProducto 
                        key={producto.producto}
                        producto={producto}
                        restarProductos={restarProductos}
                        aumentarProductos={aumentarProductos}
                        eliminarProductoPedido={eliminarProductoPedido}
                        index={index}

                    
                    />
                ))}
            </ul>
            <p className="total">Total a Pagar: <span>${total}</span></p>
            { total > 0 ? (
                <form
                    onSubmit={realizarPedido}
                >
                    <input 
                        type="submit" 
                        className="btn btn-verde btn-block" 
                        value="Realizar Pedido" />
                </form>
            ): null}
            

        </Fragment>
    )
}


export default NuevoPedido;