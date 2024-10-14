import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Spinner from "../layout/Spinner";
import { Fragment, useEffect, useState } from "react";


function EditarProducto() {
    
    // Obtener el ID

    const { id } = useParams();

    // producto = state y funcion para actualizar

    const [producto, guardarProducto] = useState({
        nombre: '',
        precio: '',
        imagen: ''
    })

    // Hook para la navegación
    const navigate = useNavigate(); // Llama a `useNavigate` en el cuerpo del componente

    // archivo = state, guardarArchivo = setState
    const [archivo, guardarArchivo] = useState('');


    // consultar la api para traer el producto a editar

    const consultarAPI = async () => {
        const productoConsulta = await clienteAxios.get(`/productos/${id}`);
        guardarProducto(productoConsulta.data)
    }

    useEffect(() => {
        consultarAPI();
    }, []);



    // Editar un producto en la base de datos
    const editarProducto =  async e => {
        
        e.preventDefault();

        // crear un formdata
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);

        // almacenarlo en la BD

        try {

            const res = await clienteAxios.put(`/productos/${id}`, formData, {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            });

            // lanzar una alerta
            if(res.status === 200) {
                Swal.fire({
                    title: "Editado correctamente",
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

    // extraer los valores del state

    const { nombre, precio, imagen} = producto;

    if(!nombre) return <Spinner />


    return (
        <Fragment>
            <h2> Editar Productos</h2>
            <form
                onSubmit={editarProducto}
            >
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre Producto" 
                        name="nombre"
                        onChange={leerInformacionProducto}
                        defaultValue={nombre} 
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
                        defaultValue={precio}  

                    />
                </div>
            
                <div className="campo">
                    <label>Imagen:</label>
                    { imagen ? (
                        <img src={`${process.env.REACT_APP_BACKEND_URL}/${imagen}`} alt="imagen" 
                            width="300" />
                    ): null}
                    <input 
                        type="file"  
                        name="imagen" 
                        onChange={leerArchivo}

                    />
                </div>

                <div className="enviar">
                        <input type="submit" className="btn btn-azul" value="Agregar Cambios" />
                </div>
            </form>
    </Fragment>
    )
}

export default EditarProducto;