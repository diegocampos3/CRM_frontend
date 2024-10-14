import { useEffect, useState, Fragment, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Producto from "./Producto";
import Spinner from "../layout/Spinner";

// importar el context
import { CRMContext } from '../../context/CRMContext';

function Productos() {
    
      // Hook para la navegación
      const navigate = useNavigate();

    // productos = state, guardarproductos = funcion para guardar el state
    const [productos, guardarProductos] = useState([]);


     // Utilizar valores del context
     const [auth, guardarAuth] = useContext(CRMContext);

    // useEffect para consultar api cuendo cargue
    useEffect( () => {

        if(auth.token != ''){

            try {
                // Query a la API
                const consultarAPI = async () => {
                    const productosConsulta = await clienteAxios.get('/productos',
                        {
                            headers: {
                                Authorization: `Bearer ${auth.token}`
                            }
                        }
                        
                    );
                    guardarProductos(productosConsulta.data)
                }
                
                // llamado a la API
                consultarAPI();
                
            } catch (error) {
                // Error con la autorización
                if(error.response.status = 500){
                    navigate('/iniciar-sesion');
                }
            }
    
        }else{
            navigate('/iniciar-sesion');
        }
        

    }, [productos]);
    

     // Si el state esta como false
     if(!auth.auth){
        navigate('/iniciar-sesion');
    }

    // Spinner de carga
    if(!productos.length) return <Spinner />

    return (
        <Fragment>
            <h2>Productos</h2>

            <Link to={'/productos/nuevo'} className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nuevo Producto 
            </Link>

            <ul className="listado-productos">
                {productos.map(producto => (
                    <Producto 
                        key={producto._id}
                        producto={producto}
                    />
                ))}
            </ul>
        </Fragment>
    )
}

export default Productos;