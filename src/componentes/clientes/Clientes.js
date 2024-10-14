
import { Fragment, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// importar clientes axios
import clienteAxios from '../../config/axios';

import Cliente from './Cliente';
import Spinner from '../layout/Spinner';


// importar el context
import { CRMContext } from '../../context/CRMContext';


function Clientes() {

     // Hook para la navegación
     const navigate = useNavigate();

    // Trabajar con el State
    // clientes = state, guardarClientes = funci'on para guardar e state
    const [clientes, guardarCliente] = useState([]);

    // Utilizar valores del context
    const [auth, guardarAuth] = useContext(CRMContext);


    // use effect es similar a componentdidmount y willmount
    useEffect( () => {

        if(auth.token !== ''){
            // Query a la API
            const consultarAPI = async () => {
                try {
                    const clientesConsulta = await clienteAxios.get('/clientes', 
                        
                        {
                            headers: {
                                Authorization: `Bearer ${auth.token}`
                            }
                        }
                    );
            
                    // colocar el resultado en el state
                    guardarCliente(clientesConsulta.data);

                } catch (error) {
                    // Error con la autorización
                    if(error.response.status = 500){
                        navigate('/iniciar-sesion');
                    }
                }
            }
            consultarAPI();

        }else{
            navigate('/iniciar-sesion');
        }

    }, [clientes] );

    // Si el state esta como false
    if(!auth.auth){
        navigate('/iniciar-sesion');
    }

    // Spinner de carga
    if(!clientes.length) return <Spinner />

    return(
        <Fragment>
            <h2>Clientes</h2>

            <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nuevo Cliente
            </Link>

            <ul className='listado-clientes'>
                {clientes.map(cliente => 
                <Cliente 
                    key={cliente._id}
                    cliente={cliente}
                />
                )}
            </ul>
        </Fragment>
    )

}

export default Clientes;