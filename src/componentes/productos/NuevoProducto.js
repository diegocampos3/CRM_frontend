import { Fragment, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";

function NuevoProducto() {
    
    //producto = state, guardarProducto = setsate

    const [producto, guardarProducto] = useState({
        nombre: '',
        precio: ''
    });

    // archivo = state, guardarArchivo = setState
    const [archivo, guardarArchivo] = useState('');


     // Hook para la navegación
     const navigate = useNavigate(); // Llama a `useNavigate` en el cuerpo del componente


    // Almacena nuevo producto en la base de datos
    const agregarProducto = async e => {
        e.preventDefault();

        // crear un formdata
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);

        // almacenarlo en la BD

        try {

            const res = await clienteAxios.post('/productos', formData, {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            });

            // lanzar una alerta
            if(res.status === 200) {
                Swal.fire({
                    title: "Producto agregado correctamente",
                    text: res.data.mensaje,
                    icon: "success"
                });
            }

            // redireccionar
            navigate('/productos')
            
        } catch (error) {
            console.log(error);

            // lanzar una alerta
            Swal.fire({
                icon: "error",
                title: "Hubo un error",
                text: "Vuelva a intentarlo"
            })
        }
    }

    // Leer los datos del formulario
    const leerInformacionProducto = e => {
        guardarProducto({
            // obtner una copia del state y agregar el nuevo
            ...producto,
            [e.target.name] : e.target.value
        })
    }

    // Colocar la imagen en el state

    const leerArchivo = e => {

        guardarArchivo(e.target.files[0]);
    }
    
    return (
        <Fragment>
            <form
                onSubmit={agregarProducto}
            >
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre Producto" 
                        name="nombre"
                        onChange={leerInformacionProducto} 
                    />
                </div>

                <div className="campo">
                    <label>Precio:</label>
                    <input 
                        type="number" 
                        name="precio" 
                        min="0.00" 
                        step="1" 
                        placeholder="Precio" 
                        onChange={leerInformacionProducto} 

                    />
                </div>
            
                <div className="campo">
                    <label>Imagen:</label>
                    <input 
                        type="file"  
                        name="imagen" 
                        onChange={leerArchivo}
                    />
                </div>

                <div className="enviar">
                        <input type="submit" className="btn btn-azul" value="Agregar Producto" />
                </div>
            </form>
        </Fragment>
    )
}

export default NuevoProducto;